import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import type { CanActivate, INestApplication } from '@nestjs/common';
import { TokenService } from '../src/auth/services/token.service';
import { AuthController } from '../src/auth/auth.controller';
import { LocalStrategy } from '../src/auth/strategies/local.strategy';
import { LocalAuthGuard } from '../src/auth/guards/local-auth.guard';
import { generateFakeUser } from './user.mock';
import { UserService } from '../src/user/user.service';
import { createMockUserMiddleware } from './mock-user.middleware';
import { LoginDto } from '../src/auth/dto/login.dto';
import type { MockType } from './mockType';
import type { IUser } from '../src/interfaces/user.interface';
import { User } from '../src/user/entities/user.entity';

const tokenServiceFactory: () => MockType<TokenService> = () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
});

const userServiceFactory: () => MockType<UserService> = () => ({
  create: jest.fn(),
});

const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};

describe('Auth', () => {
  let app: INestApplication;
  let tokenService: MockType<TokenService>;
  let userService: MockType<UserService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalStrategy,
        {
          provide: TokenService,
          useFactory: tokenServiceFactory,
        },
        {
          provide: UserService,
          useFactory: userServiceFactory,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(createMockUserMiddleware());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    tokenService = moduleRef.get(TokenService);
    userService = moduleRef.get(UserService);
    await app.init();
  });

  beforeEach(() => {
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValue('token');
    jest
      .spyOn(tokenService, 'generateRefreshToken')
      .mockResolvedValue('refresh');
  });

  describe('/login', () => {
    it('returns an access and refresh token for a user', () => {
      const loginUser = new LoginDto({ email: '', password: '' });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUser)
        .expect(HttpStatus.OK);
    });
  });

  describe('/register', () => {
    let user: IUser;

    beforeEach(() => {
      user = generateFakeUser();
      jest
        .spyOn(userService, 'create')
        .mockResolvedValue(new User({ ...user }));
    });

    it('calls UserService.create and then returns refresh and access tokens', async () => {
      const { password, ...rest } = user;
      const expectedResponse = {
        user: rest,
        token: 'token',
        refresh_token: 'refresh',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(expectedResponse)
        .expect(HttpStatus.CREATED);
      expect(userService.create).toHaveBeenCalledWith(user);
    });

    it('fails when the password is too short', async () => {
      user.password = user.password.slice(0, 4);
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
