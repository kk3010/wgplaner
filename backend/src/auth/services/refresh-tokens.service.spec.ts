import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokensService } from './refresh-tokens.service';
import type { MockType } from '../../../test/mockType';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entites/refresh-token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { IRefreshToken } from '../../interfaces/refresh-token.interface';
import { generateFakeUser } from '../../../test/user.mock';

const refreshTokensRepositoryFactory: () => MockType<Repository<RefreshToken>> =
  () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;
  let refreshTokensRepository: MockType<Repository<RefreshToken>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensService,
        {
          provide: getRepositoryToken(RefreshToken),
          useFactory: refreshTokensRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<RefreshTokensService>(RefreshTokensService);
    refreshTokensRepository = module.get(getRepositoryToken(RefreshToken));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a refresh token', async () => {
    jest
      .spyOn(refreshTokensRepository, 'create')
      .mockImplementation((val) => ({ ...val, id: 1 }));
    jest
      .spyOn(refreshTokensRepository, 'save')
      .mockImplementation((val) => val);
    jest.spyOn(global.Date, 'now').mockReturnValue(0);

    const user = generateFakeUser();
    const expectedToken: IRefreshToken = {
      id: 1,
      expires: new Date(10),
      is_revoked: false,
      user_id: user.id,
    };
    expect(await service.createRefreshToken(user, 10)).toEqual(expectedToken);
    expect(refreshTokensRepository.create).toHaveBeenCalled();
    expect(refreshTokensRepository.save).toHaveBeenCalled();
  });
});
