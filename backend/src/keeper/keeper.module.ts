import { Module } from '@nestjs/common';
import { KeeperService } from './keeper.service';
import { DoubleKeeperService } from './double-keeper.service';

@Module({
  providers: [KeeperService, DoubleKeeperService],
})
export class KeeperModule {}
