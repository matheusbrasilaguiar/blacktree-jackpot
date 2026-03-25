import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet } from './somniaChain';

const doubleAbi = parseAbi([
  'function drawTargetTimestamp() view returns (uint256)',
  'function state() view returns (uint8)',
]);

const handlerAbi = parseAbi([
  'function onEvent(bytes calldata data) external',
]);

@Injectable()
export class DoubleKeeperService {
  private readonly logger = new Logger(DoubleKeeperService.name);
  private isExecuting = false;
  private publicClient: any;
  private walletClient: any;
  private account: any;
  private readonly doubleAddress: `0x${string}`;
  private readonly handlerAddress: `0x${string}`;

  constructor(private configService: ConfigService) {
    const doubleAddress = this.configService.get<string>('NEXT_PUBLIC_DOUBLE_CONTRACT_ADDRESS');
    const handlerAddress = this.configService.get<string>('NEXT_PUBLIC_DOUBLE_HANDLER_ADDRESS');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!privateKey || !doubleAddress || !handlerAddress) {
      this.logger.warn(`Missing Double env vars in .env. Skipping Double Keeper init.`);
      return;
    }

    this.doubleAddress = doubleAddress as `0x${string}`;
    this.handlerAddress = handlerAddress as `0x${string}`;
    this.account = privateKeyToAccount(privateKey.startsWith('0x') ? (privateKey as `0x${string}`) : `0x${privateKey}`);

    this.publicClient = createPublicClient({ chain: somniaTestnet, transport: http() });
    this.walletClient = createWalletClient({ account: this.account, chain: somniaTestnet, transport: http() });

    this.logger.log(`DoubleKeeper Initialized: watching ${this.doubleAddress} | handler: ${this.handlerAddress}`);
  }

  @Cron(CronExpression.EVERY_SECOND)
  async checkAndDraw() {
    if (this.isExecuting || !this.doubleAddress || !this.handlerAddress) return;

    try {
      const targetTimestamp = await this.publicClient.readContract({
        address: this.doubleAddress,
        abi: doubleAbi,
        functionName: 'drawTargetTimestamp',
      });
      const stateVal = await this.publicClient.readContract({
        address: this.doubleAddress,
        abi: doubleAbi,
        functionName: 'state',
      });

      const target = Number(targetTimestamp);
      const state = Number(stateVal); // 0 = OPEN
      const now = Math.floor(Date.now() / 1000);

      // Trigger if time is up and round is still OPEN
      if (state === 0 && target > 0 && now >= target) {
        this.isExecuting = true;
        this.logger.log(`[Double] Time is up (now: ${now} >= target: ${target}). Calling DoubleHandler.onEvent()`);

        try {
          const { request } = await this.publicClient.simulateContract({
            account: this.account,
            address: this.handlerAddress,
            abi: handlerAbi,
            functionName: 'onEvent',
            args: ['0x']
          });
          const hash = await this.walletClient.writeContract(request);
          this.logger.log(`[Double Draw] TX sent: ${hash} - Simulating Somnia Schedule Reactivity!`);
          await this.publicClient.waitForTransactionReceipt({ hash });
          this.logger.log(`[Double Draw] Confirmed! Draw successful, winners payed, next round scheduled.`);
        } catch (e: any) {
          this.logger.error(`[Double Draw] failed: ${e.message}`);
        } finally {
          setTimeout(() => { this.isExecuting = false; }, 3000);
        }
      }
    } catch (e: any) {
      if (!e.message.includes("contract is not deployed")) {
        // Suppress common RPC errors on uninitialized contracts
      }
    }
  }
}
