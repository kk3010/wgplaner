import { PartialType } from '@nestjs/swagger';
import { ShoppingItemDto } from './shopping-item.dto';

export class UpdateShoppingItemDto extends PartialType(ShoppingItemDto) {}
