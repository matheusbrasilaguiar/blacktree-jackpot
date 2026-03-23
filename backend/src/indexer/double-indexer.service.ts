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

  onModuleInit() {
    if (this.contractAddress !== '0x0') {
        this.logger.log(`Starting DoubleIndexer for Contract: ${this.contractAddress}`);
        this.startWatching();
    }
  }

  onModuleDestroy() {
    if (this.unwatchRoundResult) this.unwatchRoundResult();
    if (this.unwatchBetPlaced) this.unwatchBetPlaced();
    this.logger.log('Stopped watching Double events.');
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
      await this.prisma.doubleRoundResult.upsert({
        where: { roundId: roundIdNum },
        update: {},
        create: {
          roundId: roundIdNum,
          number: num,
          color: col,
          totalPayout: payoutStr,
        },
      });
      this.logger.log(`[Double] Indexed RoundResult ${roundIdNum} | Color: ${col} | Payout: ${payoutStr}`);
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
      await this.prisma.doubleBet.create({
        data: {
          roundId: roundIdNum,
          player: player,
          color: col,
          amount: amountVal,
        },
      });
      this.logger.log(`[Double] Indexed Bet | ${player} bet ${amountVal} on color ${col}`);
    } catch (e) {
      this.logger.error(`[Double] Failed to save bet from ${player}`, e);
    }
  }
}
