import { IsNumber, IsArray } from 'class-validator';
import type { IShoppingItem } from '../../interfaces/shopping-item.interface';

export class CreatePurchaseDto {
  name: string | null;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: IShoppingItem[];
}
