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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('flat')
@ApiTags('flat')
@ApiBearerAuth()
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  create(@Body() createFlatDto: CreateFlatDto) {
    return this.flatService.create(createFlatDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlatDto: UpdateFlatDto) {
    return this.flatService.updateName(+id, updateFlatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flatService.remove(+id);
  }

  @Patch(':id/:email')
  inviteUser(
    @Param('id') id: string,
    @Param('email') email: string,
    @Body() updateFlatDto: UpdateFlatDto,
  ) {
    return this.flatService.updateName(+id, updateFlatDto);
  }

  @Patch(':id/:userId')
  removeUser(
    @Param('id') id: string,
    @Param('userId') userId: number,
    @Body() updateFlatDto: UpdateFlatDto,
  ) {
    return this.flatService.removeMember(+id, userId, updateFlatDto);
  }
}
