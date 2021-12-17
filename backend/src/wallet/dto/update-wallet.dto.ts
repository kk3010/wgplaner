import { IsNotEmpty } from 'class-validator';
import type { IWallet } from '../../interfaces/wallet.interface';

export class UpdateWalletDto implements Pick<IWallet, 'balance'> {
  @IsNotEmpty()
  readonly balance: number;
}
