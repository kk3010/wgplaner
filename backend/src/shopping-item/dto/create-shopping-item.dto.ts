import { IsNotEmpty } from 'class-validator';
import { IShoppingItem } from 'src/interfaces/shopping-item.interface';

export class createShoppingItemDto implements Pick<IShoppingItem, 'name'> {
  @IsNotEmpty()
  readonly name: string;
}
