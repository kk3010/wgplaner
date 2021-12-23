import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { registerGlobalPipes } from '../registerGlobalPipes';
import { createMockUserMiddleware } from '../user/mock-user.middleware';
import { WalletService } from '../../src/wallet/wallet.service';
import { generateFakeUser } from '../user/user.mock';
import { generateFakeFlat } from '../flat/flat.mock';
import { WalletController } from '../../src/wallet/wallet.controller';
import { BelongsToFlatGuard } from '../../src/flat/belongs-to-flat.guard';
import { generateFakeWallet } from './wallet.mock';
import type { IUser } from '../../src/interfaces/user.interface';
import type { IFlat } from '../../src/interfaces/flat.interface';
import type { IWallet } from '../../src/interfaces/wallet.interface';
import type { MockType } from '../mockType';

const walletServiceFactory: () => MockType<WalletService> = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  findOneByUserId: jest.fn(),
  updateBalance: jest.fn(),
});

describe('Wallet', () => {
  let app: INestApplication;
  let user: IUser;
  let flat: IFlat;
  let walletService: MockType<WalletService>;

  beforeAll(async () => {
    user = generateFakeUser(1);
    flat = generateFakeFlat([user]);

    const moduleRef = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useFactory: walletServiceFactory,
        },
      ],
    })
      .overrideGuard(BelongsToFlatGuard)
      .useValue({ canActivate: () => true })
      .compile();

    walletService = moduleRef.get(WalletService);
    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware(user));
    registerGlobalPipes(app);
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/GET', () => {
    it('should return all wallets of a flat', () => {
      const user1 = generateFakeUser(1);
      const user2 = generateFakeUser(1);

      const expected: IWallet[] = [
        generateFakeWallet(user),
        generateFakeWallet(user1),
        generateFakeWallet(user2),
      ];

      jest.spyOn(walletService, 'findAll').mockResolvedValue(expected);
      return request(app.getHttpServer())
        .get('/wallet')
        .expect(HttpStatus.OK)
        .expect(expected);
    });
  });
});
