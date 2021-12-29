import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FlatModule } from './flat/flat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './sse/sse.module';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { PurchaseModule } from './purchase/purchase.module';
import { WalletModule } from './wallet/wallet.module';
import * as Joi from 'joi';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          keepConnectionAlive: true,
        }),
    }),
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    FlatModule,
    SseModule,
    ShoppingItemModule,
    PurchaseModule,
    WalletModule,
  ],
})
export class AppModule {}
