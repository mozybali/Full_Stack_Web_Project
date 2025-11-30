import { IsEmail, IsString, IsOptional } from 'class-validator';
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
}
