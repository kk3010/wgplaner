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
  remove: jest.fn(),
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
    it('returns all unpurchased items of a flat', async () => {
      const flat = generateFakeFlat();
      const items = [
        generateFakeShoppingItem(flat.id, null),
        generateFakeShoppingItem(flat.id, 1),
        generateFakeShoppingItem(flat.id, 1),
      ];
      const expected: IShoppingItem[] = [items[0]];

      jest.spyOn(repository, 'find').mockResolvedValue(expected);

      expect(await service.findUnpurchasedItems(flat.id)).toEqual(expected);
      expect(repository.find).toHaveBeenCalledWith({
        where: { flatId: flat.id, purchaseId: null },
      });
    });
  });

  // TODO integrate with belongs to flat guard

  // describe('update', () => {
  //   it('updates the name of a shopping item', async () => {
  //     const flat = generateFakeFlat();
  //     const item = generateFakeShoppingItem(flat.id, null);

  //     const expected: IShoppingItem = item;

  //     jest.spyOn(repository, 'update').mockResolvedValue(expected);

  //     expect(await service.findUnpurchasedItems(flat.id)).toEqual(expected);
  //     expect(repository.find).toHaveBeenCalledWith({
  //       where: { flatId: flat.id, purchaseId: null },
  //     });
  //   });
  // });

  // describe('delete', () => {
  //   it('should delete the shopping item', async () => {
  //     const flat = generateFakeFlat();
  //     const items = [
  //       generateFakeShoppingItem(flat.id, null),
  //       generateFakeShoppingItem(flat.id, 1),
  //       generateFakeShoppingItem(flat.id, 1),
  //     ];
  //     const expected: IShoppingItem[] = items.slice(0, 2);

  //     jest.spyOn(repository, 'remove').mockResolvedValue(expected);
  //     expect(repository.remove).toHaveBeenCalledWith(items[0].id);
  //   });
  // });
});
