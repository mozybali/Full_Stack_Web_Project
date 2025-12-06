import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
