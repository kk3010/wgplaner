import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './services/token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SkipJwtAuth } from './skip-jwt-auth.decorator';
import { UserService } from '../user/user.service';
import type { IUser } from '@interfaces/user.interface';
import { AuthenticationPayloadDto } from './dto/authentication-payload.dto';
import { RefreshDto } from './dto/refresh.dto';
import { User } from '../user/user.decorator';
import { RefreshTokensService } from './services/refresh-tokens.service';

@SkipJwtAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokensService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  async login(@User() user: IUser) {
    const { token, refresh } = await this.generateTokensForUser(user);

    return this.buildResponsePayload(user, token, refresh);
  }

  @Post('register')
  @ApiUnprocessableEntityResponse()
  @ApiBadRequestResponse()
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { token, refresh } = await this.generateTokensForUser(user);

    return this.buildResponsePayload(user, token, refresh);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    const { token, user } =
      await this.tokenService.createAccessTokenFromRefreshToken(
        body.refresh_token,
      );

    return this.buildResponsePayload(user, token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@User('id') userId: number) {
    await this.refreshTokenService.revokeRefreshTokens(userId);
  }

  private async generateTokensForUser(
    user: IUser,
  ): Promise<{ token: string; refresh: string }> {
    const [token, refresh] = await Promise.all([
      this.tokenService.generateAccessToken(user),
      this.tokenService.generateRefreshToken(user, 60 * 60 * 24 * 30),
    ]);
    return { token, refresh };
  }

  private buildResponsePayload(
    user: IUser,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayloadDto {
    return {
      user,
      token: accessToken,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }
}
