import { IsNumber, IsArray } from 'class-validator';
import { IPurchase } from 'src/interfaces/purchase.interface';
import { IShoppingItem } from 'src/interfaces/shopping-item.interface';

export class CreatePurchaseDto
  implements Pick<IPurchase, 'name' | 'price' | 'shoppingItems'>
{
  name: string | null;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: IShoppingItem[];
}
