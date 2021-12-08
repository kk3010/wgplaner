import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { ShoppingItemDto } from './dto/shopping-item.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import { BelongsToFlatGuard, SetService } from '../flat/belongs-to-flat.guard';

@Controller('shopping-item')
@ApiTags('shopping-item')
@SetService(ShoppingItemService)
@ApiBearerAuth()
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Post()
  @ApiOperation({ summary: 'create shopping item' })
  @ApiNotFoundResponse({ description: 'ShoppingItem could not be found' })
  create(
    @User('flatId') flatId: number,
    @Body() createShoppingItemDto: ShoppingItemDto,
  ) {
    return this.shoppingItemService.create(flatId, createShoppingItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all unpurchased shopping items of a flat' })
  findAll(@User('flatId') id: number) {
    return this.shoppingItemService.findUnpurchasedItems(id);
  }

  @Patch(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'update item' })
  async update(
    @Param('id') id: number,
    @Body() ShoppingItemDto: ShoppingItemDto,
  ) {
    await this.shoppingItemService.update(id, ShoppingItemDto);
  }

  @Delete(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'delete shopping item' })
  remove(@Param('id') id: number) {
    return this.shoppingItemService.remove(id);
  }
}
