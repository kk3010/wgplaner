import { datatype, animal } from 'faker';
import type { IShoppingItem } from '../src/interfaces/shopping-item.interface';

export const generateFakeShoppingItem: (
  flatId?: number,
  purchaseId?: number,
) => IShoppingItem = (flatId: number, purchaseId: number) => {
  const shoppingItem = {
    id: datatype.number(),
    name: animal.rabbit(),
    flatId: flatId,
    purchaseId: purchaseId,
  };

  return shoppingItem;
};
