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
  @ApiOperation({ summary: 'create shopping item' })
  @ApiNotFoundResponse({ description: 'ShoppingItem could not be found' })
  create(
    @User('flatId') flatId: number,
    @Body() createShoppingItemDto: CreateShoppingItemDto,
  ) {
    return this.shoppingItemService.create(flatId, createShoppingItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all unpurchased shopping items of a flat' })
  findAll(@User('flatId') id: number) {
    return this.shoppingItemService.findUnpurchasedItems(id);
  }

  // TODO check if path naming is correct
  @Patch('check/:id')
  @ApiOperation({ summary: 'update checked state of item' })
  update(@Param('id') id: number) {
    return this.shoppingItemService.toggleCheck([id]);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete shoppingItem by id' })
  remove(@Param('id') id: number) {
    return this.shoppingItemService.remove(id);
  }
}
