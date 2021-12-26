import { Injectable } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { generateFakeShoppingItem } from '../../test/shopping-item/shoppingItem.mock';

@Injectable()
export class ShoppingItemSeederService {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  create(flatId: number) {
    return Promise.all(
      Array.from(Array(10)).map(() => {
        const { id, ...item } = generateFakeShoppingItem(flatId);
        return this.shoppingItemService.create(flatId, item);
      }),
    );
  }
}
