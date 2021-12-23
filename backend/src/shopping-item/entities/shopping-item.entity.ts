import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { IShoppingItem } from '../../interfaces/shopping-item.interface';
import { Flat } from '../../flat/entities/flat.entity';
import { Purchase } from '../../purchase/entities/purchase.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class ShoppingItem implements IShoppingItem {
  constructor(params: Partial<ShoppingItem>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Exclude()
  @ApiHideProperty()
  @Column()
  flatId: number;

  @Exclude()
  @ApiHideProperty()
  @ManyToOne(() => Flat, {
    onDelete: 'SET NULL',
  })
  flat: Flat;

  @Column({ nullable: true })
  purchaseId: number | null;

  @ManyToOne(() => Purchase, (purchase) => purchase.shoppingItems, {
    onDelete: 'SET NULL',
  })
  @Exclude()
  @ApiHideProperty()
  purchase: Purchase;
}
