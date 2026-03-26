import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { somniaTestnet } from '../keeper/somniaChain';
import { PrismaService } from '../prisma.service';

const abi = parseAbi([
  'event JackpotWon(uint256 indexed roundId, address first, address second, address third, uint256 totalPrize)',
]);

@Injectable()
export class IndexerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IndexerService.name);
  private publicClient: any;
  private readonly contractAddress: `0x${string}`;
  private unwatch: (() => void) | null = null;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
    const rawAddress = this.configService.get<string>('NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS');
    this.contractAddress = rawAddress as `0x${string}`;

    this.publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(),
    });
  }

  async onModuleInit() {
    this.logger.log(`Starting Indexer for Contract: ${this.contractAddress}`);
    await this.catchUp();
    this.startWatching();
  }

  onModuleDestroy() {
    if (this.unwatch) {
      this.unwatch();
      this.logger.log('Stopped watching events.');
    }
  }

  private async catchUp() {
    try {
        const syncState = await (this.prisma as any).syncState.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, lastDoubleBlock: 0n, lastJackpotBlock: 0n }
        });

        let fromBlock = syncState.lastJackpotBlock === 0n ? 8800000n : syncState.lastJackpotBlock + 1n; // Start from 8.8M if fresh
        const latestBlock = await this.publicClient.getBlockNumber();

        if (fromBlock > latestBlock) {
            this.logger.log(`[Jackpot] Already sync'd up to block ${latestBlock.toString()}`);
            return;
        }

        this.logger.log(`[Jackpot] Catching up from block ${fromBlock.toString()} to ${latestBlock.toString()}`);

        const CHUNK_SIZE = 1000n;
        for (let current = fromBlock; current <= latestBlock; current += CHUNK_SIZE) {
            const toBlock = current + CHUNK_SIZE - 1n > latestBlock ? latestBlock : current + CHUNK_SIZE - 1n;
            
            this.logger.log(`[Jackpot] Fetching logs [${current} - ${toBlock}]`);
            
            const logs = await this.publicClient.getContractEvents({
                address: this.contractAddress,
                abi,
                eventName: 'JackpotWon',
                fromBlock: current,
                toBlock: toBlock,
            });

            for (const log of logs) {
                await this.handleJackpotWon(log);
            }

            // Update sync state
            await (this.prisma as any).syncState.update({
                where: { id: 1 },
                data: { lastJackpotBlock: toBlock }
            });

            // Small delay to avoid RPC spam
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        this.logger.log(`[Jackpot] Catch-up complete at block ${latestBlock.toString()}`);
    } catch (e) {
        this.logger.error('[Jackpot] Catch-up failed', e);
    }
  }

  private startWatching() {
    try {
      this.unwatch = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi,
        eventName: 'JackpotWon',
        onLogs: async (logs: any) => {
          for (const log of logs) {
            await this.handleJackpotWon(log);
            await (this.prisma as any).syncState.update({
                where: { id: 1 },
                data: { lastJackpotBlock: log.blockNumber }
            });
          }
        },
      });
    } catch (error) {
      this.logger.error('Failed to start watcher', error);
    }
  }

  private async handleJackpotWon(log: any) {
    const { roundId, first, second, third, totalPrize } = log.args;
    const roundIdNum = Number(roundId);
    const totalStt = Number(formatEther(totalPrize));
    const fee = totalStt * 0.05;

    let winner1Prize = 0;
    let winner2Prize = null;
    let winner3Prize = null;

    if (second === '0x0000000000000000000000000000000000000000') {
        winner1Prize = totalStt - fee;
    } else if (third === '0x0000000000000000000000000000000000000000') {
        winner1Prize = totalStt * 0.75;
        winner2Prize = totalStt - fee - (totalStt * 0.75);
    } else {
        winner1Prize = totalStt * 0.70;
        winner2Prize = totalStt * 0.20;
        winner3Prize = totalStt - fee - (totalStt * 0.70) - (totalStt * 0.20);
    }

    try {
      await (this.prisma.drawHistory as any).upsert({
        where: { roundId: roundIdNum },
        update: {
            transactionHash: log.transactionHash
        },
        create: {
          roundId: roundIdNum,
          jackpot: totalStt,
          participants: third !== '0x0000000000000000000000000000000000000000' ? 3 : (second !== '0x0000000000000000000000000000000000000000' ? 2 : 1),
          winner1: first,
          winner2: second !== '0x0000000000000000000000000000000000000000' ? second : null,
          winner3: third !== '0x0000000000000000000000000000000000000000' ? third : null,
          winner1Prize,
          winner2Prize,
          winner3Prize,
          transactionHash: log.transactionHash,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to save round ${roundIdNum} to Database`, e);
    }
  }
}
