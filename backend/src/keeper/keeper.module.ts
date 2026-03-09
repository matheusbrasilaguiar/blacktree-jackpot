import { Module } from '@nestjs/common';
import { KeeperService } from './keeper.service';

@Module({
  providers: [KeeperService],
})
export class KeeperModule {}
