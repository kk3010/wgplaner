import type { IShoppingItem } from './shopping-item.interface';

export interface IPurchase {
  id: number;
  name?: string;
  price: number;
  buyerId: number;
  payerIds: number[];
  shoppingItems?: IShoppingItem[];
  flatId?: number;
}
