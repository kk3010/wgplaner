import { name, internet } from 'faker';
import type { IUser } from '../src/user/interfaces/user.interface';

export const generateFakeUser: () => IUser = () => ({
  id: 1,
  email: internet.email(),
  firstName: name.firstName(),
  lastName: name.lastName(),
  password: internet.password(8),
});
