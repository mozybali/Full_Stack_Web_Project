import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    example: 'hashedPassword123',
    description: 'Şifrelenmiş şifre',
  })
  @IsNotEmpty()
  passwordHash: string;
}
