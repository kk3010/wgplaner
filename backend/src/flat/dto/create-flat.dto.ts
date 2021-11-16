import { IsNotEmpty } from 'class-validator';
import type { IFlat } from '../interfaces/flat.interface';

export class CreateFlatDto
  implements Omit<IFlat, 'id' | 'invitationToken' | 'members'>
{
  @IsNotEmpty()
  readonly name: string;
}
