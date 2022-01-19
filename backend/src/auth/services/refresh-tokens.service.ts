import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entites/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '@interfaces/user.interface';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: IUser, ttl: number) {
    const expires = new Date(Date.now() + ttl);

    await this.revokeRefreshTokens(user.id);

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

  async revokeRefreshTokens(userId: number) {
    await this.refreshTokensRepository.update(
      { user_id: userId },
      { is_revoked: true },
    );
  }
}
