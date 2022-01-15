import { IsNotEmpty, IsNumber } from 'class-validator';
import type { IShoppingItem } from '@interfaces/shopping-item.interface';

export class ShoppingItemDto
  implements Pick<IShoppingItem, 'name' | 'quantity'>
{
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  readonly quantity: number;
}
