import type { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Omit<IUser, 'id'> {
  firstName: string;
  lastName: string;
  email: string;
}
