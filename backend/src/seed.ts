import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlatSeederService } from './flat/flat-seeder.service';
import { UserSeederService } from './user/user-seeder.service';
import { UserService } from './user/user.service';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule);
  try {
    const userService = ctx.get(UserService);
    const flatSeeder = ctx.get(FlatSeederService);
    const userSeeder = ctx.get(UserSeederService);
    const logger = new Logger('Seeder');
    const password = 'abc123456';
    const testUser = await userService.create({
      email: 'test@test.de',
      firstName: 'Test',
      lastName: 'Mc Testface',
      password,
    });
    const flat = await flatSeeder.create(testUser);
    const users = await userSeeder.create(flat.id);
    logger.log(
      `Test user: \n email: ${testUser.email} password: ${testUser.password}`,
    );
  } catch (e) {
    console.error(e);
  } finally {
    ctx.close();
  }
}

bootstrap();
