import {
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsOptional,
} from 'class-validator';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  shoppingItems?: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  payers: number[];
}
