import type { IUser } from './user.interface';
import type { IShoppingItem } from './shopping-item.interface';

export interface IPurchase {
  id: number;
  name?: string;
  price: number;
  buyerId: number;
  payers: IUser[];
  shoppingItems?: IShoppingItem[];
  flatId?: number;
}
