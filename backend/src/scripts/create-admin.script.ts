/**
 * Admin Kullanıcısı Oluşturma Script'i
 * 
 * Kullanım:
 * npm run create-admin -- --email admin@example.com --username admin --password password123
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

async function createAdminUser() {
  const logger = new Logger('CreateAdminScript');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);

    // Komut satırı argumentlerini al
    const args = process.argv.slice(2);
    
    // Parametreleri parse et
    const params = {
      email: '',
      username: '',
      password: '',
    };

    for (let i = 0; i < args.length; i += 2) {
      const key = args[i].replace('--', '');
      const value = args[i + 1];
      if (key in params) {
        params[key as keyof typeof params] = value;
      }
    }

    // Validasyon
    if (!params.email || !params.username || !params.password) {
      logger.error(
        'Eksik parametreler. Lütfen tüm parametreleri sağlayın:\n' +
        'npm run create-admin -- --email admin@example.com --username admin --password password123'
      );
      await app.close();
      process.exit(1);
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      logger.error('Geçerli bir email adresi girin');
      await app.close();
      process.exit(1);
    }

    // Şifre uzunluğu kontrolü
    if (params.password.length < 6) {
      logger.error('Şifre en az 6 karakter olmalıdır');
      await app.close();
      process.exit(1);
    }

    logger.log('Admin kullanıcısı oluşturuluyor...');
    logger.debug(`Email: ${params.email}`);
    logger.debug(`Username: ${params.username}`);

    const result = await authService.createAdmin({
      email: params.email,
      username: params.username,
      password: params.password,
    });

    logger.log('✓ Admin kullanıcısı başarıyla oluşturuldu!');
    logger.log(`ID: ${result.user.id}`);
    logger.log(`Email: ${result.user.email}`);
    logger.log(`Username: ${result.user.username}`);
    logger.log(`Roller: ${result.user.roles.join(', ')}`);
    logger.log(`\nAccess Token: ${result.accessToken.substring(0, 50)}...`);

    await app.close();
    process.exit(0);
  } catch (error: any) {
    const logger = new Logger('CreateAdminScript');
    
    if (error.message.includes('zaten kayıtlı')) {
      logger.error(`Hata: ${error.message}`);
    } else if (error.message.includes('zaten alınmış')) {
      logger.error(`Hata: ${error.message}`);
    } else if (error.message.includes('bulunamadı')) {
      logger.error(`Hata: ${error.message}`);
    } else {
      logger.error(`Hata oluştu: ${error.message}`);
    }

    process.exit(1);
  }
}

createAdminUser();
