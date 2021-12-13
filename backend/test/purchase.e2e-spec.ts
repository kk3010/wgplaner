import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { generateFakeUser } from './user.mock';
import { generateFakeFlat } from './flat.mock';
import { createMockUserMiddleware } from './mock-user.middleware';
import type { MockType } from './mockType';
import type { IFlat } from '../src/interfaces/flat.interface';
import type { IUser } from '../src/interfaces/user.interface';
import { generateFakeShoppingItem } from './shoppingItem.mock';
import { registerGlobalPipes } from './registerGlobalPipes';
import { PurchaseService } from '../src/purchase/purchase.service';
import { PurchaseController } from '../src/purchase/purchase.controller';
import { CreatePurchaseDto } from '../src/purchase/dto/create-purchase.dto';
import { IPurchase } from '../src/interfaces/purchase.interface';

const purchaseServiceFactory: () => MockType<PurchaseService> = () => ({
  create: jest.fn(),
  findUnpurchasedItems: jest.fn(),
  update: jest.fn(),
  findOneById: jest.fn(),
  remove: jest.fn(),
});

describe('Purchase', () => {
  let app: INestApplication;
  let user: IUser;
  let flat: IFlat;
  let purchaseService: MockType<PurchaseService>;

  beforeAll(async () => {
    user = generateFakeUser();
    flat = generateFakeFlat([user]);

    const moduleRef = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useFactory: purchaseServiceFactory,
        },
      ],
    }).compile();
    purchaseService = moduleRef.get(PurchaseService);
    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware(user));
    registerGlobalPipes(app);
    await app.init();
  });

  it('shold be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/POST', () => {
    it('should create a purchase', () => {
      const shoppingItem1 = generateFakeShoppingItem(flat.id, 1);
      const shoppingItem2 = generateFakeShoppingItem(flat.id, 1);
      const body: CreatePurchaseDto = {
        name: 'Purchase',
        price: 22.2,
        shoppingItems: [shoppingItem1, shoppingItem2],
      };
      const expected: IPurchase = {
        ...body,
        id: 1,
        buyerId: user.id,
        flatId: flat.id,
        isPaid: false,
      };

      jest.spyOn(purchaseService, 'create').mockResolvedValue(expected);
      return request(app.getHttpServer())
        .post('/purchase')
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect(expected);
    });
  });
});
