import { generateFakeUser } from './user.mock';
import type { IUser } from '../../src/interfaces/user.interface';
import type { NextFunction, Request, Response } from 'express';

export const createMockUserMiddleware =
  (user?: IUser) => (req: Request, res: Response, next: NextFunction) => {
    req.user = user ?? generateFakeUser();
    next();
  };
