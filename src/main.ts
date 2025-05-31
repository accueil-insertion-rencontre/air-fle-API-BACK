import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Préfixe global pour l'API v1
  app.setGlobalPrefix('api/v1');
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Air-FLE API')
    .setDescription('API de gestion pour l\'école Air-FLE')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Configuration CORS détaillée
  app.enableCors({
    origin: [
      'http://localhost:3000',    // Frontend en dev (React/Next.js)
      'http://localhost:3001',    // Frontend alternatif
      'http://localhost:4200',    // Angular
      'http://localhost:5173',    // Vite
      'http://localhost:8080',    // Vue.js
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    credentials: true, // Permettre les cookies et l'authentification
    optionsSuccessStatus: 200 // Support des navigateurs legacy
  });
  
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
