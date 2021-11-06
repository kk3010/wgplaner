import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import type { MockType } from '../../test/mockType';
import type { IUser } from '../user/interfaces/user.interface';

const mockUserService: MockType<UserService> = {
  findOne: jest.fn(),
};

const mockJwtService: MockType<JwtService> = {};

describe('AuthService', () => {
  let service: AuthService;
  let userService: MockType<UserService>;

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
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const user: IUser = {
      id: 1,
      email: 'abc@abc.de',
      password: 'password',
      firstName: 'User',
      lastName: 'McUserface',
    };
    it("should return null when passwords don't match", async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      expect(await service.validateUser('', 'wrong')).toBe(null);
    });

    it('should return user without password when passwords match', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      const { password, ...rest } = user;
      expect(await service.validateUser('', password)).toEqual(rest);
    });
  });
});
