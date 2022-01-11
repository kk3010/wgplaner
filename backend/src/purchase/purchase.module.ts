import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './entities/purchase.entity';
import { PurchaseSeederService } from './purchase-seeder.service';
import { WalletModule } from '../wallet/wallet.module';
import { SseService } from '../sse/sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase]), WalletModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseSeederService, SseService],
  exports: [PurchaseSeederService],
})
export class PurchaseModule {}
