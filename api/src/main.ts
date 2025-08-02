import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['http://nest-full-stack-app-runner-web.s3-website-us-east-1.amazonaws.com'] // 生产环境的前端域名
      : ['http://localhost:5173'], // 开发环境的前端域名
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 如果需要发送 cookies 或认证信息
  });

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

  const options = new DocumentBuilder()
    .setTitle('Iluvcoffee')
    .setDescription('Coffee application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
