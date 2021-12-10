import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { MockType } from '../../test/mockType';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockPurchaseRepositoryFactory: () => MockType<Repository<Purchase>> =
  () => ({
    find: jest.fn(),
  });

describe('PurchaseService', () => {
  let service: PurchaseService;
  let repository: MockType<Repository<Purchase>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useFactory: mockPurchaseRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    repository = module.get(getRepositoryToken(Purchase));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
