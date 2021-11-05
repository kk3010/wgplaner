import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MockType } from '../../test/mockType';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const mockUserService: MockType<UserService> = {};

const mockJwtService: MockType<JwtService> = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: () => mockUserService,
        },
        {
          provide: JwtService,
          useFactory: () => mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
