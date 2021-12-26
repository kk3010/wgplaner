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
import type { IUser } from '../interfaces/user.interface';
import { SseService } from '../sse/sse.service';

@Controller('shopping-item')
@ApiTags('shopping-item')
@SetService(ShoppingItemService)
@ApiBearerAuth()
export class ShoppingItemController {
  constructor(
    private readonly shoppingItemService: ShoppingItemService,
    private readonly sseService: SseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'create shopping item' })
  @ApiNotFoundResponse({ description: 'ShoppingItem could not be found' })
  async create(
    @User() user: IUser,
    @Body() createShoppingItemDto: ShoppingItemDto,
  ) {
    const item = await this.shoppingItemService.create(
      user.flatId,
      createShoppingItemDto,
    );
    this.sseService.emit(user.flatId, 'shopping-item.create', {
      item,
      user: user.firstName,
    });
    return item;
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
  async remove(@User() user: IUser, @Param('id') id: number) {
    await this.shoppingItemService.remove(id);
    this.sseService.emit(user.flatId, 'shopping-item.delete', {
      id,
      user: user.id,
    });
  }
}
