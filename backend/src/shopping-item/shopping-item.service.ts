import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { ShoppingItem } from './entities/shopping-item.entity';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItem)
    private shoppingItemRepository: Repository<ShoppingItem>,
  ) {}

  create(createShoppingItemDto: createShoppingItemDto) {
    const shoppingItem = this.shoppingItemRepository.create({
      ...createShoppingItemDto,
    });
    return this.shoppingItemRepository.save(shoppingItem);
  }

  //Do we need this?
  // findAll() {
  //   return `This action returns all shoppingItem`;
  // }

  findOne(id: number) {
    return this.shoppingItemRepository.findOne(id);
  }

  async toggleCheck(id: number) {
    const item = await this.shoppingItemRepository.findOne(id);
    this.shoppingItemRepository.update(id, { isChecked: !item.isChecked });
  }

  remove(id: number) {
    return this.shoppingItemRepository.delete(id);
  }
}
