import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { MockType } from '../../test/mockType';
import type { IUser } from '../user/interfaces/user.interface';
import type { IJwtPayload } from '../../dist/auth/interfaces/IJwtPayload';
import type { CreateUserDto } from '../user/dto/create-user.dto';

const mockUserServiceFactory: () => MockType<UserService> = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

const mockJwtServiceFactory: () => MockType<JwtService> = () => ({
  sign: jest.fn(),
});

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: MockType<UserService>;
  let jwtService: MockType<JwtService>;
  let mockedCompare: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: mockUserServiceFactory,
        },
        {
          provide: JwtService,
          useFactory: mockJwtServiceFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    mockedCompare = jest.fn();
    (bcrypt.compare as jest.Mock) = mockedCompare;
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

    it('should return null when no user is found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      expect(await service.validateUser('', 'wrong')).toBe(null);
    });

    describe('when a user is found', () => {
      beforeEach(() => {
        jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      });

      it("should return null when passwords don't match", async () => {
        mockedCompare.mockResolvedValue(false);
        expect(await service.validateUser('', 'wrong')).toBe(null);
      });

      it('should return user without password when passwords match', async () => {
        mockedCompare.mockResolvedValue(true);
        const { password, ...rest } = user;
        expect(await service.validateUser('', '')).toEqual(rest);
      });
    });
  });

  describe('login', () => {
    it('should return an access token generated from email and id, stripping other properties', () => {
      const user = { email: 'email', id: 1 };
      const spy = jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      expect(service.login({ ...user, other: 'strip me' })).toEqual({
        access_token: 'token',
      });
      expect(spy).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      } as IJwtPayload);
    });
  });

  describe('register', () => {
    let mockedHash: jest.Mock;

    beforeEach(() => {
      mockedHash = jest.fn().mockResolvedValue('hash');
      (bcrypt.hash as jest.Mock) = mockedHash;
    });

    it('should hash the password and call UserService.create', async () => {
      const spy = jest.spyOn(userService, 'create');
      const user: CreateUserDto = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'last',
        password: 'test',
      };
      await service.register(user);
      expect(spy).toHaveBeenCalledWith({ ...user, password: 'hash' });
    });
  });
});
