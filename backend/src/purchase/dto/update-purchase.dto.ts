import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';

export class UpdatePurchaseDto extends PartialType(
  OmitType(CreatePurchaseDto, ['shoppingItems'] as const),
) {}
