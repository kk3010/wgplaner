import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateFlatDto } from './create-flat.dto';

export class UpdateFlatDto extends PartialType(
  OmitType(CreateFlatDto, ['members'] as const),
) {}
