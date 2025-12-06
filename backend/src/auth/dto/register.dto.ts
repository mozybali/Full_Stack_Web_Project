import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Kullanıcı email adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Kullanıcı adı (3-20 karakter, alfanumerik ve alt çizgi)',
  })
  @IsNotEmpty({ message: 'Kullanıcı adı zorunludur' })
  @MinLength(3, { message: 'Kullanıcı adı minimum 3 karakter olmalıdır' })
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, { message: 'Kullanıcı adı sadece harfler, sayılar ve alt çizgi içerebilir' })
  username: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Şifre (minimum 8 karakter: büyük harf, küçük harf, sayı, özel karakter)',
  })
  @MinLength(8, { message: 'Şifre minimum 8 karakter olmalıdır' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Şifre büyük harf, küçük harf, sayı ve özel karakter (@$!%*?&) içermeli' }
  )
  password: string;
}
