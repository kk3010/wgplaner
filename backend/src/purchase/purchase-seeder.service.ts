import { Injectable } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { generateFakePurchase } from '../../test/purchase.mock';
import type { IUser } from '../interfaces/user.interface';
import type { IShoppingItem } from '../interfaces/shopping-item.interface';

@Injectable()
export class PurchaseSeederService {
  constructor(private readonly purchaseService: PurchaseService) {}

  create(user: IUser, items: IShoppingItem[]) {
    return Promise.all(
      Array.from(Array(5)).map(() => {
        const { id, ...purchase } = generateFakePurchase(
          user.flatId,
          user.id,
          items,
        );
        return this.purchaseService.create(user, purchase);
      }),
    );
  }
}