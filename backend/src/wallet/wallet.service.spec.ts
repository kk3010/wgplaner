import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateFakeWallet } from '../../test/wallet/wallet.mock';
import { generateFakeUser } from '../../test/user/user.mock';
import type { MockType } from '../../test/mockType';
import type { IUser } from '../interfaces/user.interface';

const mockWalletRepositoryFactory: () => MockType<Repository<Wallet>> = () => ({
  update: jest.fn(),
});

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

  describe('updateBalance', () => {
    it('sets the new amount to oldAmount + value', async () => {
      const user = generateFakeUser(1);
      const wallet = generateFakeWallet(user);
      jest
        .spyOn(service, 'findOneByUserId')
        .mockResolvedValue(wallet as Wallet);
      await service.updateBalance(user, 100);
      expect(repository.update).toHaveBeenCalledWith(wallet.id, {
        balance: wallet.balance + 100,
      });
    });
  });
});
