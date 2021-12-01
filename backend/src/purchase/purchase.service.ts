import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
  ) {}

  create(flatId: number, createPurchaseDto: CreatePurchaseDto) {
    const purchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      flatId,
    });
    return this.purchaseRepository.save(purchase);
  }

  findAllByFlatId(flatId: number) {
    return this.purchaseRepository.find({ where: { flatId } });
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return this.purchaseRepository.delete(id);
  }
}
