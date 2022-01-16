import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateFakeWallet } from '../../test/wallet/wallet.mock';
import { generateFakeUser } from '../../test/user/user.mock';
import { generateFakeFlat } from '../../test/flat/flat.mock';
import type { MockType } from '../../test/mockType';
import { IWallet } from '@interfaces/wallet.interface';
import { SseService } from '../sse/sse.service';

const mockWalletRepositoryFactory: () => MockType<Repository<Wallet>> = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

const mockSseServiceFactory: () => MockType<SseService> = () => ({
  emit: jest.fn(),
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
        {
          provide: SseService,
          useFactory: mockSseServiceFactory,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    repository = module.get(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new wallet', async () => {
      const user = generateFakeUser(1);

      const expected: IWallet = {
        ...generateFakeWallet(user),
        balance: 0,
      };

      jest.spyOn(repository, 'create').mockResolvedValue(expected);
      jest.spyOn(repository, 'save').mockResolvedValue(expected);

      expect(await service.create(user)).toEqual(expected);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all wallets of a flat', async () => {
      const flat = generateFakeFlat();
      const user1 = generateFakeUser(flat.id);
      const user2 = generateFakeUser(flat.id);
      const user3 = generateFakeUser(flat.id);

      const expected: IWallet[] = [
        generateFakeWallet(user1),
        generateFakeWallet(user2),
        generateFakeWallet(user3),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expected);

      expect(await service.findAll(flat.id)).toEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return wallet with matching id', async () => {
      const flat = generateFakeFlat();
      const user = generateFakeUser(flat.id);

      const expected: IWallet = {
        ...generateFakeWallet(user),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expected);

      expect(await service.findOneById(expected.id)).toEqual(expected);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('findOneByUserId', () => {
    it('should return wallet owned by matching user', async () => {
      const flat = generateFakeFlat();
      const user = generateFakeUser(flat.id);

      const expected: IWallet = {
        ...generateFakeWallet(user),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expected);

      expect(await service.findOneByUserId(user.id, flat.id)).toEqual(expected);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });
});
