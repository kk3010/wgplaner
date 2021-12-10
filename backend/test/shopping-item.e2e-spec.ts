import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ShoppingItemController } from '../src/shopping-item/shopping-item.controller';
import { ShoppingItemService } from '../src/shopping-item/shopping-item.service';
import { generateFakeUser } from './user.mock';
import { generateFakeFlat } from './flat.mock';
import { createMockUserMiddleware } from './mock-user.middleware';
import type { MockType } from './mockType';
import type { IFlat } from '../src/interfaces/flat.interface';
import type { IUser } from '../src/interfaces/user.interface';
import type { IShoppingItem } from '../src/interfaces/shopping-item.interface';
import { generateFakeShoppingItem } from './shoppingItem.mock';
import { ShoppingItemDto } from '../src/shopping-item/dto/shopping-item.dto';

const shoppingItemServiceFactory: () => MockType<ShoppingItemService> = () => ({
  create: jest.fn(),
  findUnpurchasedItems: jest.fn(),
  update: jest.fn(),
  findOneById: jest.fn(),
  remove: jest.fn(),
});

describe('Shopping item', () => {
  let app: INestApplication;
  let user: IUser;
  let flat: IFlat;
  let shoppingItemService: MockType<ShoppingItemService>;

  beforeAll(async () => {
    user = generateFakeUser();
    flat = generateFakeFlat([user]);

    const moduleRef = await Test.createTestingModule({
      controllers: [ShoppingItemController],
      providers: [
        {
          provide: ShoppingItemService,
          useFactory: shoppingItemServiceFactory,
        },
      ],
    }).compile();
    shoppingItemService = moduleRef.get(ShoppingItemService);
    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware(user));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('shold be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/GET', () => {
    it('should return all unpurchased items', () => {
      const items: IShoppingItem[] = [
        generateFakeShoppingItem(flat.id, null),
        generateFakeShoppingItem(flat.id, null),
        generateFakeShoppingItem(flat.id, 1),
      ];
      const expected = items.slice(0, 2);
      jest
        .spyOn(shoppingItemService, 'findUnpurchasedItems')
        .mockResolvedValue(expected);
      return request(app.getHttpServer())
        .get('/shopping-item')
        .expect(HttpStatus.OK)
        .expect(expected);
    });
  });

  describe('/POST', () => {
    it('should create a shopping item', () => {
      const body: ShoppingItemDto = {
        name: 'Item',
      };
      const expected: IShoppingItem = {
        id: 1,
        name: body.name,
        flatId: flat.id,
        purchaseId: null,
      };
      jest.spyOn(shoppingItemService, 'create').mockResolvedValue(expected);
      return request(app.getHttpServer())
        .post('/shopping-item')
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect(expected);
    });

    it('should fail when no name is provided', () => {
      const body: ShoppingItemDto = { name: '' };
      return request(app.getHttpServer())
        .post('/shopping-item')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
