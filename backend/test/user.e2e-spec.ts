import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { mockUserMiddleware } from './mock-user.middleware';
import { generateFakeUser } from './user.mock';
import { UserController } from '../src/user/user.controller';
import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { MockType } from './mockType';
import type { UpdateUserDto } from '../src/user/dto/update-user.dto';
import type { IUser } from '../src/user/interfaces/user.interface';

const userServiceFactory: () => MockType<UserService> = () => ({
  findById: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
});

describe('User', () => {
  let app: INestApplication;
  let userService: MockType<UserService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: userServiceFactory,
        },
      ],
    }).compile();
    userService = moduleRef.get(UserService);
    app = moduleRef.createNestApplication();
    app.use(mockUserMiddleware);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  let user: IUser;

  beforeEach(() => {
    user = generateFakeUser();
  });

  it('/GET', () => {
    jest.spyOn(userService, 'findById').mockResolvedValue(user);
    return request(app.getHttpServer()).get('/user').expect(200).expect(user);
  });

  it('/PATCH', async () => {
    const update: UpdateUserDto = {
      firstName: 'hello',
    };
    const spy = jest.spyOn(userService, 'update');
    await request(app.getHttpServer()).patch('/user').send(update).expect(200);
    expect(spy).toHaveBeenCalledWith(1, update);
  });

  it('/DELETE', async () => {
    const spy = jest.spyOn(userService, 'remove');
    await request(app.getHttpServer()).delete('/user').expect(200);
    expect(spy).toHaveBeenCalledWith(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
