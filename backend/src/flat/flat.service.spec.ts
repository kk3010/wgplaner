import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnprocessableEntityException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Flat } from './entities/flat.entity';
import { FlatService } from './flat.service';
import { MockType } from '../../test/mockType';
import { generateFakeUser } from '../../test/user.mock';
import { generateFakeFlat } from '../../test/flat.mock';
import type { IFlat } from '../interfaces/flat.interface';
import type { IUser } from '../interfaces/user.interface';

const mockFlatRepositoryFactory: () => MockType<Repository<Flat>> = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('FlatService', () => {
  let service: FlatService;
  let repository: MockType<Repository<Flat>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlatService,
        {
          provide: getRepositoryToken(Flat),
          useFactory: mockFlatRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<FlatService>(FlatService);
    repository = module.get(getRepositoryToken(Flat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('token');
      jest.spyOn(repository, 'create').mockImplementation((val) => val);
      jest.spyOn(repository, 'save').mockImplementation(async (val) => val);
    });

    it('should throw UnprocessableEntityException when user belongs to another flat', async () => {
      const creator = generateFakeUser(1);

      await expect(
        service.create({ name: 'test ' }, creator),
      ).rejects.toThrowError(UnprocessableEntityException);
    });

    it('should create a new flat', async () => {
      const creator = generateFakeUser();

      const expected: Omit<IFlat, 'id'> = {
        name: 'flat',
        invitationToken: 'token',
        members: [creator],
      };

      expect(await service.create({ name: expected.name }, creator)).toEqual(
        expected,
      );
      expect(repository.create).toHaveBeenCalledWith(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('addMember', () => {
    let user: IUser;

    beforeEach(() => {
      user = generateFakeUser();
    });

    it('throws UnprocessableEntityException when no flat is found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.addMember('token', user)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('throws UnprocessableEntityException when user is already a member', async () => {
      const flat = generateFakeFlat([user]);
      repository.findOne.mockResolvedValue(flat);
      await expect(service.addMember('token', user)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('adds a user to the members list', async () => {
      const flat = generateFakeFlat();
      repository.findOne.mockResolvedValue(flat);
      repository.update.mockImplementation(async (id, partial) =>
        Object.assign(flat, partial),
      );
      await service.addMember('token', user);
      expect(flat.members).toEqual([user]);
    });
  });

  describe('removeMember', () => {
    let user1: IUser;
    let user2: IUser;
    let user3: IUser;

    beforeEach(() => {
      user1 = generateFakeUser();
      user2 = generateFakeUser();
      user3 = generateFakeUser();
    });

    it('throws UnprocessableEntityException when user is not a member of the flat', async () => {
      const flat = generateFakeFlat([user1, user2]);
      await expect(service.removeMember(flat, user3.id)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('throws UnprocessableEntityException when user is the only member of the flat', async () => {
      const flat = generateFakeFlat([user1]);
      await expect(service.removeMember(flat, user1.id)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('removes a user from the members list', async () => {
      const flat = generateFakeFlat([user1, user2]);
      repository.update.mockImplementation(async (id, partial) =>
        Object.assign(flat, partial),
      );
      await service.removeMember(flat, user1.id);
      expect(flat.members).toEqual([user2]);
    });
  });
});
