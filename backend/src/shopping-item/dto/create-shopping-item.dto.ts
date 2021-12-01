import { IsNotEmpty } from 'class-validator';
import type { IShoppingItem } from '../../interfaces/shopping-item.interface';

export class CreateShoppingItemDto implements Pick<IShoppingItem, 'name'> {
  @IsNotEmpty()
  readonly name: string;
}
