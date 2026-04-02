import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';

export class CreateWorldDto {
  @ApiProperty({ description: 'Name of the world' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the world' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Scene JSON data containing prefabs, transforms, etc.' })
  @IsObject()
  @IsNotEmpty()
  sceneJSON: any;

  @ApiPropertyOptional({ description: 'Thumbnail URL for the world' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ 
    enum: Visibility, 
    default: Visibility.PRIVATE,
    description: 'Visibility setting for the world' 
  })
  @IsEnum(Visibility)
  @IsOptional()
  visibility?: Visibility;
}
