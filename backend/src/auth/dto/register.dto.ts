import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;
}
