import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewReportDto {
  @ApiProperty({ description: 'Resolution notes from moderator' })
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @ApiProperty({ description: 'Action taken (e.g., "WARN", "BAN", "DELETE_CONTENT", "NO_ACTION")' })
  @IsString()
  @IsNotEmpty()
  action: string;
}
