import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { IUser } from '../interfaces/user.interface';

export const User = createParamDecorator(
  (data: keyof IUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IUser;

    return data ? user?.[data] : user;
  },
);
