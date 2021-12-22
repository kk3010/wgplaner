import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { MockType } from '../../test/mockType';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockWalletRepositoryFactory: () => MockType<Repository<Wallet>> =
  () => ({});

describe('WalletService', () => {
  let service: WalletService;
  let repository: MockType<Repository<Wallet>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useFactory: mockWalletRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    repository = module.get(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
