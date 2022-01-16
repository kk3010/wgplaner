import { User } from '../../user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { IFlat } from '@interfaces/flat.interface';
import { ShoppingItem } from '../../shopping-item/entities/shopping-item.entity';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity()
export class Flat implements IFlat {
  constructor(params: Partial<Flat>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  invitationToken: string;

  @OneToMany(() => User, (user) => user.flat, {
    eager: true,
  })
  members: User[];
}
