import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import type { IUser } from './interfaces/user.interface';

const mockUserRepository = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

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
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Should return a single user', async () => {
      const testEmail = 'test@abc.de';
      const users: IUser[] = [
        {
          id: 1,
          password: 'abc',
          email: testEmail,
          firstName: 'first',
          lastName: 'last',
        },
        {
          id: 2,
          password: 'abc',
          email: 'test@example.de',
          firstName: 'second',
          lastName: 'last',
        },
      ];

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async ({ email }) =>
          users.find((user) => user.email === email),
        );

      expect(await service.findOne(testEmail)).toBe(users[0]);
      expect(repository.findOne).toHaveBeenCalledWith({ email: testEmail });
    });
  });
});
