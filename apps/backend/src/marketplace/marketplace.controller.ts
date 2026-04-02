import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { GiftCosmeticDto } from './dto/gift-cosmetic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Marketplace')
@ApiBearerAuth()
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('buy/:itemId')
  @ApiOperation({ summary: 'Buy a cosmetic item from marketplace' })
  @ApiParam({ name: 'itemId', description: 'Cosmetic item ID' })
  @ApiResponse({ status: 201, description: 'Purchase successful' })
  @ApiResponse({ status: 400, description: 'Insufficient funds or item not for sale' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  buyCosmetic(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.marketplaceService.buyCosmetic(userId, itemId);
  }

  @Post('gift')
  @ApiOperation({ summary: 'Gift a cosmetic item to another user' })
  @ApiResponse({ status: 201, description: 'Gift sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid gift request' })
  @ApiResponse({ status: 403, description: 'You do not own this item' })
  @ApiResponse({ status: 404, description: 'Item or receiver not found' })
  giftCosmetic(
    @CurrentUser('id') userId: string,
    @Body() dto: GiftCosmeticDto,
  ) {
    return this.marketplaceService.giftCosmetic(userId, dto.receiverId, dto.itemId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get my Bits balance' })
  @ApiResponse({ status: 200, description: 'Returns user Bits balance' })
  getBalance(@CurrentUser('id') userId: string) {
    return this.marketplaceService.getBalance(userId);
  }

  @Post('admin/add-bits')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Add Bits to a user account (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'uuid-user-id' },
        amount: { type: 'number', example: 1000, minimum: 1 },
      },
      required: ['userId', 'amount'],
    },
  })
  @ApiResponse({ status: 201, description: 'Bits added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid amount' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  addBits(@Body() body: { userId: string; amount: number }) {
    return this.marketplaceService.addBits(body.userId, body.amount);
  }
}
