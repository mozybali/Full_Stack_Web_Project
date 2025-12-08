import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleNames } from '../common/enums/role-names.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

// Kimlik doğrulama ile ilgili tüm endpoint'ler
@ApiTags('Kimlik Doğrulama')
@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Yeni kullanıcı kaydı
   * Email, kullanıcı adı ve şifre ile yeni hesap oluşturur
   */
  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı yap' })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla kaydedildi',
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz giriş veya kullanıcı zaten mevcut',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Kullanıcı oturum açması
   * Email ve şifre ile giriş yapıp JWT token alır
   */
  @Post('login')
  @ApiOperation({ summary: 'Oturum açma ve JWT token al' })
  @ApiResponse({
    status: 200,
    description: 'Giriş başarılı, JWT token döndürüldü',
  })
  @ApiResponse({
    status: 401,
    description: 'Geçersiz kimlik bilgileri',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /**
   * Admin profili oluştur
   * Email, kullanıcı adı ve şifre ile yeni admin hesabı oluşturur
   * Sadece mevcut admin kullanıcılar yeni admin oluşturabilir
   */
  @Post('admin/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Yeni admin profili oluştur (sadece admin için)' })
  @ApiResponse({
    status: 201,
    description: 'Admin profili başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz giriş veya email/username zaten mevcut',
  })
  @ApiResponse({
    status: 401,
    description: 'Kimlik doğrulama başarısız',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin rolü gerekli',
  })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }

  /**
   * Seller profili oluştur
   * Email, kullanıcı adı ve şifre ile yeni seller hesabı oluşturur
   * Sadece admin kullanıcılar yeni seller oluşturabilir
   */
  @Post('seller/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Yeni seller profili oluştur (sadece admin için)' })
  @ApiResponse({
    status: 201,
    description: 'Seller profili başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz giriş veya email/username zaten mevcut',
  })
  @ApiResponse({
    status: 401,
    description: 'Kimlik doğrulama başarısız',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin rolü gerekli',
  })
  createSeller(@Body() dto: CreateSellerDto) {
    return this.authService.createSeller(dto);
  }
}
