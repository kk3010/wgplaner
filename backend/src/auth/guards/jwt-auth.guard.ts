import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_JWT_AUTH_KEY } from '../skip-jwt-auth.decorator';
import { ExecutionContext } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipJwt = this.reflector.getAllAndOverride<boolean>(
      SKIP_JWT_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skipJwt) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      throw err;
    }
    if (!user) {
      if (info instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('jwt expired');
      }
      throw new UnauthorizedException();
    }
    return user;
  }
}
