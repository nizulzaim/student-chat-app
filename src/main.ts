import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '@libs/logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 7070);
  const logger = new CustomLogger('Bootstrapper');

  logger.log(`Starting app on port ${port}`);
  await app.listen(port);
  logger.log(`App started on port ${port}`);
}

bootstrap();
