import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [IndexerService, PrismaService],
})
export class IndexerModule {}
