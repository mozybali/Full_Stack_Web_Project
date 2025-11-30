import { SetMetadata } from '@nestjs/common';

/**
 * Rol Decorator'u
 * Endpoint'lerin hangi rollere ihtiyaç duyduğunu belirtmek için kullanılır
 * @example @Roles('ADMIN', 'SELLER')
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
