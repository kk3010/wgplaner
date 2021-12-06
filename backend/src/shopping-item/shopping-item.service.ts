import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '../interfaces/user.interface';
import { Repository } from 'typeorm';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { ShoppingItem } from './entities/shopping-item.entity';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItem)
    private shoppingItemRepository: Repository<ShoppingItem>,
  ) {}

  create(flatId: number, createShoppingItemDto: CreateShoppingItemDto) {
    const shoppingItem = this.shoppingItemRepository.create({
      ...createShoppingItemDto,
      flatId,
    });
    return this.shoppingItemRepository.save(shoppingItem);
  }

  findUnpurchasedItems(flatId: number) {
    return this.shoppingItemRepository.find({
      where: { flatId, purchaseId: null },
    });
  }

  async toggleCheck(ids: number[]) {
    ids.map(async (itemId) => {
      const item = await this.shoppingItemRepository.findOne(itemId);
      this.shoppingItemRepository.update(itemId, {
        isChecked: !item.isChecked,
      });
    });
  }

  remove(id: number) {
    return this.shoppingItemRepository.delete(id);
  }
}
