import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { MockType } from '../../../test/mockType';
import { UserService } from '../../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { generateFakeUser } from '../../../test/user.mock';

const configServiceFactory: () => MockType<ConfigService> = () => ({
  get: jest.fn().mockReturnValue('value'),
});

const userServiceFactory: () => MockType<UserService> = () => ({
  findById: jest.fn(),
});

describe('jwt-strategy', () => {
  let strategy: JwtStrategy;
  let userService: MockType<UserService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useFactory: configServiceFactory,
        },
        {
          provide: UserService,
          useFactory: userServiceFactory,
        },
      ],
    }).compile();
    strategy = module.get(JwtStrategy);
    userService = module.get(UserService);
  });

  it('should fail when no user can be found', async () => {
    userService.findById.mockResolvedValue(null);
    expect(await strategy.validate({ sub: 1 })).toBe(null);
  });

  it('should succeed when a user is found', async () => {
    const user = generateFakeUser();
    userService.findById.mockResolvedValue(user);
    expect(await strategy.validate({ sub: 1 })).toBe(user);
  });
});
