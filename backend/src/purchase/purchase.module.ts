import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { ShoppingItem } from '../shopping-item/entities/shopping-item.entity';
import { PurchaseSeederService } from './purchase-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    TypeOrmModule.forFeature([ShoppingItem]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseSeederService],
  exports: [PurchaseSeederService],
})
export class PurchaseModule {}
