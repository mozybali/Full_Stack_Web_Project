import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Kimlik Doğrulama Guard'ı
 * Endpoint'lere JWT token ile erişim kontrolü yapılır
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
