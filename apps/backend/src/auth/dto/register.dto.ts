import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'User password (min 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User display name' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName: string;

  @ApiPropertyOptional({ example: 'de', description: 'User locale (de or en)', default: 'de' })
  @IsOptional()
  @IsString()
  @Matches(/^(de|en)$/, { message: 'Locale must be either "de" or "en"' })
  locale?: string;
}
