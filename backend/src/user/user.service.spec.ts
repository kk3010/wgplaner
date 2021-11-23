import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import type { MockType } from '../../test/mockType';
import { UnprocessableEntityException } from '@nestjs/common';
import { generateFakeUser } from '../../test/user.mock';
import * as bcrypt from 'bcrypt';
import type { IUser } from '../interfaces/user.interface';

const mockUserRepositoryFactory: () => MockType<Repository<User>> = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: MockType<Repository<User>>;
  let user: IUser;

  beforeEach(async () => {
    user = generateFakeUser();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCredentials', () => {
    it('should return null when no user is found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      expect(await service.validateCredentials('', '')).toBe(null);
    });

    describe('when a user is found', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      });

      it("should return null when passwords don't match", async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        expect(await service.validateCredentials('', 'wrong')).toBe(null);
      });

      it('should return user when passwords match', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        expect(await service.validateCredentials('', '')).toBe(user);
      });
    });
  });

  describe('create', () => {
    it('should throw when email exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      await expect(service.create(user)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({ email: user.email });
    });

    it('should call create and save with a hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hash');
      jest.spyOn(repository, 'create').mockImplementation((val) => val);
      jest.spyOn(repository, 'save').mockImplementation(async (val) => val);
      const hashedUser = { ...user, password: 'hash' };
      expect(await service.create(user)).toEqual(hashedUser);
      expect(repository.create).toHaveBeenCalledWith(hashedUser);
      expect(repository.save).toHaveBeenCalledWith(hashedUser);
    });
  });
});
