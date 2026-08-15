import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration for local LAN & production
  app.enableCors({
    origin: true, // Allow dynamic origins (localhost, 192.168.x.x LAN IPs, etc.)
    credentials: true,
  });

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('HRMS - Human Resource Management System API')
    .setDescription('Enterprise HRMS Backend API with JWT Auth, RBAC, CIDR Network Attendance, and Payroll Engine')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 HRMS Backend Server running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger API Documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
