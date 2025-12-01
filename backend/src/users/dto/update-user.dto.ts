import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Kullanıcı email adresi',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Kullanıcı adı',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'NewSecurePassword123',
    description: 'Yeni şifre (minimum 6 karakter)',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  @IsString()
  password?: string;
}
