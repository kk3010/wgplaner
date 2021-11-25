import { PartialType } from '@nestjs/swagger';
import { createShoppingItemDto } from './create-shopping-item.dto';

export class UpdateShoppingItemDto extends PartialType(createShoppingItemDto) {}
