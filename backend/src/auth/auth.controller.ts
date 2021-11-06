import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
