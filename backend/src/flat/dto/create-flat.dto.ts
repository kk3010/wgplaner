import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import type { IFlat } from '../interfaces/flat.interface';

export class CreateFlatDto implements Omit<IFlat, 'id'> {
  @IsNotEmpty()
  readonly name: string;

  readonly members: User[];
}
