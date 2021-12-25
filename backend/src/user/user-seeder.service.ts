import { Injectable } from '@nestjs/common';
import { generateFakeUser } from '../../test/user/user.mock';
import { UserService } from './user.service';

@Injectable()
export class UserSeederService {
  constructor(private readonly userService: UserService) {}

  create() {
    return Promise.all(
      Array(3)
        .fill(null)
        .map(() => {
          const { id, ...user } = generateFakeUser();
          return this.userService.create(user);
        }),
    );
  }
}
