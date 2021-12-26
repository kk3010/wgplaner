import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { MockType } from '../../test/mockType';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateFakeUser } from '../../test/user/user.mock';
import { generateFakeShoppingItem } from '../../test/shopping-item/shoppingItem.mock';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import type { IPurchase } from '../../src/interfaces/purchase.interface';
import { generateFakePurchase } from '../../test/purchase/purchase.mock';
import { WalletService } from '../wallet/wallet.service';

const mockPurchaseRepositoryFactory: () => MockType<Repository<Purchase>> =
  () => ({
    create: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

const mockWalletServiceFactory: () => MockType<WalletService> = () => ({
  updateBalance: jest.fn(),
});

describe('PurchaseService', () => {
  let service: PurchaseService;
  let repository: MockType<Repository<Purchase>>;
  let walletService: MockType<WalletService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useFactory: mockPurchaseRepositoryFactory,
        },
        {
          provide: WalletService,
          useFactory: mockWalletServiceFactory,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    repository = module.get(getRepositoryToken(Purchase));
    walletService = module.get(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new purchase', async () => {
      const user = generateFakeUser(1);

      const shoppingItems = [
        generateFakeShoppingItem(user.flatId, 1),
        generateFakeShoppingItem(user.flatId, 1),
      ];

      const body: CreatePurchaseDto = {
        name: 'Purchase',
        price: 22.2,
        shoppingItems: shoppingItems.map(({ id }) => id),
        payers: [user.id],
      };

      const expected: Omit<IPurchase, 'id'> = {
        ...body,
        flatId: user.flatId,
        buyerId: user.id,
        shoppingItems,
        payers: [user],
      };

      jest.spyOn(repository, 'create').mockResolvedValue(expected);
      jest.spyOn(repository, 'save').mockResolvedValue(expected);

      expect(await service.create(user, body)).toEqual(expected);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(walletService.updateBalance).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOneById', () => {
    it('should return the found purchase', async () => {
      const expected = generateFakePurchase();
      jest.spyOn(repository, 'findOne').mockResolvedValue(expected);
      expect(await service.findOneById(1)).toEqual(expected);
    });

    it('should throw when no purchase is found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('calls repository.find', async () => {
      await service.findAll(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { flatId: 1 } });
    });
  });

  describe('update', () => {
    it('calls findOneById and then save', async () => {
      const expected = generateFakePurchase();
      const findOne = jest
        .spyOn(service, 'findOneById')
        .mockResolvedValue(expected as Purchase);
      await service.update(1, { name: 'test' });
      expect(findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith({
        ...expected,
        name: 'test',
      });
    });
  });
});
