import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { IShoppingItem } from '../interfaces/shopping-item.interface';
import type { MockType } from '../../test/mockType';
import { generateFakeFlat } from '../../test/flat.mock';
import { generateFakeUser } from '../../test/user.mock';
import { Repository } from 'typeorm';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingItemService } from './shopping-item.service';

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
      // const flat = generateFakeFlat();
      const user = generateFakeUser();

      const expected: Omit<IShoppingItem, 'id'> = {
        name: 'Eier',
        isChecked: false,
        flatId: user.flatId,
        buyerId: null,
      };

      expect(await service.create(user, { name: expected.name })).toEqual(
        expected,
      );
      expect(repository.create).toHaveBeenCalledWith(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });
  });
});
