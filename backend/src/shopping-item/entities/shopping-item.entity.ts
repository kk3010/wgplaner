import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { IShoppingItem } from '../../interfaces/shopping-item.interface';
import { Flat } from '../../flat/entities/flat.entity';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity()
export class ShoppingItem implements IShoppingItem {
  constructor(params: Partial<ShoppingItem>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Flat, {
    onDelete: 'SET NULL',
  })
  flatId: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.shoppingItems, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  purchaseId: number;
}
