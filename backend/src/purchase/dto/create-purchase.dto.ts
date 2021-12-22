import { IsNumber, IsArray } from 'class-validator';

export class CreatePurchaseDto {
  name?: string;

  @IsNumber()
  price: number;

  @IsArray()
  shoppingItems: number[];

  @IsArray()
  payers: number[];
}
