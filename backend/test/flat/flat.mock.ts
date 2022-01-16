import { address, datatype } from 'faker';
import type { IFlat } from '@interfaces/flat.interface';
import type { IUser } from '@interfaces/user.interface';

export const generateFakeFlat: (members?: IUser[]) => IFlat = (
  members = [],
) => {
  const flat = {
    id: datatype.number(),
    name: address.streetName() + ' flat',
    members,
    invitationToken: 'token',
  };
  members.forEach((member) => (member.flatId = flat.id));
  return flat;
};
