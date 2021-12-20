import { IsNotEmpty } from 'class-validator';
import { IWallet } from 'src/interfaces/wallet.interface';

export class UpdateWalletDto implements Pick<IWallet, 'balance'> {
  @IsNotEmpty()
  readonly balance: number;
}
