import { User } from 'src/user/entities/user.entity';

export interface IFlat {
  id: number;
  name: string;
  invitationToken: string;
  members: User[];
}
