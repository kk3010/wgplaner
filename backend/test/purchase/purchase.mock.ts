import { datatype, commerce } from 'faker';
import type { IPurchase } from '@interfaces/purchase.interface';
import type { IShoppingItem } from '@interfaces/shopping-item.interface';

export const generateFakePurchase: (
  flatId?: number,
  buyerId?: number,
  shoppingItems?: IShoppingItem[],
  payerIds?: number[],
) => IPurchase = (flatId, buyerId, shoppingItems = [], payerIds = []) => {
  const purchase: IPurchase = {
    id: datatype.number(),
    name: commerce.department(),
    price: datatype.number(250),
    buyerId,
    flatId,
    shoppingItems,
    payerIds,
  };

  return purchase;
};
