import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { IUser } from '../user/interfaces/user.interface';
import { UserPayloadDto } from './dto/user-payload.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  profile(@Req() req: Request): Promise<UserPayloadDto> {
    return this.userService.findById((req.user as IUser).id);
  }

  @Patch()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update((req.user as IUser).id, updateUserDto);
  }

  @Delete()
  async remove(@Req() req: Request) {
    await this.userService.remove((req.user as IUser).id);
  }
}
