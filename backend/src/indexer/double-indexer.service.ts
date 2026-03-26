import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { somniaTestnet } from '../keeper/somniaChain';
import { PrismaService } from '../prisma.service';

const abi = parseAbi([
  'event RoundResult(uint256 indexed roundId, uint8 number, uint8 indexed color, uint256 totalPayout)',
  'event BetPlaced(address indexed player, uint8 indexed color, uint256 amount, uint256 newColorTotal, uint256 roundId)',
]);

@Injectable()
export class DoubleIndexerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DoubleIndexerService.name);
  private publicClient: any;
  private readonly contractAddress: `0x${string}`;
  private unwatchRoundResult: (() => void) | null = null;
  private unwatchBetPlaced: (() => void) | null = null;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
    const rawAddress = this.configService.get<string>('NEXT_PUBLIC_DOUBLE_CONTRACT_ADDRESS');
    if (!rawAddress) {
        this.logger.warn('No Double Contract Address found. DoubleIndexer will not start.');
    }
    this.contractAddress = (rawAddress || '0x0') as `0x${string}`;

    this.publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(),
    });
  }

  async onModuleInit() {
    if (this.contractAddress !== '0x0') {
        this.logger.log(`Starting DoubleIndexer for Contract: ${this.contractAddress}`);
        await this.catchUp();
        this.startWatching();
    }
  }

  onModuleDestroy() {
    if (this.unwatchRoundResult) this.unwatchRoundResult();
    if (this.unwatchBetPlaced) this.unwatchBetPlaced();
    this.logger.log('Stopped watching Double events.');
  }

  private async catchUp() {
    try {
        const syncState = await (this.prisma as any).syncState.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, lastDoubleBlock: 0n, lastJackpotBlock: 0n }
        });

        let fromBlock = syncState.lastDoubleBlock === 0n ? 8800000n : syncState.lastDoubleBlock + 1n; // Start from 8.8M if fresh
        const latestBlock = await this.publicClient.getBlockNumber();

        if (fromBlock > latestBlock) {
            this.logger.log(`[Double] Already sync'd up to block ${latestBlock.toString()}`);
            return;
        }

        this.logger.log(`[Double] Catching up from block ${fromBlock.toString()} to ${latestBlock.toString()}`);

        // Process in chunks of 1000 blocks to avoid RPC timeouts
        const CHUNK_SIZE = 1000n;
        for (let current = fromBlock; current <= latestBlock; current += CHUNK_SIZE) {
            const toBlock = current + CHUNK_SIZE - 1n > latestBlock ? latestBlock : current + CHUNK_SIZE - 1n;
            
            this.logger.log(`[Double] Fetching logs [${current} - ${toBlock}]`);
            
            const [resultLogs, betLogs] = await Promise.all([
                this.publicClient.getContractEvents({
                    address: this.contractAddress,
                    abi,
                    eventName: 'RoundResult',
                    fromBlock: current,
                    toBlock: toBlock,
                }),
                this.publicClient.getContractEvents({
                    address: this.contractAddress,
                    abi,
                    eventName: 'BetPlaced',
                    fromBlock: current,
                    toBlock: toBlock,
                })
            ]);

            for (const log of resultLogs) await this.handleRoundResult(log);
            for (const log of betLogs) await this.handleBetPlaced(log);

            // Update sync state
            await (this.prisma as any).syncState.update({
                where: { id: 1 },
                data: { lastDoubleBlock: toBlock }
            });
        }
        
        this.logger.log(`[Double] Catch-up complete at block ${latestBlock.toString()}`);
    } catch (e) {
        this.logger.error('[Double] Catch-up failed', e);
    }
  }

  private startWatching() {
    try {
      this.unwatchRoundResult = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi,
        eventName: 'RoundResult',
        onLogs: async (logs: any) => {
          for (const log of logs) {
            await this.handleRoundResult(log);
            // Update sync state for real-time events too
            await (this.prisma as any).syncState.update({
               where: { id: 1 },
               data: { lastDoubleBlock: log.blockNumber }
            });
          }
        },
      });

      this.unwatchBetPlaced = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi,
        eventName: 'BetPlaced',
        onLogs: async (logs: any) => {
          for (const log of logs) {
            await this.handleBetPlaced(log);
            await (this.prisma as any).syncState.update({
               where: { id: 1 },
               data: { lastDoubleBlock: log.blockNumber }
            });
          }
        },
      });
    } catch (error) {
      this.logger.error('Failed to start Double watcher', error);
    }
  }

  private async handleRoundResult(log: any) {
    const { roundId, number, color, totalPayout } = log.args;
    const roundIdNum = Number(roundId);
    const num = Number(number);
    const col = Number(color);
    const payoutStr = Number(formatEther(totalPayout || 0n));

    try {
      await (this.prisma.doubleRoundResult as any).upsert({
        where: { roundId: roundIdNum },
        update: {
            transactionHash: log.transactionHash
        },
        create: {
          roundId: roundIdNum,
          number: num,
          color: col,
          totalPayout: payoutStr,
          transactionHash: log.transactionHash
        },
      });
    } catch (e) {
      this.logger.error(`[Double] Failed to save result ${roundIdNum}`, e);
    }
  }

  private async handleBetPlaced(log: any) {
    const { player, color, amount, roundId } = log.args;
    const roundIdNum = Number(roundId);
    const col = Number(color);
    const amountVal = Number(formatEther(amount));

    try {
      await (this.prisma.doubleBet as any).upsert({
        where: { 
            roundId_player_color_amount_transactionHash: {
                roundId: roundIdNum,
                player: player,
                color: col,
                amount: amountVal,
                transactionHash: log.transactionHash
            }
        },
        update: {},
        create: {
          roundId: roundIdNum,
          player: player,
          color: col,
          amount: amountVal,
          transactionHash: log.transactionHash
        },
      });
    } catch (e) {
      this.logger.error(`[Double] Failed to save bet from ${player}`, e);
    }
  }
}
