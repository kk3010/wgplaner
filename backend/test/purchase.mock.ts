import { datatype, commerce } from 'faker';
import type { IPurchase } from '../src/interfaces/purchase.interface';
import type { IShoppingItem } from '../src/interfaces/shopping-item.interface';
import type { IUser } from '../src/interfaces/user.interface';

export const generateFakePurchase: (
  flatId?: number,
  buyerId?: number,
  shoppingItems?: IShoppingItem[],
  payers?: IUser[],
) => IPurchase = (flatId, buyerId, shoppingItems = [], payers = []) => {
  const purchase: IPurchase = {
    id: datatype.number(),
    name: commerce.department(),
    price: datatype.number(250),
    buyerId,
    flatId,
    shoppingItems,
    payers,
  };

  return purchase;
};
