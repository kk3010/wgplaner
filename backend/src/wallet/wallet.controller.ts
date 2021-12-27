import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.decorator';

@ApiBearerAuth()
@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'gets all wallets from the flat of the user' })
  findAll(@User('flatId') flatId: number) {
    return this.walletService.findAll(flatId);
  }
}
