import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

/**
 * Kimlik doğrulama servisi
 * Kullanıcı kaydı, giriş ve JWT token oluşturma işlemlerini yönetir
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Yeni kullanıcı kaydı
   * @param dto - Email, kullanıcı adı ve şifre bilgileri
   * @returns JWT token ve kullanıcı bilgileri
   * @throws ConflictException - Email veya username zaten mevcut
   */
  async register(dto: RegisterDto) {
    // Transaction ile kullanıcı kaydı yap - race condition önle
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Email ve username benzersizlik kontrolü
      const existingEmail = await this.usersService.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException('Bu email adresi zaten kayıtlı');
      }

      const existingUsername = await this.usersService.findByUsername(dto.username);
      if (existingUsername) {
        throw new ConflictException('Bu kullanıcı adı zaten alınmış');
      }

      // Şifreyi 10 salt ile hash'le
      const passwordHash = await bcrypt.hash(dto.password, 10);
      
      // Varsayılan BUYER rolü ile kullanıcı oluştur
      const user = await this.usersService.createWithDefaultRole({
        email: dto.email,
        username: dto.username,
        passwordHash,
      });

      await queryRunner.commitTransaction();
      return this.buildToken(user);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Kullanıcı doğrulama
   * @param email - Kullanıcı email'i
   * @param password - Kullanıcı şifresi
   * @returns Doğrulanmış kullanıcı nesnesi
   * @throws UnauthorizedException - Geçersiz kimlik bilgileri
   */
  async validateUser(email: string, password: string) {
    // Email'e göre kullanıcıyı bul
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    // Şifre ile hash'i karşılaştır
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    return user;
  }

  /**
   * Oturum açma
   * @param email - Kullanıcı email'i
   * @param password - Kullanıcı şifresi
   * @returns JWT token ve kullanıcı bilgileri
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.buildToken(user);
  }

  /**
   * JWT token oluştur
   * @param user - Kullanıcı nesnesi
   * @returns JWT token ve kullanıcı bilgileri
   */
  private buildToken(user: any) {
    // JWT payload'ı (kullanıcı ID'si ve rolleri)
    const payload = { sub: user.id, roles: user.roles.map((r) => r.name) };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles.map((r) => r.name),
      },
    };
  }
}
