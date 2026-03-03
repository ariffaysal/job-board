import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Request logging for debugging on Render
  app.use(morgan('dev')); 

  // Updated CORS to include your specific Vercel deployment URL
app.enableCors({
  origin: (origin, callback) => {
    // This allows localhost OR any URL ending in .vercel.app
    if (!origin || origin.match(/localhost/) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

  const PORT = process.env.PORT || 10000;
  
  await app.listen(PORT, '0.0.0.0');
  
  console.log(`🚀 Backend running on port ${PORT}`);
}
bootstrap();