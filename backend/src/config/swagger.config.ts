import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Book Library Management API')
    .setDescription(`
## Overview
A comprehensive API for managing a book library system.

## Features
- **Authentication**: JWT-based authentication with register/login
- **Books Management**: Full CRUD operations for books
- **Borrow/Return**: Track book availability with borrow and return functionality
- **File Upload**: Upload cover images for books
- **Search**: Search books by title, author, or ISBN

## Authentication
All book endpoints require a valid JWT token. Include it in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Books', 'Book management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Library API Documentation',
  });
}
