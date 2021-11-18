import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import type { IUser } from '../interfaces/user.interface';

@Controller('flat')
@ApiTags('flat')
@ApiBearerAuth()
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  @ApiOperation({ summary: 'create flat' })
  create(@User() user: IUser, @Body() createFlatDto: CreateFlatDto) {
    return this.flatService.create(createFlatDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'find flat' })
  findOne(@User('flatId') flatId: number) {
    return this.flatService.findOneById(flatId);
  }

  @Patch()
  @ApiOperation({ summary: 'update flat name' })
  async update(
    @User('flatId') flatId: number,
    @Body() updateFlatDto: UpdateFlatDto,
  ) {
    await this.flatService.updateName(flatId, updateFlatDto);
  }

  @Delete()
  @ApiOperation({ summary: 'delete flat' })
  async remove(@User('flatId') flatId: number) {
    await this.flatService.remove(flatId);
  }

  @Post('join/:token')
  @ApiOperation({ summary: 'join a flat' })
  addMember(@User() user: IUser, @Param('token') token: string) {
    return this.flatService.addMember(token, user);
  }

  @Delete('user/:userToRemoveId')
  @ApiOperation({ summary: 'remove user from flat' })
  async removeUser(
    @User('flatId') flatId: number,
    @Param('userToRemoveId') userToRemoveId: number,
  ) {
    const flat = await this.flatService.findOneById(flatId);
    await this.flatService.removeMember(flat, userToRemoveId);
  }
}
