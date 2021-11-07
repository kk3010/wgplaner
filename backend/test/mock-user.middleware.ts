import type { NextFunction, Request, Response } from 'express';
import type { IJwtPayload } from '../dist/auth/interfaces/IJwtPayload';

export const mockUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: IJwtPayload = { email: '', sub: 1 };
  req.user = user;
  next();
};
