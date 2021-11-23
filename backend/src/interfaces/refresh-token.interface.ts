export interface IRefreshToken {
  id: number;
  user_id: number;
  is_revoked: boolean;
  expires: Date;
}
