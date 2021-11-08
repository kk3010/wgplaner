import { IsNumber } from 'class-validator';

export class RefreshTokenPayloadDto {
  /** the token's id */
  @IsNumber()
  jti: number;

  @IsNumber()
  /** the token's subject i.e. the associated user's id */
  sub: number;
}
