import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

export class CreateAvatarDto {
  @ApiProperty({ description: 'Avatar name', example: 'My Cool Avatar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'S3 URL to base GLB/GLTF model', example: 'https://s3.amazonaws.com/models/base-avatar.glb' })
  @IsString()
  @IsNotEmpty()
  baseModelUrl: string;

  @ApiPropertyOptional({ description: 'S3 URL to thumbnail image', example: 'https://s3.amazonaws.com/thumbnails/avatar.jpg' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Customization JSON (colors, morphs, scale)', example: { hairColor: '#FF5733', skinTone: '#FDB99B' } })
  @IsObject()
  @IsNotEmpty()
  customization: Record<string, any>;

  @ApiPropertyOptional({ description: 'Array of equipped cosmetic item IDs', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  equippedItems?: string[];
}
