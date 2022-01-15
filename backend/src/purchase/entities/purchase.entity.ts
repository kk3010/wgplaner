import { Flat } from '../../flat/entities/flat.entity';
import { ShoppingItem } from '../../shopping-item/entities/shopping-item.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { IPurchase } from '@interfaces/purchase.interface';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Purchase implements IPurchase {
  constructor(params: Partial<Purchase>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column()
  buyerId: number;

  @Exclude()
  @ApiHideProperty()
  @ManyToOne(() => User)
  buyer: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  payers: User[];

  @OneToMany(() => ShoppingItem, (shoppingItem) => shoppingItem.purchase, {
    eager: true,
    nullable: true,
  })
  shoppingItems: ShoppingItem[];

  @Column()
  flatId: number;

  @ManyToOne(() => Flat)
  @Exclude()
  @ApiHideProperty()
  flat: Flat;
}
