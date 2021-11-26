import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IShoppingItem } from 'src/interfaces/shopping-item.interface';
import { Flat } from 'src/flat/entities/flat.entity';

@Entity()
export class ShoppingItem implements IShoppingItem {
  constructor(params: Partial<ShoppingItem>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isChecked: boolean;

  @Column({ nullable: true })
  price?: number;

  @Column({ nullable: true })
  buyerId?: number;

  @Column({ default: false })
  isPaid?: boolean;

  @ManyToOne(() => Flat, (flat) => flat.shoppingItems, {
    onDelete: 'SET NULL',
  })
  flatId: number;
}
