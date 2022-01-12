import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
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
import { HttpCode } from '@nestjs/common';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

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
    this.sseService.emit(user, 'shopping-item.create', { item });
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() ShoppingItemDto: UpdateShoppingItemDto,
  ) {
    await this.shoppingItemService.update(id, ShoppingItemDto);
    this.sseService.emit(user, 'shopping-item.update', { item: { id, ...ShoppingItemDto }});
  }

  @Delete(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'delete shopping item' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@User() user: IUser, @Param('id') id: number) {
    try {
      await this.shoppingItemService.remove(id);
      this.sseService.emit(user, 'shopping-item.delete', { item: { id }});
    } catch (e) {
      throw new HttpException('item not found', HttpStatus.BAD_REQUEST);
    }
  }
}
