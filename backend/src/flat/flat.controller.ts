import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { IUser } from '../user/interfaces/user.interface';

@Controller('flat')
@ApiTags('flat')
@ApiBearerAuth()
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  @ApiOperation({ summary: 'create flat' })
  create(@Body() createFlatDto: CreateFlatDto, @Req() req: Request) {
    return this.flatService.create(createFlatDto, req.user as IUser);
  }

  @Get()
  @ApiOperation({ summary: 'find flat' })
  findOne(@Req() req: Request) {
    return this.flatService.findOne(req.user as IUser);
  }

  @Patch()
  @ApiOperation({ summary: 'update flat name' })
  async update(@Req() req: Request, @Body() updateFlatDto: UpdateFlatDto) {
    await this.flatService.updateName(req.user as IUser, updateFlatDto);
  }

  @Delete()
  @ApiOperation({ summary: 'delete flat' })
  async remove(@Req() req: Request) {
    await this.flatService.remove(req.user as IUser);
  }

  @Patch('join/:token')
  @ApiOperation({ summary: 'join a flat' })
  addMember(@Req() req: Request, @Param('token') token: string) {
    return this.flatService.addMember(token, req.user as IUser);
  }

  @Delete(':id/user/:userId')
  @ApiOperation({ summary: 'remove user from flat' })
  async removeUser(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('userId') userId: number,
  ) {
    await this.flatService.removeMember(req.user as IUser, id, userId);
  }
}
