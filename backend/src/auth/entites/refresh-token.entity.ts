import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Entity()
export class RefreshToken implements IRefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  is_revoked: boolean;

  @Column()
  expires: Date;
}
