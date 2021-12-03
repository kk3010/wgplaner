import { Injectable } from '@nestjs/common';
import { generateFakeUser } from '../../test/user.mock';
import { UserService } from './user.service';

@Injectable()
export class UserSeederService {
  constructor(private readonly userService: UserService) {}

  create(flatId: number) {
    return Promise.all(
      Array(3)
        .fill(null)
        .map(() => {
          const { id, ...user } = generateFakeUser(flatId);
          return this.userService.create(user);
        }),
    );
  }
}
