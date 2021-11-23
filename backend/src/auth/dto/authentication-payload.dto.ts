import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class AuthenticationPayloadDto {
  @Type(() => User)
  @ValidateNested()
  user: User;

  @IsString()
  token: string;

  @IsString()
  refresh_token?: string;
}
