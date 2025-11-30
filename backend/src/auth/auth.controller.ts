import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Kimlik doğrulama ile ilgili tüm endpoint'ler
@ApiTags('Kimlik Doğrulama')
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
}
