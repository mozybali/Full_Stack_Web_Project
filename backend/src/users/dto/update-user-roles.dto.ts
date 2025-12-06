import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Kullanıcı rollerini güncellemek için DTO
 */
export class UpdateUserRolesDto {
  @ApiProperty({
    example: [1, 2],
    description: 'Yer alması gereken rol ID\'leri',
    type: [Number],
  })
  @IsArray()
  @IsNotEmpty()
  roleIds: number[];
}
