import { Module } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { ShoppingItemController } from './shopping-item.controller';
import { ShoppingItem } from './entities/shopping-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingItem])],
  controllers: [ShoppingItemController],
  providers: [ShoppingItemService],
})
export class ShoppingItemModule {}
