import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class ListCosmeticDto {
  @ApiProperty({ description: 'Price in Bits', example: 100, minimum: 1 })
  @IsInt()
  @IsPositive()
  priceBits: number;
}
