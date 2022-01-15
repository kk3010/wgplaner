import { name, internet, datatype } from 'faker';
import type { IUser } from '@interfaces/user.interface';

export const generateFakeUser: (flatId?: number) => IUser = (
  flatId?: number,
) => ({
  id: datatype.number(),
  email: internet.email(),
  firstName: name.firstName(),
  lastName: name.lastName(),
  password: internet.password(8),
  flatId: flatId ?? null,
});
