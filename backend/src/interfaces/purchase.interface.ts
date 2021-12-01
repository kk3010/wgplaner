import { IShoppingItem } from './shopping-item.interface';

export interface IPurchase {
  id: number;
  name?: string;
  price: number;
  shoppingItems: IShoppingItem[];
  flatId?: number;
}
