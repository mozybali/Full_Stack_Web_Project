/**
 * Kullanıcı Giriş DTO (Data Transfer Object)
 * 
 * Kullanıcı oturum açma işlemi için gerekli verileri tanımlar ve doğrular.
 * 
 * Validasyon kuralları:
 * - Email: Geçerli email formatı
 * - Password: Boş olamaz
 */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Giriş formu için DTO
 */
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Kullanıcı email adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Kullanıcı şifresi',
  })
  @IsNotEmpty({ message: 'Şifre zorunludur' })
  password: string;
}
