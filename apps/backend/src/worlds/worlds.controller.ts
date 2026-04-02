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
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorldsService } from './worlds.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Visibility } from '@prisma/client';

@ApiTags('worlds')
@Controller('worlds')
export class WorldsController {
  constructor(private readonly worldsService: WorldsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new world' })
  @ApiResponse({ status: 201, description: 'World created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createWorldDto: CreateWorldDto) {
    return this.worldsService.create(req.user.id, createWorldDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all public worlds' })
  @ApiQuery({ name: 'visibility', enum: Visibility, required: false })
  @ApiQuery({ name: 'approved', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'List of worlds' })
  findAll(
    @Query('visibility') visibility?: Visibility,
    @Query('approved') approved?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const approvedBool = approved !== undefined ? approved === 'true' : undefined;
    return this.worldsService.findAll(visibility, approvedBool, page, limit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my worlds' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'List of user worlds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUserWorlds(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.worldsService.findUserWorlds(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific world' })
  @ApiResponse({ status: 200, description: 'World details' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'World not found' })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.worldsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a world' })
  @ApiResponse({ status: 200, description: 'World updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'World not found' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWorldDto: UpdateWorldDto,
  ) {
    return this.worldsService.update(id, req.user.id, updateWorldDto);
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update world visibility' })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'World not found' })
  updateVisibility(
    @Param('id') id: string,
    @Request() req,
    @Body('visibility') visibility: Visibility,
  ) {
    return this.worldsService.updateVisibility(id, req.user.id, visibility);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a world' })
  @ApiResponse({ status: 200, description: 'World deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'World not found' })
  delete(@Param('id') id: string, @Request() req) {
    return this.worldsService.delete(id, req.user.id);
  }
}
