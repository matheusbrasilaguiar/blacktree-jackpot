import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow React to fetch from this API
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
