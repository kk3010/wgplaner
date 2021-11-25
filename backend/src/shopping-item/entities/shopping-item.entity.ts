import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IShoppingItem } from 'src/interfaces/shopping-item.interface';

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

  @Column({ nullable: true })
  isPaid?: boolean;
}
