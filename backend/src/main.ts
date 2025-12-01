import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';

/**
 * Uygulamayı bootstrap et
 * NestJS uygulamasını başlat, konfigürasyonları yap ve dinleme başla
 */
async function bootstrap() {
  // NestJS uygulamasını oluştur
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS ayarlarını yapılandır (Frontend'in API'ye erişebilmesi için)
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
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

  // Sunucuyu 3000 portunda dinlemeye başla
  await app.listen(3000);
  console.log('Swagger dokümantasyonu: http://localhost:3000/api adresinde erişilebilir');
}

// Bootstrap işlevini çalıştır
bootstrap();

