import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import type { MockType } from '../../test/mockType';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const mockAuthServiceFactory: () => MockType<AuthService> = () => ({
  login: jest.fn(),
  validateUser: jest.fn(),
  register: jest.fn(),
});

const mockUserServiceFactory: () => MockType<UserService> = () => ({
  create: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockType<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthServiceFactory,
        },
        {
          provide: UserService,
          useFactory: mockUserServiceFactory,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should insert a user', async () => {
      const user = {
        email: 'abc@abc.de',
        firstName: 'first',
        lastName: 'last',
        password: 'password',
      };
      const spy = jest.spyOn(authService, 'register');
      await controller.register(user);
      expect(spy).toHaveBeenCalledWith(user);
    });
  });
});
