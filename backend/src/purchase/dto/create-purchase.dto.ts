import { IsNumber, IsArray } from 'class-validator';
import type { IUser } from '../../interfaces/user.interface';
import type { IShoppingItem } from '../../interfaces/shopping-item.interface';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: IShoppingItem[];

  @IsArray()
  payerIds: number[];
}
