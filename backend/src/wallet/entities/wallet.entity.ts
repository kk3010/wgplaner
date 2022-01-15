import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import type { IWallet } from '@interfaces/wallet.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Flat } from '../../flat/entities/flat.entity';
import { Exclude } from 'class-transformer';

class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
@Unique(['userId', 'flatId'])
export class Wallet implements IWallet {
  constructor(params: Partial<Wallet>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @Column()
  userId: number;

  @Column()
  flatId: number;

  @OneToOne(() => User)
  @JoinColumn()
  @Exclude()
  @ApiHideProperty()
  user: User;

  @ManyToOne(() => Flat)
  @Exclude()
  @ApiHideProperty()
  flat: Flat;
}
