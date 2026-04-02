import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class GiftCosmeticDto {
  @ApiProperty({ description: 'Receiver user ID', example: 'uuid-receiver' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @ApiProperty({ description: 'Cosmetic item ID to gift', example: 'uuid-cosmetic-item' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  itemId: string;
}
