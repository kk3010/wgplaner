import { Exclude } from 'class-transformer';
import { Flat } from '../../flat/entities/flat.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../../interfaces/user.interface';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  flatId: number;

  @ManyToOne(() => Flat, (flat) => flat.members, { onDelete: 'SET NULL' })
  flat: Flat;
}
