import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Doğrulama Stratejisi
 * Bearer token'dan JWT'yi çıkarır ve doğrular
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  /**
   * JWT Payload'ını doğrula
   * @param payload - JWT Payload'ı
   * @returns Doğrulanan kullanıcı nesnesi (sub ve roles ile)
   */
  async validate(payload: any) {
    // Payload'dan kullanıcı ID'sini ve rollerini çıkar
    // Bu veriler request.user'a atanacak ve RolesGuard tarafından kullanılacak
    return {
      sub: payload.sub,
      roles: payload.roles || [],
    };
  }
}

