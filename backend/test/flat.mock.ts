import { address, datatype } from 'faker';
import type { IFlat } from '../src/flat/interfaces/flat.interface';
import type { IUser } from '../src/user/interfaces/user.interface';

export const generateFakeFlat: (members?: IUser[]) => IFlat = (
  members = [],
) => ({
  id: datatype.number(),
  name: address.streetName() + ' flat',
  members,
  invitationToken: 'token',
});
