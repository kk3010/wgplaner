import { Injectable, SetMetadata } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { IUser } from '../interfaces/user.interface';
import { ModuleRef, Reflector } from '@nestjs/core';

const SERVICE_TOKEN = 'BelongsToFlatService';

/**
 * Checks if a given item belongs to a user's flat
 */
@Injectable()
export class BelongsToFlatGuard {
  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const serviceType = this.reflector.getAllAndOverride(SERVICE_TOKEN, [
      context.getClass(),
      context.getHandler(),
    ]);
    const service = this.moduleRef.get(serviceType);
    const item = await service.findOneById(Number(req.params.id));
    console.log(item);
    return (req.user as IUser)?.flatId === item.flatId;
  }
}

export const SetService = (service: any) => SetMetadata(SERVICE_TOKEN, service);
