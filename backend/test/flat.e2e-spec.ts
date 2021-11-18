import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { createMockUserMiddleware } from './mock-user.middleware';
import { FlatService } from '../src/flat/flat.service';
import { FlatController } from '../src/flat/flat.controller';
import type { MockType } from './mockType';
import type { IFlat } from '../src/interfaces/flat.interface';
import { generateFakeFlat } from './flat.mock';
import type { IUser } from '../src/interfaces/user.interface';
import { generateFakeUser } from './user.mock';

const flatServiceFactory: () => MockType<FlatService> = () => ({
  create: jest.fn(),
  findOneById: jest.fn(),
});

describe('Flat', () => {
  let app: INestApplication;
  let user: IUser;
  let flat: IFlat;
  let flatService: MockType<FlatService>;

  beforeAll(async () => {
    user = generateFakeUser();
    flat = generateFakeFlat([user]);

    const moduleRef = await Test.createTestingModule({
      controllers: [FlatController],
      providers: [
        {
          provide: FlatService,
          useFactory: flatServiceFactory,
        },
      ],
    }).compile();
    flatService = moduleRef.get(FlatService);
    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware(user));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('/GET', () => {
    it('should return a flat', () => {
      jest.spyOn(flatService, 'findOneById').mockResolvedValue(flat);
      return request(app.getHttpServer())
        .get('/flat')
        .expect(HttpStatus.OK)
        .expect(flat);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
