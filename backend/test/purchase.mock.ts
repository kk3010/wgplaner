import { datatype, commerce } from 'faker';
import { IPurchase } from '../src/interfaces/purchase.interface';
import type { IShoppingItem } from '../src/interfaces/shopping-item.interface';

export const generateFakePurchase: (
  flatId?: number,
  purchaseId?: number,
  shoppingItems?: IShoppingItem[],
) => IPurchase = (
  flatId: number,
  buyerId: number,
  shoppingItems: IShoppingItem[],
) => {
  const purchase = {
    id: datatype.number(),
    name: commerce.department(),
    price: datatype.number(),
    buyerId,
    isPaid: false,
    flatId,
    shoppingItems,
  };

  return purchase;
};
