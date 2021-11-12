import type { NextFunction, Request, Response } from 'express';
import { generateFakeFlat } from './flat.mock';

export const mockFlatMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.flat = generateFakeFlat();
  next();
};
