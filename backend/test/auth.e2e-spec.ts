import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import type { CanActivate, INestApplication } from '@nestjs/common';
import type { MockType } from './mockType';
import { mockUser } from './user.mock';
import { AuthController } from '../src/auth/auth.controller';
import { LocalStrategy } from '../src/auth/strategies/local.strategy';
import { LoginDto } from '../src/auth/dto/login.dto';
import { LocalAuthGuard } from '../src/auth/guards/local-auth.guard';

const authServiceFactory: () => MockType<AuthService> = () => ({
  login: jest.fn(),
  register: jest.fn(),
  validateUser: jest.fn(),
});

const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};

describe('Auth', () => {
  let app: INestApplication;
  let authService: MockType<AuthService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useFactory: authServiceFactory,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    authService = moduleRef.get(AuthService);
    await app.init();
  });

  describe('/login', () => {
    it('returns an access token when valid credentials are presented', () => {
      const user = { ...mockUser };
      delete user.password;
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: 'token' });
      const loginUser: LoginDto = { email: '', password: '' };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUser)
        .expect(200)
        .expect({ access_token: 'token' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
