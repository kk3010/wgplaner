import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'test/mockType';
import { Repository } from 'typeorm';
import { Flat } from './entities/flat.entity';
import { FlatService } from './flat.service';
import { IFlat } from './interfaces/flat.interface';

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
  let flat: IFlat;

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
    it('should create a new flat', async () => {
      jest.spyOn(repository, 'create').mockImplementation((val) => val);
      jest.spyOn(repository, 'save').mockImplementation(async (val) => val);
      expect(await service.create(flat)).toEqual(flat);
      expect(repository.create).toHaveBeenCalledWith(flat);
      expect(repository.save).toHaveBeenCalledWith(flat);
    });
  });
});
