import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

/**
 * Uygulamayı bootstrap et
 * NestJS uygulamasını başlat, konfigürasyonları yap ve dinleme başla
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // NestJS uygulamasını oluştur
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Static dosyaları serve et (uploads klasörü)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // CORS ayarlarını yapılandır (Frontend'in API'ye erişebilmesi için)
  const corsOrigin = configService.get<string>('corsOrigin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Global validation pipe'ını ekle (DTO doğrulama)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global hata filtre'sini ekle
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor'ı ekle
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global class serializer interceptor'ı ekle (@Exclude() decorator'ının çalışması için)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger API Dokümantasyonu Konfigürasyonu
  const config = new DocumentBuilder()
    .setTitle('GameVault API')
    .setDescription('Oyun hesapları ve lisanslar satış platformu API dokümantasyonu')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .addTag('Kimlik Doğrulama', 'Kullanıcı kaydı ve girişi endpoint\'leri')
    .addTag('Kullanıcılar', 'Kullanıcı yönetimi endpoint\'leri')
    .addTag('Roller', 'Rol yönetimi endpoint\'leri')
    .addTag('Oyunlar', 'Oyun yönetimi endpoint\'leri')
    .addTag('Ürünler', 'Ürün yönetimi endpoint\'leri')
    .addTag('Siparişler', 'Sipariş yönetimi endpoint\'leri')
    .build();

  // Swagger dokümantasyonunu oluştur
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Sunucuyu başlat
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  
  logger.log(`Uygulama http://localhost:${port} adresinde çalışıyor`);
  logger.log(`Swagger dokümantasyonu: http://localhost:${port}/api`);
}

// Bootstrap işlevini çalıştır
bootstrap();

