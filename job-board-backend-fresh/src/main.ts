import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Request logging for debugging on Render
  app.use(morgan('dev')); 

  // Enable CORS with support for both local and production environments
// Enable CORS with support for both local and production environments
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://master-job-saas.vercel.app', // Keep this just in case
      'https://job-board-saas-master.vercel.app', // THIS IS YOUR REAL URL
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Enable global validation (Strictly typed requests)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Render provides the PORT dynamically
  const PORT = process.env.PORT || 10000;
  
  // '0.0.0.0' allows external access on Render
  await app.listen(PORT, '0.0.0.0');
  
  console.log(`🚀 Backend running on port ${PORT}`);
}
bootstrap();