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

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(
    @User('flatId') flatId: number,
    @Body() createPurchaseDto: CreatePurchaseDto,
  ) {
    return this.purchaseService.create(flatId, createPurchaseDto);
  }

  @Get(':id')
  findAll(@Param('id') id: number) {
    return this.purchaseService.findAllByFlatId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.purchaseService.remove(id);
  }
}
