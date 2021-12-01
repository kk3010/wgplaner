import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import type { IUser } from '../interfaces/user.interface';

@Controller('shopping-item')
@ApiTags('shopping-item')
@ApiBearerAuth()
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Post()
  @ApiOperation({ summary: 'create ShoppingItem' })
  @ApiNotFoundResponse({ description: 'ShoppingItem could not be found' })
  create(
    @User('flatId') flatId: number,
    @Body() createShoppingItemDto: CreateShoppingItemDto,
  ) {
    return this.shoppingItemService.create(flatId, createShoppingItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all not purchase shoppingItems for a flat' })
  findOne(@User('flatId') id: number) {
    //TODO: Change me
    return this.shoppingItemService.findOne(id);
  }

  // TODO check if path naming is correct
  @Patch('check/:id')
  @ApiOperation({ summary: 'update checked state of item' })
  update(@Param('id') id: number, @User() user: IUser) {
    return this.shoppingItemService.toggleCheck(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete shoppingItem by id' })
  remove(@Param('id') id: number) {
    return this.shoppingItemService.remove(+id);
  }
}
