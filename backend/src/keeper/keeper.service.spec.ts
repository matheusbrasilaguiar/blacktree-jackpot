import { Test, TestingModule } from '@nestjs/testing';
import { KeeperService } from './keeper.service';

describe('KeeperService', () => {
  let service: KeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeeperService],
    }).compile();

    service = module.get<KeeperService>(KeeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
