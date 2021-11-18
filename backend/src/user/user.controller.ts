import { Controller, Get, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayloadDto } from './dto/user-payload.dto';
import { User } from './user.decorator';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  profile(@User('id') userId: number): Promise<UserPayloadDto> {
    return this.userService.findById(userId);
  }

  @Patch()
  async update(
    @User('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(userId, updateUserDto);
  }

  @Delete()
  async remove(@User('id') userId: number) {
    await this.userService.remove(userId);
  }
}
