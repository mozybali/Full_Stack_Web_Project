import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Kullanıcı email adresi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Kullanıcı adı',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Şifre (minimum 6 karakter)',
  })
  @MinLength(6)
  password: string;
}
