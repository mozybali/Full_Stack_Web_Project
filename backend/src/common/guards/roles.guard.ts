import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Rol Tabanlı Erişim Kontrolü (RBAC) Guard
 * Endpoint'lere erişim için gerekli rolleri kontrol eder
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Handler ve class'tan gereken rolleri al
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Eğer rol gerekli değilse, erişime izin ver
    if (!requiredRoles) {
      return true;
    }

    // Request'ten kullanıcıyı al ve rollerini kontrol et
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      throw new ForbiddenException('Kullanıcı bilgileri bulunamadı');
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException(`Bu işlem için gerekli roller: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}

