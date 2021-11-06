import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import type { IUser } from './interfaces/user.interface';
import type { MockType } from '../../test/mockType';

const mockUserRepository: MockType<Repository<User>> = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call UserRepository.findOne with email as parameter', async () => {
      const testEmail = 'test@abc.de';
      const user: IUser = {
        id: 1,
        password: 'abc',
        email: testEmail,
        firstName: 'first',
        lastName: 'last',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.findOne(testEmail)).toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith({ email: testEmail });
    });
  });
});
