import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { ShoppingItem } from '../shopping-item/entities/shopping-item.entity';
import { PurchaseSeederService } from './purchase-seeder.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletModule } from '../../src/wallet/wallet.module';
import { Wallet } from '../../src/wallet/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    TypeOrmModule.forFeature([ShoppingItem]),
    TypeOrmModule.forFeature([Wallet]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseSeederService, WalletService],
  exports: [PurchaseSeederService],
})
export class PurchaseModule {}
