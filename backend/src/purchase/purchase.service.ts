import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IPurchase } from '../interfaces/purchase.interface';
import type { IUser } from '../interfaces/user.interface';
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

  async findOneById(id: number) {
    const purchase = await this.purchaseRepository.findOne(id);
    if (!purchase) {
      throw new NotFoundException();
    }
    return purchase;
  }

  findAll(flatId: number) {
    return this.purchaseRepository.find({ where: { flatId } });
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.purchaseRepository.findOne(id);
    await this.purchaseRepository.save({ ...purchase, ...updatePurchaseDto });
  }

  async remove(id: number) {
    await this.purchaseRepository.delete(id);
  }
}
