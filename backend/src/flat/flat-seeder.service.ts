import { Injectable } from '@nestjs/common';
import { generateFakeFlat } from '../../test/flat/flat.mock';
import { FlatService } from './flat.service';
import type { IUser } from '@interfaces/user.interface';

@Injectable()
export class FlatSeederService {
  constructor(private readonly flatService: FlatService) {}

  create(creator: IUser) {
    const { id, ...flat } = generateFakeFlat();
    return this.flatService.create(flat, creator);
  }
}
