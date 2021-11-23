import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FlatModule } from './flat/flat.module';
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
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    FlatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
