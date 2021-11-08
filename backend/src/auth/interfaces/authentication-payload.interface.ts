import type { IUser } from '../../user/interfaces/user.interface';

export interface IAuthenticationPayload {
  user: Omit<IUser, 'password'>;
  payload: {
    token: string;
    refresh_token?: string;
  };
}
