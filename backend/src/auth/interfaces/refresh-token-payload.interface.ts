export interface IRefreshTokenPayload {
  /** the token's id */
  jti: number;
  /** the token's subject i.e. the associated user's id */
  sub: number;
}
