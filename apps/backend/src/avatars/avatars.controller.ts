import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
} from '@nestjs/swagger';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Avatars')
@ApiBearerAuth()
@Controller('avatars')
@UseGuards(JwtAuthGuard)
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new avatar' })
  @ApiResponse({ status: 201, description: 'Avatar created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAvatarDto) {
    return this.avatarsService.create(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all my avatars' })
  @ApiResponse({ status: 200, description: 'Returns user avatars' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyAvatars(@CurrentUser('id') userId: string) {
    return this.avatarsService.findUserAvatars(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get avatar by ID' })
  @ApiParam({ name: 'id', description: 'Avatar ID' })
  @ApiResponse({ status: 200, description: 'Returns avatar' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  getOne(@Param('id') id: string) {
    return this.avatarsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update avatar' })
  @ApiParam({ name: 'id', description: 'Avatar ID' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAvatarDto,
  ) {
    return this.avatarsService.update(id, userId, dto);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Set avatar as active' })
  @ApiParam({ name: 'id', description: 'Avatar ID' })
  @ApiResponse({ status: 200, description: 'Avatar set as active' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  setActive(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.avatarsService.setActive(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete avatar' })
  @ApiParam({ name: 'id', description: 'Avatar ID' })
  @ApiResponse({ status: 200, description: 'Avatar deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.avatarsService.delete(id, userId);
  }
}
