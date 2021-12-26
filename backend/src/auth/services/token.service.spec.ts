import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from './refresh-tokens.service';
import { ConfigService } from '@nestjs/config';
import { generateFakeUser } from '../../../test/user/user.mock';
import type { MockType } from '../../../test/mockType';
import type { IUser } from '../../interfaces/user.interface';
import type { SignOptions } from 'jsonwebtoken';
import type { IRefreshToken } from '../../interfaces/refresh-token.interface';
import { UnprocessableEntityException } from '@nestjs/common';
import { RefreshTokenPayloadDto } from '../dto/refresh-token-payload.dto';

const mockUserServiceFactory: () => MockType<UserService> = () => ({
  findById: jest.fn(),
});

const mockJwtServiceFactory: () => MockType<JwtService> = () => ({
  signAsync: jest.fn(),
  verify: jest.fn(),
});

const mockRefreshTokensServiceFactory: () => MockType<RefreshTokensService> =
  () => ({
    createRefreshToken: jest.fn(),
    findOne: jest.fn(),
  });

const mockConfigService: MockType<ConfigService> = {
  get: jest.fn().mockReturnValue('url'),
};

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: MockType<JwtService>;
  let refreshTokensService: MockType<RefreshTokensService>;
  const expectedBaseSignOptions: SignOptions = {
    issuer: 'url',
    audience: 'url',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: UserService,
          useFactory: mockUserServiceFactory,
        },
        {
          provide: JwtService,
          useFactory: mockJwtServiceFactory,
        },
        {
          provide: RefreshTokensService,
          useFactory: mockRefreshTokensServiceFactory,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);
    refreshTokensService = module.get(RefreshTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('issuer and audience are set and subject is set to the user id', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      const expectedSignOptions: SignOptions = {
        ...expectedBaseSignOptions,
        subject: '1',
      };
      expect(await service.generateAccessToken({ id: 1 } as IUser)).toEqual(
        'token',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {},
        expectedSignOptions,
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('issuer and audience are set, subject equals user id and jwtid equals token id', async () => {
      const user = generateFakeUser();
      jest
        .spyOn(refreshTokensService, 'createRefreshToken')
        .mockResolvedValue({ id: 1 } as IRefreshToken);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      const expectedOptions: SignOptions = {
        ...expectedBaseSignOptions,
        subject: String(user.id),
        jwtid: '1',
        expiresIn: 10,
      };
      expect(await service.generateRefreshToken(user, 10)).toEqual('token');
      expect(refreshTokensService.createRefreshToken).toHaveBeenCalledWith(
        user,
        10,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({}, expectedOptions);
    });
  });

  describe('resolveRefreshToken', () => {
    beforeEach(() => {
      jest
        .spyOn(service as any, 'decodeRefreshToken')
        .mockResolvedValue(new RefreshTokenPayloadDto());
    });

    it('should throw when no token is found', async () => {
      jest
        .spyOn(service as any, 'getRefreshTokenFromRefreshTokenPayload')
        .mockResolvedValue(null);
      await expect(service.resolveRefreshToken('token')).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw when token is revoked', async () => {
      const fakeRefreshToken = {
        is_revoked: true,
      } as IRefreshToken;
      jest
        .spyOn(service as any, 'getRefreshTokenFromRefreshTokenPayload')
        .mockResolvedValue(fakeRefreshToken);
      await expect(service.resolveRefreshToken('token')).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw when no user is found', async () => {
      jest
        .spyOn(service as any, 'getRefreshTokenFromRefreshTokenPayload')
        .mockResolvedValue({});
      jest
        .spyOn(service as any, 'getUserFromRefreshTokenPayload')
        .mockResolvedValue(null);
      await expect(service.resolveRefreshToken('token')).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should return a user with its associated token', async () => {
      const token = {};
      const user = generateFakeUser();
      jest
        .spyOn(service as any, 'getRefreshTokenFromRefreshTokenPayload')
        .mockResolvedValue(token);
      jest
        .spyOn(service as any, 'getUserFromRefreshTokenPayload')
        .mockResolvedValue(user);
      expect(await service.resolveRefreshToken('token')).toEqual({
        user,
        token,
      });
    });
  });

  describe('createAccessTokenFromRefreshToken', () => {
    it('should resolve refresh token then create access token for user', async () => {
      const user = generateFakeUser();
      jest
        .spyOn(service as any, 'resolveRefreshToken')
        .mockResolvedValue({ user });
      jest
        .spyOn(service as any, 'generateAccessToken')
        .mockResolvedValue('token');
      expect(await service.createAccessTokenFromRefreshToken('')).toEqual({
        user,
        token: 'token',
      });
    });
  });
});
