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
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import { BelongsToFlatGuard, SetService } from '../flat/belongs-to-flat.guard';
import type { IUser } from '../interfaces/user.interface';

@ApiBearerAuth()
@ApiTags('wallet')
@SetService(WalletService)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get('all')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'gets all wallets from the flat of the user' })
  findAll(@User('flatId') flatId: number) {
    return this.walletService.findAll(flatId);
  }

  @Get()
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'returns wallet with the id' })
  findOne(@User() user: IUser) {
    return this.walletService.findOneByUserId(user.id, user.flatId);
  }
}
