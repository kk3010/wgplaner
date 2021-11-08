import { Column, Entity } from 'typeorm';
import { IRefreshToken } from '../interfaces/refreshToken.interface';

@Entity()
export class RefreshTokens implements IRefreshToken {
  @Column()
  user_id: number;

  @Column()
  is_revoked: boolean;

  @Column()
  expires: Date;
}
