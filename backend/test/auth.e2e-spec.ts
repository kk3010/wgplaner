import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TokenService } from '../src/auth/services/token.service';
import { AuthController } from '../src/auth/auth.controller';
import { LocalStrategy } from '../src/auth/strategies/local.strategy';
import { LocalAuthGuard } from '../src/auth/guards/local-auth.guard';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthenticationPayloadDto } from '../src/auth/dto/authentication-payload.dto';
import { generateFakeUser } from './user.mock';
import { UserService } from '../src/user/user.service';
import { mockUserMiddleware } from './mock-user.middleware';
import { LoginDto } from '../src/auth/dto/login.dto';
import type { CanActivate, INestApplication } from '@nestjs/common';
import type { MockType } from './mockType';
import type { IUser } from '../src/interfaces/user.interface';

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
    app.use(mockUserMiddleware);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
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
      const loginUser: LoginDto = { email: '', password: '' };
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
      jest.spyOn(userService, 'create').mockResolvedValue({ ...user });
    });
    it('calls UserService.create and then returns refresh and access tokens', async () => {
      const { password, ...rest } = user;
      const expectedResponse: AuthenticationPayloadDto = {
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
