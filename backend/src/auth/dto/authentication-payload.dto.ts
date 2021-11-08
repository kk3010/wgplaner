import { IsObject, IsString } from 'class-validator';
import { UserPayloadDto } from '../../user/dto/user-payload.dto';

export class AuthenticationPayloadDto {
  @IsObject()
  user: UserPayloadDto;

  @IsString()
  token: string;

  @IsString()
  refresh_token?: string;
}
