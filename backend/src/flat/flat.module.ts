import { Module } from '@nestjs/common';
import { FlatService } from './flat.service';
import { FlatController } from './flat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flat } from './entities/flat.entity';
import { FlatSeederService } from './flat-seeder.service';
import { WalletModule } from '../../src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Flat]), WalletModule],
  controllers: [FlatController],
  providers: [FlatService, FlatSeederService],
  exports: [FlatService, FlatSeederService],
})
export class FlatModule {}
