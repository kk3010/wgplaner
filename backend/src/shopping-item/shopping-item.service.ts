import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';
import { createShoppingItemDto } from './dto/create-shopping-item.dto';
import { ShoppingItem } from './entities/shopping-item.entity';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItem)
    private shoppingItemRepository: Repository<ShoppingItem>,
  ) {}

  create(user: IUser, createShoppingItemDto: createShoppingItemDto) {
    const shoppingItem = this.shoppingItemRepository.create({
      ...createShoppingItemDto,
      flatId: user.flatId,
    });
    return this.shoppingItemRepository.save(shoppingItem);
  }

  findOne(id: number) {
    return this.shoppingItemRepository.findOne(id);
  }

  async toggleCheck(id: number, user: IUser) {
    const item = await this.shoppingItemRepository.findOne(id);

    if (item.isChecked) {
      this.shoppingItemRepository.update(id, { buyerId: null });
    } else {
      this.shoppingItemRepository.update(id, { buyerId: user.id });
    }
    this.shoppingItemRepository.update(id, { isChecked: !item.isChecked });
  }

  remove(id: number) {
    return this.shoppingItemRepository.delete(id);
  }
}
