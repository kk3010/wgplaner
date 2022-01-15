import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokenPayloadDto } from '../dto/refresh-token-payload.dto';
import type { IUser } from '@interfaces/user.interface';
import type { IRefreshToken } from '@interfaces/refresh-token.interface';

@Injectable()
export class TokenService {
  private readonly BASE_OPTIONS: SignOptions;

  constructor(
    configService: ConfigService,
    private userService: UserService,
    private refreshTokensService: RefreshTokensService,
    private jwtService: JwtService,
  ) {
    const url = configService.get('FRONTEND_URL');
    this.BASE_OPTIONS = {
      issuer: url,
      audience: url,
    };
  }

  async generateAccessToken(user: IUser): Promise<string> {
    const opts: SignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
    };
    return this.jwtService.signAsync({}, opts);
  }

  async generateRefreshToken(user: IUser, expiresIn: number): Promise<string> {
    const token = await this.refreshTokensService.createRefreshToken(
      user,
      expiresIn,
    );

    const opts: SignOptions = {
      ...this.BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    };

    return this.jwtService.signAsync({}, opts);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: IUser; token: IRefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getRefreshTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.is_revoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: IUser }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayloadDto> {
    try {
      return await this.jwtService.verify(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayloadDto,
  ): Promise<IUser> {
    if (!payload.sub) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    return this.userService.findById(payload.sub);
  }

  private getRefreshTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayloadDto,
  ): Promise<IRefreshToken> {
    if (!payload.jti) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    return this.refreshTokensService.findOne(payload.jti);
  }
}
