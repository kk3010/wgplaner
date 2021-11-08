import type { NextFunction, Request, Response } from 'express';
import { generateFakeUser } from './user.mock';

export const mockUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.user = generateFakeUser();
  next();
};
