import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { IShoppingItem } from '../interfaces/shopping-item.interface';
import type { MockType } from '../../test/mockType';
import { generateFakeUser } from '../../test/user.mock';
import { Repository } from 'typeorm';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingItemService } from './shopping-item.service';
import { generateFakeFlat } from '../../test/flat.mock';
import { generateFakeShoppingItem } from '../../test/shoppingItem.mock';

const mockShoppingItemRepositoryFactory: () => MockType<
  Repository<ShoppingItem>
> = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('ShoppingItemService', () => {
  let service: ShoppingItemService;
  let repository: MockType<Repository<ShoppingItem>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingItemService,
        {
          provide: getRepositoryToken(ShoppingItem),
          useFactory: mockShoppingItemRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<ShoppingItemService>(ShoppingItemService);
    repository = module.get(getRepositoryToken(ShoppingItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'create').mockImplementation((val) => val);
      jest.spyOn(repository, 'save').mockImplementation(async (val) => val);
    });

    it('should create a new shopping item', async () => {
      const user = generateFakeUser();

      const expected: Pick<IShoppingItem, 'name' | 'flatId'> = {
        name: 'Eier',
        flatId: user.flatId,
      };

      expect(
        await service.create(user.flatId, { name: expected.name }),
      ).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('findUnpurchasedItems', () => {
    const flat = generateFakeFlat();
    const shoppingItem1 = generateFakeShoppingItem(flat.id, null);
    const shoppingItem2 = generateFakeShoppingItem(flat.id, 1);
    const shoppingItem3 = generateFakeShoppingItem(flat.id, 1);

    it('returns all unpurchased items of a flat', async () => {
      const expected: IShoppingItem[] = [shoppingItem1, shoppingItem2];

      expect(await service.findUnpurchasedItems(flat.id)).toEqual(expected);
    });
  });
});
