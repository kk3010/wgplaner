import { User } from '../../user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { IFlat } from '../interfaces/flat.interface';

@Entity()
export class Flat implements IFlat {
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
