import { IsNumber, IsArray } from 'class-validator';
import { ShoppingItem } from '../../../src/shopping-item/entities/shopping-item.entity';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: ShoppingItem[];

  @IsArray()
  payerIds: number[];
}
