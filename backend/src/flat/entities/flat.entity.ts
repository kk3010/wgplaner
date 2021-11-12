import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IFlat } from '../interfaces/flat.interface';

@Entity()
export class Flat implements IFlat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => User, (user) => user.id)
  members: User[];
}
