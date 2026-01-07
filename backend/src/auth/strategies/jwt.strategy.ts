import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload, RequestUser } from '../interfaces/jwt-payload.interface';

/**
 * JWT Doğrulama Stratejisi
 * Bearer token'dan JWT'yi çıkarır ve doğrular
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret') || 'fallback-secret',
    });
  }

  /**
   * JWT Payload'ını doğrula ve kullanıcıyı veritabanından kontrol et
   * @param payload - JWT Payload'ı
   * @returns Doğrulanan kullanıcı nesnesi (sub ve roles ile)
   * @throws UnauthorizedException - Kullanıcı bulunamazsa
   */
  async validate(payload: JwtPayload): Promise<RequestUser> {
    // Kullanıcıyı veritabanından sorgula - silinmiş veya pasif kullanıcıları engelle
    const user = await this.usersService.findOne(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya hesap pasif');
    }

    // Payload'dan kullanıcı ID'sini ve rollerini çıkar
    // Bu veriler request.user'a atanacak ve RolesGuard tarafından kullanılacak
    return {
      sub: payload.sub,
      roles: payload.roles || [],
    };
  }
}

