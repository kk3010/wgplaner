import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from '../user/user.decorator';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { IUser } from '../interfaces/user.interface';
import { BelongsToFlatGuard, SetService } from '../flat/belongs-to-flat.guard';
import { SseService } from 'src/sse/sse.service';

@ApiBearerAuth()
@ApiTags('purchase')
@SetService(PurchaseService)
@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly sseService: SseService
    ) {}

  @Post()
  @ApiOperation({ summary: 'create new purchase with items' })
  async create(
    @User() user: IUser, 
    @Body() createPurchaseDto: CreatePurchaseDto) {
    const purchase = await this.purchaseService.create(user, createPurchaseDto);
    this.sseService.emit(user.flatId, 'purchase.crate',{
      purchase,
      user: user.firstName,
    });
    return purchase
  }

  @Get(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'find one purchase' })
  findOne(@Param('id') id: number) {
    return this.purchaseService.findOneById(id);
  }

  @Get()
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'find all purchases in the flat' })
  findAll(@User('flatId') flatId: number) {
    return this.purchaseService.findAll(flatId);
  }

  @Patch(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'update purchase balance by value' })
  async update(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    const purchase = await this.purchaseService.update(id, updatePurchaseDto);
    this.sseService.emit(user.flatId, 'purchse.update',{
      purchase,
      user: user.firstName
    })
    return purchase
  }
}
