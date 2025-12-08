import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

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
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
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
  private buildToken(user: User): { access_token: string; user: Partial<User> } {
    // JWT payload'ı (kullanıcı ID'si ve rolleri)
    const payload: JwtPayload = { 
      sub: user.id, 
      roles: user.roles.map((r) => r.name) 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  /**
   * Admin profili oluştur
   * Email, username ve şifre ile yeni admin kullanıcısı oluşturur
   * @param dto - Email, kullanıcı adı ve şifre bilgileri
   * @returns JWT token ve admin kullanıcı bilgileri
   * @throws ConflictException - Email veya username zaten mevcut
   */
  async createAdmin(dto: CreateAdminDto) {
    // Transaction ile admin oluştur
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
      
      // ADMIN rolünü bul
      const adminRole = await this.rolesRepo.findOne({ where: { name: 'ADMIN' } });
      if (!adminRole) {
        throw new ConflictException('ADMIN rolü veritabanında bulunamadı');
      }

      // Admin kullanıcısını ADMIN rolü ile oluştur
      const user = await queryRunner.manager.create(User, {
        email: dto.email,
        username: dto.username,
        passwordHash,
        roles: [adminRole],
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      
      // Oluşturulan admin'i yeniden yükle (roles eager loading için)
      const createdAdmin = await this.usersService.findOne(user.id);
      if (!createdAdmin) {
        throw new ConflictException('Admin profili oluşturulduktan sonra yeniden yüklenemedi');
      }
      return this.buildToken(createdAdmin);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seller profili oluştur
   * Email, username ve şifre ile yeni seller kullanıcısı oluşturur
   * @param dto - Email, kullanıcı adı ve şifre bilgileri
   * @returns JWT token ve seller kullanıcı bilgileri
   * @throws ConflictException - Email veya username zaten mevcut
   */
  async createSeller(dto: CreateSellerDto) {
    // Transaction ile seller oluştur
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
      
      // SELLER rolünü bul
      const sellerRole = await this.rolesRepo.findOne({ where: { name: 'SELLER' } });
      if (!sellerRole) {
        throw new ConflictException('SELLER rolü veritabanında bulunamadı');
      }

      // Seller kullanıcısını SELLER rolü ile oluştur
      const user = await queryRunner.manager.create(User, {
        email: dto.email,
        username: dto.username,
        passwordHash,
        roles: [sellerRole],
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      
      // Oluşturulan seller'ı yeniden yükle (roles eager loading için)
      const createdSeller = await this.usersService.findOne(user.id);
      if (!createdSeller) {
        throw new ConflictException('Seller profili oluşturulduktan sonra yeniden yüklenemedi');
      }
      return this.buildToken(createdSeller);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
