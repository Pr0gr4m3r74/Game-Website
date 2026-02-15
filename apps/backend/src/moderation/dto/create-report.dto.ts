import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportTarget } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty({ 
    enum: ReportTarget,
    description: 'Type of entity being reported' 
  })
  @IsEnum(ReportTarget)
  @IsNotEmpty()
  targetType: ReportTarget;

  @ApiProperty({ description: 'ID of the entity being reported' })
  @IsString()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({ description: 'Reason for the report' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Additional details about the report' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Optional user ID if reporting a user' })
  @IsString()
  @IsOptional()
  targetUserId?: string;
}
