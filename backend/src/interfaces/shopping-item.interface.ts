export interface IShoppingItem {
  id: number;
  name: string;
  isChecked: boolean;
  price?: number;
  buyerId?: number;
  isPaid?: boolean;
  flatId: number;
}
