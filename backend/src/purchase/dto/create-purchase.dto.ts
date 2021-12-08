import { IsNumber, IsArray } from 'class-validator';
import { IShoppingItem } from 'src/interfaces/shopping-item.interface';

export class CreatePurchaseDto {
  name: string | null;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: IShoppingItem[];
}
