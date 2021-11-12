import { address } from 'faker';
import { IFlat } from 'src/flat/interfaces/flat.interface';
import { generateFakeUser } from './user.mock';

export const generateFakeFlat: () => IFlat = () => ({
  id: 1,
  name: address.streetName + ' flat',
  members: [generateFakeUser()],
});
