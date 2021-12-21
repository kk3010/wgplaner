import { datatype, commerce } from 'faker';
import type { IPurchase } from '../src/interfaces/purchase.interface';
import type { IShoppingItem } from '../src/interfaces/shopping-item.interface';

export const generateFakePurchase: (
  flatId?: number,
  buyerId?: number,
  shoppingItems?: IShoppingItem[],
) => IPurchase = (flatId, buyerId, shoppingItems) => {
  const purchase: IPurchase = {
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
