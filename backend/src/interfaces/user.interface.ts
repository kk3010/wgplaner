import type { IFlat } from './flat.interface';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  flatId: number | null;
  flat: IFlat | null;
}
