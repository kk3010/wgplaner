import { Flat } from '../../flat/entities/flat.entity';
import { ShoppingItem } from '../../shopping-item/entities/shopping-item.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { IPurchase } from '../../interfaces/purchase.interface';

@Entity()
export class Purchase implements IPurchase {
  constructor(params: Partial<Purchase>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  price: number;

  @Column()
  buyerId: number;

  @Column({ default: false })
  isPaid: boolean;

  @OneToMany(() => ShoppingItem, (shoppingItem) => shoppingItem.purchaseId, {
    eager: true,
  })
  shoppingItems: ShoppingItem[];

  @ManyToOne(() => Flat)
  flatId: number;
}
