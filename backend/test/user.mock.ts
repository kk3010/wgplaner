import { name, internet, datatype } from 'faker';
import type { IUser } from '../src/interfaces/user.interface';
import type { IFlat } from '../src/interfaces/flat.interface';

export const generateFakeUser: (flat?: IFlat | null) => IUser = (
  flat = null,
) => ({
  id: datatype.number(),
  email: internet.email(),
  firstName: name.firstName(),
  lastName: name.lastName(),
  password: internet.password(8),
  flat,
  flatId: flat?.id ?? null,
});
