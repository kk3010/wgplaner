import { HttpStatus, INestApplication } from '@nestjs/common';
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
import { CreateFlatDto } from '../src/flat/dto/create-flat.dto';
import { registerGlobalPipes } from './registerGlobalPipes';

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
    registerGlobalPipes(app);
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

  describe('/POST', () => {
    it('should create a flat', () => {
      const body: CreateFlatDto = {
        name: 'flat',
      };
      const expected: IFlat = {
        id: 1,
        invitationToken: 'token',
        members: [],
        name: body.name,
      };
      jest.spyOn(flatService, 'create').mockResolvedValue(expected);
      return request(app.getHttpServer())
        .post('/flat')
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect(expected);
    });

    it('should fail when no name is provided', () => {
      const body: CreateFlatDto = { name: '' };
      return request(app.getHttpServer())
        .post('/flat')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  // TODO integrate guard for belongs to flat
  // describe('/PATCH', () => {
  //   it('should update the shopping item name', () => {
  //     const body: UpdateFlatDto = {
  //       name: 'Updated Flat',
  //     };

  //     return request(app.getHttpServer())
  //       .patch(`/flat/${flat.id}`)
  //       .send(body)
  //       .expect(200);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
