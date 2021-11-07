import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SkipJwt } from './skit-jwt-auth.decorator';

@SkipJwt()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiBadRequestResponse()
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
  }
}
