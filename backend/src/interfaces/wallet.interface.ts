import type { IUser } from './user.interface';

export interface IWallet {
  id: number;
  balance: number;
  user: IUser;
}
