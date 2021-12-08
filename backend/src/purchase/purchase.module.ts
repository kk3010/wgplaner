import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { ShoppingItem } from 'src/shopping-item/entities/shopping-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    TypeOrmModule.forFeature([ShoppingItem]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
