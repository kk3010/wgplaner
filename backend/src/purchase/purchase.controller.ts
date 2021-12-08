import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from '../user/user.decorator';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/interfaces/user.interface';

@ApiBearerAuth()
@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'create new purchase with items' })
  create(@User() user: IUser, @Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(user, createPurchaseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'find one purchase' })
  findOne(@Param('id') id: number) {
    return this.purchaseService.find(id);
  }

  @Get()
  @ApiOperation({ summary: 'find all purchases in the flat' })
  findAll(@User('flatId') flatId: number) {
    return this.purchaseService.findAll(flatId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update purchase name and price' })
  update(
    @Param('id') id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete purchase' })
  remove(@Param('id') id: number) {
    return this.purchaseService.remove(id);
  }
}
