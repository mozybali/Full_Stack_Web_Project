/**
 * Ana Uygulama Modülü
 * Tüm feature modüllerini import eder ve veritabanı bağlantısını yapılandırır
 */
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env.config';

// Feature Modüller
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GamesModule } from './games/games.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeedingModule } from './seeding/seeding.module';
import { UploadModule } from './upload/upload.module';
import { SeedingService } from './seeding/seeding.service';

@Module({
  imports: [
    // Global config module - Tüm modüllerden erişilebilir
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),

    // TypeORM veritabanı bağlantısı
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const cfg = env();
        
        return {
          type: 'postgres',
          host: cfg.db.host,
          port: cfg.db.port,
          username: cfg.db.user,
          password: cfg.db.pass,
          database: cfg.db.name,
          // Entity'leri otomatik yükle
          autoLoadEntities: true,
          // Şema senkronizasyonu KAPALI - Migration kullanılıyor
          synchronize: false,
          // SQL logları (development)
          logging: process.env.DB_LOGGING === 'true'
        };
      },
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    GamesModule,
    ProductsModule,
    OrdersModule,
    SeedingModule,
    UploadModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedingService: SeedingService) {}

  /**
   * Module başlatıldığında veritabanını seed et
   * Varsayılan rolleri ve diğer gerekli verileri oluştur
   */
  async onModuleInit() {
    await this.seedingService.seed();
  }
}
