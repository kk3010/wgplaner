import { Module } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { ShoppingItemController } from './shopping-item.controller';
import { ShoppingItem } from './entities/shopping-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingItemSeederService } from './shopping-item-seeder.service';
import { SseService } from '../sse/sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingItem])],
  controllers: [ShoppingItemController],
  providers: [ShoppingItemService, ShoppingItemSeederService, SseService],
  exports: [ShoppingItemSeederService],
})
export class ShoppingItemModule {}
