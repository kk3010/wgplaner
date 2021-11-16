import { IsNotEmpty } from 'class-validator';

export class UpdateFlatDto {
  @IsNotEmpty()
  readonly name: string;
}
