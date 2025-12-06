import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Seller profili oluşturmak için DTO
 */
export class CreateSellerDto {
  @ApiProperty({
    example: 'seller@example.com',
    description: 'Seller email adresi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'seller_user',
    description: 'Seller kullanıcı adı',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Seller şifresi (minimum 6 karakter)',
  })
  @MinLength(6)
  password: string;
}
