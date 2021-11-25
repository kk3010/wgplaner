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

@Controller('shopping-item')
@ApiTags('shopping-item')
@ApiBearerAuth()
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Post()
  @ApiOperation({ summary: 'create flat' })
  @ApiNotFoundResponse({ description: 'Flat could not be found' })
  create(@Body() createShoppingItemDto: createShoppingItemDto) {
    return this.shoppingItemService.create(createShoppingItemDto);
  }

  // Do we need this?
  // @Get()
  // @ApiOperation({ summary: 'get all shoppingItems' })
  // findAll() {
  //   return this.shoppingItemService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'get shoppingItem by id' })
  findOne(@Param('id') id: string) {
    return this.shoppingItemService.findOne(+id);
  }

  // TODO check if path naming is correct
  @Patch('check/:id')
  @ApiOperation({ summary: 'update checked state of item' })
  update(@Param('id') id: string) {
    return this.shoppingItemService.toggleCheck(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete shoppingItem by id' })
  remove(@Param('id') id: string) {
    return this.shoppingItemService.remove(+id);
  }
}
