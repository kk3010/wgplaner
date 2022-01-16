import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ShoppingItemController } from '../../src/shopping-item/shopping-item.controller';
import { ShoppingItemService } from '../../src/shopping-item/shopping-item.service';
import { generateFakeUser } from '../user/user.mock';
import { generateFakeFlat } from '../flat/flat.mock';
import { createMockUserMiddleware } from '../user/mock-user.middleware';
import type { MockType } from '../mockType';
import type { IFlat } from '@interfaces/flat.interface';
import type { IUser } from '@interfaces/user.interface';
import type { IShoppingItem } from '@interfaces/shopping-item.interface';
import { generateFakeShoppingItem } from './shoppingItem.mock';
import { ShoppingItemDto } from '../../src/shopping-item/dto/shopping-item.dto';
import { registerGlobalPipes } from '../registerGlobalPipes';
import { BelongsToFlatGuard } from '../../src/flat/belongs-to-flat.guard';
import { SseService } from '../../src/sse/sse.service';
import { UpdateShoppingItemDto } from '../../src/shopping-item/dto/update-shopping-item.dto';

const shoppingItemServiceFactory: () => MockType<ShoppingItemService> = () => ({
  create: jest.fn(),
  findUnpurchasedItems: jest.fn(),
  update: jest.fn(),
  findOneById: jest.fn(),
  remove: jest.fn(),
});

const sseServiceFactory: () => MockType<SseService> = () => ({
  emit: jest.fn(),
});

describe('Shopping item', () => {
  let app: INestApplication;
  let user: IUser;
  let flat: IFlat;
  let shoppingItemService: MockType<ShoppingItemService>;
  let sseService: MockType<SseService>;

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
        {
          provide: SseService,
          useFactory: sseServiceFactory,
        },
      ],
    })
      .overrideGuard(BelongsToFlatGuard)
      .useValue({ canActivate: () => true })
      .compile();

    shoppingItemService = moduleRef.get(ShoppingItemService);
    sseService = moduleRef.get(SseService);
    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware(user));
    registerGlobalPipes(app);
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
    it('should create a shopping item and emit sse event', async () => {
      const body: ShoppingItemDto = {
        name: 'Item',
        quantity: 1,
      };
      const expected: IShoppingItem = {
        id: 1,
        quantity: 1,
        name: body.name,
        flatId: flat.id,
        purchaseId: null,
      };
      jest.spyOn(shoppingItemService, 'create').mockResolvedValue(expected);
      await request(app.getHttpServer())
        .post('/shopping-item')
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect(expected);
      expect(sseService.emit).toHaveBeenCalled();
    });

    it('should fail when no name is provided', () => {
      const body: ShoppingItemDto = { name: '', quantity: 1 };
      return request(app.getHttpServer())
        .post('/shopping-item')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/PATCH', () => {
    it('should update the shopping item name', async () => {
      const body: UpdateShoppingItemDto = {
        name: 'Updated Item',
      };

      await request(app.getHttpServer())
        .patch('/shopping-item/1')
        .send(body)
        .expect(HttpStatus.NO_CONTENT);
      expect(sseService.emit).toHaveBeenCalled();
    });
  });

  describe('/DELETE', () => {
    it('should delete the shopping item and emit sse event', async () => {
      await request(app.getHttpServer())
        .del('/shopping-item/1')
        .expect(HttpStatus.NO_CONTENT);
      expect(sseService.emit).toHaveBeenCalled();
    });

    it('should fail with 400 Bad Request when item cannot be found', () => {
      jest.spyOn(shoppingItemService, 'remove').mockRejectedValue(new Error());
      return request(app.getHttpServer())
        .del('/shopping-item/1')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
