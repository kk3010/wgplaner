import { Module } from '@nestjs/common';
import { FlatService } from './flat.service';
import { FlatController } from './flat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flat } from './entities/flat.entity';
import { FlatSeederService } from './flat-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flat])],
  controllers: [FlatController],
  providers: [FlatService, FlatSeederService],
  exports: [FlatService, FlatSeederService],
})
export class FlatModule {}
