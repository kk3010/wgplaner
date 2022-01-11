import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import type { IUser } from '../interfaces/user.interface';
import { SseService } from '../sse/sse.service';

@Controller('flat')
@ApiTags('flat')
@ApiBearerAuth()
export class FlatController {
  constructor(
    private readonly flatService: FlatService,
    private readonly sseService: SseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'create flat' })
  create(@User() user: IUser, @Body() createFlatDto: CreateFlatDto) {
    return this.flatService.create(createFlatDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'find flat' })
  @ApiNotFoundResponse({ description: 'Flat could not be found' })
  findOne(@User('flatId') flatId: number) {
    return this.flatService.findOneById(flatId);
  }

  @Patch()
  @ApiOperation({ summary: 'update flat name' })
  async update(@User() user: IUser, @Body() updateFlatDto: UpdateFlatDto) {
    console.log('user', user);
    console.log('ID', user.flatId);
    const flat = await this.flatService.updateName(user.flatId, updateFlatDto);
    this.sseService.emit(user, 'flat.update', {
      flat,
    });

    return flat;
  }

  @Delete()
  @ApiOperation({ summary: 'delete flat' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@User() user: IUser) {
    try {
      await this.flatService.remove(user.flatId);
      this.sseService.emit(user, 'flat.delete', {
        flat: user.flatId,
      });
    } catch (e) {
      throw new HttpException('flat not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('join/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'join a flat' })
  async addMember(@User() user: IUser, @Param('token') token: string) {
    const flat = await this.flatService.addMember(token, user);
    this.sseService.emit(user, 'flat.memberJoined', {
      flat,
    });
    return flat;
  }

  @Delete('user/:userToRemoveId')
  @ApiOperation({ summary: 'remove user from flat' })
  async removeUser(
    @User() user: IUser,
    @Param('userToRemoveId') userToRemoveId: number,
  ) {
    let flat = await this.flatService.findOneById(user.flatId);
    await this.flatService.removeMember(flat, userToRemoveId);
    this.sseService.emit(user, 'flat.memberRemoved', {
      userToRemoveId,
    });
  }
}
