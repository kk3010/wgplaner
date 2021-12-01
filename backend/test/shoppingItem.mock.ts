import { datatype, animal } from 'faker';
import { IShoppingItem } from '../src/interfaces/shopping-item.interface';

export const generateFakeShoppingItem: (flatId?: number) => IShoppingItem = (
  flatId: number,
) => {
  const shoppingItem = {
    id: datatype.number(),
    name: animal.rabbit(),
    isChecked: false,
    buyer: null,
    isPayed: null,
    price: null,
    flatId: flatId,
  };

  return shoppingItem;
};
