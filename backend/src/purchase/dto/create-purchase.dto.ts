import { IsNumber, IsArray, ArrayMinSize, ArrayUnique } from 'class-validator';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  price: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  shoppingItems: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  payers: number[];
}
