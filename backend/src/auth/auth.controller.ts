import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  async login(@Request() req) {
    return req.user;
  }
}
