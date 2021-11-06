import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import type { MockType } from '../../test/mockType';
import { AuthService } from './auth.service';

const mockAuthServiceFactory: () => MockType<AuthService> = () => ({
  login: jest.fn(),
  validateUser: jest.fn(),
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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
