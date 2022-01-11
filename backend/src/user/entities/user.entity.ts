import { Exclude } from 'class-transformer';
import { Flat } from '../../flat/entities/flat.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { IUser } from '../../interfaces/user.interface';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User implements IUser {
  constructor(params: Partial<User>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ApiHideProperty()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  flatId?: number;

  @Exclude()
  @ApiHideProperty()
  @ManyToOne(() => Flat, (flat) => flat.members, { onDelete: 'SET NULL' })
  flat?: Flat;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  textWhite?: boolean;
}
