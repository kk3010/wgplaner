import {
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsPositive,
} from 'class-validator';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  shoppingItems?: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  payers: number[];
}
