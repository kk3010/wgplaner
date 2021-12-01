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

  findOne(id: number) {
    return this.shoppingItemRepository.findOne(id);
  }

  async toggleCheck(ids: number[], user: IUser) {
    for (const id in ids) {
      const item = await this.shoppingItemRepository.findOne(id);
      if (item.isChecked) {
        this.shoppingItemRepository.update(id, { buyerId: null });
      } else {
        this.shoppingItemRepository.update(id, { buyerId: user.id });
      }
      this.shoppingItemRepository.update(id, { isChecked: !item.isChecked });
    }
  }

  remove(id: number) {
    return this.shoppingItemRepository.delete(id);
  }
}
