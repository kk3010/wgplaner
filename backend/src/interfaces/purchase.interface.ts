import { IShoppingItem } from './shopping-item.interface';

export interface IPurchase {
  id: number;
  name?: string;
  price: number;
  buyerId: number;
  isPaid: boolean;
  shoppingItems: IShoppingItem[];
  flatId?: number;
}
