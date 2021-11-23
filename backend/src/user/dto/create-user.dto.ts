import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import type { IUser } from '../../interfaces/user.interface';

export class CreateUserDto
  implements Pick<IUser, 'password' | 'firstName' | 'lastName' | 'email'>
{
  @Length(8)
  readonly password: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;
}
