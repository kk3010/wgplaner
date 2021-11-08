import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

/**
 * The local strategy is used to verify login credentials before issuing a JWT
 *
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    // passport-local by default expects a property named 'username' - we're using an email address though
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
