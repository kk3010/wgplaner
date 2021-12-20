import { User } from 'src/user/entities/user.entity';
import { IWallet } from 'src/interfaces/wallet.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Flat } from 'src/flat/entities/flat.entity';

@Entity()
export class Wallet implements IWallet {
  constructor(params: Partial<Wallet>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  balance: number;

  @OneToOne(() => User)
  user: User;

  @OneToOne(() => Flat)
  flatId: number;
}
