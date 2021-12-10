import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItemDto } from './dto/shopping-item.dto';
import { ShoppingItem } from './entities/shopping-item.entity';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItem)
    private shoppingItemRepository: Repository<ShoppingItem>,
  ) {}

  create(flatId: number, createShoppingItemDto: ShoppingItemDto) {
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

  async update(id: number, createShoppingItemDto: ShoppingItemDto) {
    await this.shoppingItemRepository.update(id, createShoppingItemDto);
  }

  findOneById(id: number) {
    return this.shoppingItemRepository.findOne(id);
  }

  async remove(id: number) {
    await this.shoppingItemRepository.delete(id);
  }
}