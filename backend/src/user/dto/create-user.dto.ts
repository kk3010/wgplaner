import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import type { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Omit<IUser, 'id'> {
  @Length(8)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
