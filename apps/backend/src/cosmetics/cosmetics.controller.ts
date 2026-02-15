import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CosmeticsService } from './cosmetics.service';
import { CreateCosmeticDto } from './dto/create-cosmetic.dto';
import { UpdateCosmeticDto } from './dto/update-cosmetic.dto';
import { ListCosmeticDto } from './dto/list-cosmetic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CosmeticType } from '@prisma/client';

@ApiTags('Cosmetics')
@Controller('cosmetics')
export class CosmeticsController {
  constructor(private readonly cosmeticsService: CosmeticsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cosmetic item' })
  @ApiResponse({ status: 201, description: 'Cosmetic created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (profanity detected)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCosmeticDto) {
    return this.cosmeticsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cosmetics (public with filters)' })
  @ApiQuery({ name: 'type', enum: CosmeticType, required: false })
  @ApiQuery({ name: 'isForSale', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Returns paginated cosmetics' })
  findAll(
    @Query('type') type?: CosmeticType,
    @Query('isForSale') isForSale?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.cosmeticsService.findAll({
      type,
      isForSale: isForSale === 'true' ? true : isForSale === 'false' ? false : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my cosmetic items' })
  @ApiResponse({ status: 200, description: 'Returns user cosmetics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyCosmetics(@CurrentUser('id') userId: string) {
    return this.cosmeticsService.findUserCosmetics(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cosmetic item by ID' })
  @ApiParam({ name: 'id', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 200, description: 'Returns cosmetic item' })
  @ApiResponse({ status: 404, description: 'Cosmetic not found' })
  getOne(@Param('id') id: string) {
    return this.cosmeticsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cosmetic item' })
  @ApiParam({ name: 'id', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 200, description: 'Cosmetic updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Cosmetic not found' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCosmeticDto,
  ) {
    return this.cosmeticsService.update(id, userId, dto);
  }

  @Patch(':id/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List cosmetic item for sale' })
  @ApiParam({ name: 'id', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 200, description: 'Cosmetic listed for sale' })
  @ApiResponse({ status: 400, description: 'Item not approved' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Cosmetic not found' })
  listForSale(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ListCosmeticDto,
  ) {
    return this.cosmeticsService.listForSale(id, userId, dto.priceBits);
  }

  @Patch(':id/unlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlist cosmetic item from sale' })
  @ApiParam({ name: 'id', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 200, description: 'Cosmetic unlisted' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Cosmetic not found' })
  unlist(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cosmeticsService.unlist(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete cosmetic item' })
  @ApiParam({ name: 'id', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 200, description: 'Cosmetic deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete listed item' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Cosmetic not found' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cosmeticsService.delete(id, userId);
  }
}
