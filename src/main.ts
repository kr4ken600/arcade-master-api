import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    const configSwagger = new DocumentBuilder()
      .setTitle('Arcade Master API')
      .setDescription('API para gestionar juegos arcade y récords de sesiones')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api/docs', app, document);

    console.log('📖 Swagger documentation is available at: /api/docs');
  }

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Corriendo en: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la maquinita:', err);
  process.exit(1);
});
