import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Admin profili oluşturmak için DTO
 */
export class CreateAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Admin email adresi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'admin_user',
    description: 'Admin kullanıcı adı',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Admin şifresi (minimum 6 karakter)',
  })
  @MinLength(6)
  password: string;
}

