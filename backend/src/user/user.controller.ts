import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import type { IJwtPayload } from '../auth/interfaces/IJwtPayload';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  profile(@Req() req: Request) {
    return this.userService.findOne((req.user as IJwtPayload).email);
  }

  @Patch()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update((req.user as IJwtPayload).sub, updateUserDto);
  }

  @Delete()
  async remove(@Req() req: Request) {
    await this.userService.remove((req.user as IJwtPayload).sub);
  }
}
