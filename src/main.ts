import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getCorsConfig } from './auth/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour l'API v1
  app.setGlobalPrefix('api/v1');

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Air-FLE API')
    .setDescription("API de gestion pour l'école Air-FLE")
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configuration CORS sécurisée
  app.enableCors(getCorsConfig());

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Intercepteur de transformation des réponses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filtre d'exception global
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
