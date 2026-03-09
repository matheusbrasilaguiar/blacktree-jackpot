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

  onModuleInit() {
    this.logger.log(`Starting Indexer for Contract: ${this.contractAddress}`);
    this.startWatching();
  }

  onModuleDestroy() {
    if (this.unwatch) {
      this.unwatch();
      this.logger.log('Stopped watching events.');
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
      // Upsert to ensure we don't accidentally duplicate if the RPC node rebroadcasts
      await this.prisma.drawHistory.upsert({
        where: { roundId: roundIdNum },
        update: {},
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
        },
      });
      this.logger.log(`Successfully Indexed Round ${roundIdNum} | Winner: ${first}`);
    } catch (e) {
      this.logger.error(`Failed to save round ${roundIdNum} to Database`, e);
    }
  }
}
