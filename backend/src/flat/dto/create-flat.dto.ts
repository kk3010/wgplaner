import { IsNotEmpty } from 'class-validator';
import type { IFlat } from '../../interfaces/flat.interface';

export class CreateFlatDto implements Pick<IFlat, 'name'> {
  @IsNotEmpty()
  readonly name: string;
}
