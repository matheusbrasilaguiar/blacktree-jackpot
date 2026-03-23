import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { DoubleIndexerService } from './double-indexer.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [IndexerService, DoubleIndexerService, PrismaService],
})
export class IndexerModule {}
