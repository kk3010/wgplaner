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
import { createShoppingItemDto } from './dto/create-shopping-item.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { IUser } from 'src/interfaces/user.interface';

@Controller('shopping-item')
@ApiTags('shopping-item')
@ApiBearerAuth()
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Post()
  @ApiOperation({ summary: 'create ShoppingItem' })
  @ApiNotFoundResponse({ description: 'ShoppingItem could not be found' })
  create(
    @User() user: IUser,
    @Body() createShoppingItemDto: createShoppingItemDto,
  ) {
    return this.shoppingItemService.create(user, createShoppingItemDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get shoppingItem by id' })
  findOne(@Param('id') id: string) {
    return this.shoppingItemService.findOne(+id);
  }

  // TODO check if path naming is correct
  @Patch('check/:id')
  @ApiOperation({ summary: 'update checked state of item' })
  update(@Param('id') id: string, @User() user: IUser) {
    return this.shoppingItemService.toggleCheck(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete shoppingItem by id' })
  remove(@Param('id') id: string) {
    return this.shoppingItemService.remove(+id);
  }
}
