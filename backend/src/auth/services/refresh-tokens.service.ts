import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshTokens } from '../entites/refresh-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokens)
    private refreshTokensRepository: Repository<RefreshTokens>,
  ) {}

  async createRefreshToken(user: User, ttl: number) {
    const expires = new Date(Date.now() + ttl);

    const token = this.refreshTokensRepository.create({
      user_id: user.id,
      expires,
      is_revoked: false,
    });

    return this.refreshTokensRepository.save(token);
  }

  findOne(id: number) {
    return this.refreshTokensRepository.findOne(id);
  }
}
