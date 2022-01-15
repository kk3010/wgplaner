import { datatype } from 'faker';
import type { IUser } from '@interfaces/user.interface';
import type { IWallet } from '@interfaces/wallet.interface';

export const generateFakeWallet: (user: IUser) => IWallet = (user) => {
  const wallet: IWallet = {
    id: datatype.number(),
    balance: datatype.number(),
    userId: user.id,
    flatId: user.flatId,
  };
  return wallet;
};
