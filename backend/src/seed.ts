import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);
  const logger = new Logger('Seed');

  try {
    // Seed default users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Admin User',
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'user123',
        fullName: 'Test User',
      },
    ];

    for (const userData of users) {
      const existingUser = await usersService.findByUsername(userData.username);
      if (!existingUser) {
        await usersService.create({
          ...userData,
          role: userData.username === 'admin' ? 'admin' : 'user',
        });
        logger.log(`✅ Created user: ${userData.username}`);
      } else {
        logger.log(`⏭️  User already exists: ${userData.username}`);
      }
    }

    logger.log('🌱 Seed completed successfully');
  } catch (error) {
    logger.error('❌ Seed failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
