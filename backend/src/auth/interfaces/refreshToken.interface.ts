export interface IRefreshToken {
  user_id: number;
  is_revoked: boolean;
  expires: Date;
}
