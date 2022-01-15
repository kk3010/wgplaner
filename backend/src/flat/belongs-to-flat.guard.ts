import { Injectable, SetMetadata } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { IUser } from '@interfaces/user.interface';
import { ModuleRef, Reflector } from '@nestjs/core';

const SERVICE_TOKEN = 'BelongsToFlatService';

interface IFlatRelated {
  findOneById(id: number): Promise<{ flatId: number }>;
}

/**
 * Checks if a given item belongs to a user's flat
 * Needs {@link SetService} to set the service that will be used to retrieve the item.
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
    const service: IFlatRelated = this.moduleRef.get(serviceType);
    const item = await service.findOneById(Number(req.params.id));
    return (req.user as IUser)?.flatId === item.flatId;
  }
}

export const SetService = (service: new (...args: any) => IFlatRelated) =>
  SetMetadata(SERVICE_TOKEN, service);
