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
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../src/user/user.decorator';
import { IUser } from 'src/interfaces/user.interface';
import { BelongsToFlatGuard, SetService } from 'src/flat/belongs-to-flat.guard';

@ApiBearerAuth()
@ApiTags('wallet')
@SetService(WalletService)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'creates a new wallet' })
  create(@User() user: IUser) {
    return this.walletService.create(user);
  }

  @Get()
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'gets all wallets from the flat of the user' })
  findAll(@User('flatId') flatId: number) {
    return this.walletService.findAll(flatId);
  }

  @Get(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'returns wallet with the id' })
  findOne(@Param('id') id: number) {
    return this.walletService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'updates wallet balance' })
  update(@Param('id') id: number, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @UseGuards(BelongsToFlatGuard)
  @ApiOperation({ summary: 'deletes the wallet' })
  remove(@Param('id') id: number) {
    return this.walletService.remove(id);
  }
}
