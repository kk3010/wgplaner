import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlatSeederService } from './flat/flat-seeder.service';
import { UserSeederService } from './user/user-seeder.service';
import { UserService } from './user/user.service';
import { ShoppingItemSeederService } from './shopping-item/shopping-item-seeder.service';
import { PurchaseSeederService } from './purchase/purchase-seeder.service';
import { FlatService } from './flat/flat.service';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule);
  try {
    const userService = ctx.get(UserService);
    const flatSeeder = ctx.get(FlatSeederService);
    const flatService = ctx.get(FlatService);
    const userSeeder = ctx.get(UserSeederService);
    const purchaseSeeder = ctx.get(PurchaseSeederService);
    const shoppingItemSeeder = ctx.get(ShoppingItemSeederService);
    const logger = new Logger('Seeder');
    const password = 'abc123456';
    const testUser = await userService.create({
      email: 'test@test.de',
      firstName: 'Test',
      lastName: 'Mc Testface',
      password,
    });
    const flat = await flatSeeder.create(testUser);
    testUser.flatId = flat.id;
    const users = await userSeeder.create();
    await Promise.all(
      users.map(async (u) => {
        await flatService.addMember(flat.invitationToken, u);
        u.flatId = flat.id;
      }),
    );
    logger.log(`Test user: \n email: ${testUser.email} password: ${password}`);
    await shoppingItemSeeder.create(flat.id);
    await Promise.all(
      [...users, testUser].map(async (user) => {
        const items = await shoppingItemSeeder.create(flat.id);
        return purchaseSeeder.create(user, items);
      }),
    );
  } catch (e) {
    console.error(e);
  } finally {
    ctx.close();
  }
}

bootstrap();
