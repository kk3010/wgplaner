import { IsNumber } from 'class-validator';

export class AccessTokenPayloadDto {
  @IsNumber()
  sub: number;
}
