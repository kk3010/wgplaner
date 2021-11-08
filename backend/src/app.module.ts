import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          keepConnectionAlive: true,
        }),
    }),
    ConfigModule.forRoot({ cache: true }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RefreshTokenService],
})
export class AppModule {}
