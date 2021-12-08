import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IPurchase } from 'src/interfaces/purchase.interface';
import type { IUser } from 'src/interfaces/user.interface';
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

  create(user: IUser, createPurchaseDto: CreatePurchaseDto) {
    const purchase: IPurchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      flatId: user.flatId,
      buyerId: user.id,
    });

    return this.purchaseRepository.save(purchase);
  }

  async find(id: number) {
    return await this.purchaseRepository.findOne(id);
  }

  async findAll(flatId: number) {
    return await this.purchaseRepository.find({ where: { flatId } });
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    await this.purchaseRepository.update(id, updatePurchaseDto);
  }

  async remove(id: number) {
    await this.purchaseRepository.delete(id);
  }
}
