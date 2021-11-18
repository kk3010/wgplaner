import { address, datatype } from 'faker';
import type { IFlat } from '../src/interfaces/flat.interface';
import type { IUser } from '../src/interfaces/user.interface';

export const generateFakeFlat: (members?: IUser[]) => IFlat = (
  members = [],
) => ({
  id: datatype.number(),
  name: address.streetName() + ' flat',
  members,
  invitationToken: 'token',
});
