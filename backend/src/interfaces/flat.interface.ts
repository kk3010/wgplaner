import type { IUser } from './user.interface';

export interface IFlat {
  id: number;
  name: string;
  invitationToken: string;
  members: IUser[];
}
