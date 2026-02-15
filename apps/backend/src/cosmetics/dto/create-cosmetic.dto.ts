import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { CosmeticType } from '@prisma/client';

export class CreateCosmeticDto {
  @ApiProperty({ description: 'Cosmetic item name', example: 'Cool Sunglasses' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Item description', example: 'Stylish sunglasses for your avatar' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Cosmetic type', 
    enum: CosmeticType,
    example: CosmeticType.ACCESSORY 
  })
  @IsEnum(CosmeticType)
  @IsNotEmpty()
  type: CosmeticType;

  @ApiProperty({ description: 'S3 URL to GLB/GLTF asset', example: 'https://s3.amazonaws.com/cosmetics/sunglasses.glb' })
  @IsString()
  @IsNotEmpty()
  assetUrl: string;

  @ApiPropertyOptional({ description: 'S3 URL to preview thumbnail', example: 'https://s3.amazonaws.com/thumbnails/sunglasses.jpg' })
  @IsString()
  @IsOptional()
  previewThumbnail?: string;

  @ApiProperty({ 
    description: 'Metadata (tags, attachment points, physics hints)', 
    example: { tags: ['stylish', 'summer'], attachmentPoint: 'head' } 
  })
  @IsObject()
  @IsNotEmpty()
  metadata: Record<string, any>;
}
