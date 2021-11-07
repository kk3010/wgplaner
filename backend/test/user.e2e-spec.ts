import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { User } from '../src/user/entities/user.entity';
import { mockUserMiddleware } from './mock-user.middleware';
import type { INestApplication } from '@nestjs/common';
import type { MockType } from './mockType';
import type { IUser } from '../dist/user/interfaces/user.interface';
import type { UpdateUserDto } from '../src/user/dto/update-user.dto';

const userServiceFactory: () => MockType<UserService> = () => ({
  findOne: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
});

const userRepoFactory: () => MockType<Repository<User>> = () => ({});

describe('User', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useFactory({ factory: userServiceFactory })
      .overrideProvider(getRepositoryToken(User))
      .useFactory({ factory: userRepoFactory })
      .compile();
    userService = moduleRef.get(UserService);
    app = moduleRef.createNestApplication();
    app.use(mockUserMiddleware);
    await app.init();
  });

  const user: IUser = {
    email: '',
    firstName: '',
    id: 1,
    lastName: '',
    password: '',
  };

  it('/GET', () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
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
