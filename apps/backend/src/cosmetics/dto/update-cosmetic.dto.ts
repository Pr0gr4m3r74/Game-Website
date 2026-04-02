import { PartialType } from '@nestjs/swagger';
import { CreateCosmeticDto } from './create-cosmetic.dto';

export class UpdateCosmeticDto extends PartialType(CreateCosmeticDto) {}
