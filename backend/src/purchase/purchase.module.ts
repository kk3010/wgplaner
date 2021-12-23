import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseSeederService } from './purchase-seeder.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase]), WalletModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseSeederService],
  exports: [PurchaseSeederService],
})
export class PurchaseModule {}
