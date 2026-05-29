import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular frontend
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('MPloyChek API')
    .setDescription('MPloyChek Background Verification Enterprise SaaS API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Login, profile, and token refresh')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Cases', 'Background verification case management')
    .addTag('Audit', 'Audit log (Admin only)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 MPloyChek API running on port ${port}`);
  Logger.log(`📚 Swagger docs available at /api/docs`);
}

bootstrap();
