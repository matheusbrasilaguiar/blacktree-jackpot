import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet } from './somniaChain'; // assuming same structure, will create this

const abi = parseAbi([
  'function drawTargetTimestamp() view returns (uint256)',
  'function getParticipants() view returns (address[])',
  'function state() view returns (uint8)',
  'function drawBlock() view returns (uint256)',
  'function closeRound() external',
  'function executeDraw() external',
]);

@Injectable()
export class KeeperService {
  private readonly logger = new Logger(KeeperService.name);
  private isExecuting = false;
  private publicClient: any;
  private walletClient: any;
  private account: any;
  private readonly contractAddress: `0x${string}`;

  constructor(private configService: ConfigService) {
    const rawAddress = this.configService.get<string>('NEXT_PUBLIC_JACKPOT_CONTRACT_ADDRESS');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    this.contractAddress = rawAddress as `0x${string}`;

    if (!privateKey || !this.contractAddress) {
      throw new Error(`Missing KEEP PRIVATE_KEY or CONTRACT_ADDRESS in .env. ADDRESS: ${this.contractAddress} KEY: ${!!privateKey}`);
    }

    this.account = privateKeyToAccount(
      privateKey.startsWith('0x') ? (privateKey as `0x${string}`) : `0x${privateKey}`,
    );

    this.publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(),
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: somniaTestnet,
      transport: http(),
    });

    this.logger.log(`Keeper Initialized: ${this.account.address}`);
  }

  // Check every second to execute the draw when ready
  @Cron(CronExpression.EVERY_SECOND)
  async checkAndDraw() {
    if (this.isExecuting) return;

    try {
      const [targetTimestamp, participants, stateVal, drawBlockVal] = await Promise.all([
        this.publicClient.readContract({
          address: this.contractAddress,
          abi,
          functionName: 'drawTargetTimestamp',
        }),
        this.publicClient.readContract({
          address: this.contractAddress,
          abi,
          functionName: 'getParticipants',
        }),
        this.publicClient.readContract({
          address: this.contractAddress,
          abi,
          functionName: 'state',
        }),
        this.publicClient.readContract({
          address: this.contractAddress,
          abi,
          functionName: 'drawBlock',
        }),
      ]);

      const target = Number(targetTimestamp);
      const playerCount = (participants as any[]).length;
      const state = Number(stateVal); // 0 = OPEN, 1 = DRAWING
      const drawBlock = Number(drawBlockVal);
      const now = Math.floor(Date.now() / 1000);

      // Phase 1: Close the round if time is up
      if (state === 0 && target > 0 && playerCount >= 2 && now >= target) {
        this.isExecuting = true;
        this.logger.log('Target timestamp reached! Triggering closeRound()...');

        try {
          const { request } = await this.publicClient.simulateContract({
            account: this.account,
            address: this.contractAddress,
            abi,
            functionName: 'closeRound',
          });
          const hash = await this.walletClient.writeContract(request);
          this.logger.log(`[closeRound] Transaction Sent: ${hash}`);
          await this.publicClient.waitForTransactionReceipt({ hash });
          this.logger.log('[closeRound] Confirmed! Waiting for blockhash...');
        } catch (txError) {
          this.logger.error('Failed to close round:', txError);
        } finally {
          setTimeout(() => { this.isExecuting = false; }, 3000);
        }
        return;
      }

      // Phase 2: Execute the draw once the commit block is mined
      if (state === 1) {
        const currentBlock = Number(await this.publicClient.getBlockNumber());
        if (currentBlock > drawBlock) {
            this.isExecuting = true;
            this.logger.log(`Drawing phase! Current Block ${currentBlock} > Target ${drawBlock}. Executing Draw...`);
    
            try {
              const { request } = await this.publicClient.simulateContract({
                account: this.account,
                address: this.contractAddress,
                abi,
                functionName: 'executeDraw',
              });
              const hash = await this.walletClient.writeContract(request);
              this.logger.log(`[executeDraw] Transaction Sent: ${hash}`);
              await this.publicClient.waitForTransactionReceipt({ hash });
              this.logger.log('[executeDraw] Confirmed! Draw successful and totally fair.');
            } catch (txError) {
              this.logger.error('Failed to execute draw:', txError);
            } finally {
              setTimeout(() => { this.isExecuting = false; }, 3000);
            }
        } else {
            // Still waiting for blocks to mine
        }
      }
    } catch (error) {
      if (!error.message.includes("contract is not deployed")) {
          // ignore typical rpc noises
          this.logger.error('Error reading contract state:', error);
      }
    }
  }
}
