import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { Visibility } from '@prisma/client';
import * as Filter from 'bad-words';

@Injectable()
export class WorldsService {
  private filter = new Filter();

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorldDto) {
    if (this.filter.isProfane(dto.name) || (dto.description && this.filter.isProfane(dto.description))) {
      throw new BadRequestException('Name or description contains inappropriate language');
    }

    return this.prisma.world.create({
      data: {
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        sceneJSON: dto.sceneJSON,
        thumbnailUrl: dto.thumbnailUrl,
        visibility: dto.visibility || Visibility.PRIVATE,
        isApproved: false,
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findAll(visibility?: Visibility, approved?: boolean, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (visibility) {
      where.visibility = visibility;
    }
    if (approved !== undefined) {
      where.isApproved = approved;
    }

    const [worlds, total] = await Promise.all([
      this.prisma.world.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      }),
      this.prisma.world.count({ where }),
    ]);

    return {
      worlds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserWorlds(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [worlds, total] = await Promise.all([
      this.prisma.world.findMany({
        where: { ownerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      }),
      this.prisma.world.count({ where: { ownerId: userId } }),
    ]);

    return {
      worlds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const world = await this.prisma.world.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    if (!world) {
      throw new NotFoundException('World not found');
    }

    // Check visibility permissions
    if (world.visibility === Visibility.PRIVATE && world.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this world');
    }

    if (world.visibility === Visibility.PUBLIC && !world.isApproved && world.ownerId !== userId) {
      throw new ForbiddenException('This world is pending approval');
    }

    return world;
  }

  async update(id: string, userId: string, dto: UpdateWorldDto) {
    const world = await this.prisma.world.findUnique({ where: { id } });

    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (world.ownerId !== userId) {
      throw new ForbiddenException('You do not own this world');
    }

    if (dto.name && this.filter.isProfane(dto.name)) {
      throw new BadRequestException('Name contains inappropriate language');
    }

    if (dto.description && this.filter.isProfane(dto.description)) {
      throw new BadRequestException('Description contains inappropriate language');
    }

    return this.prisma.world.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  }

  async updateVisibility(id: string, userId: string, visibility: Visibility) {
    const world = await this.prisma.world.findUnique({ where: { id } });

    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (world.ownerId !== userId) {
      throw new ForbiddenException('You do not own this world');
    }

    return this.prisma.world.update({
      where: { id },
      data: { visibility },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const world = await this.prisma.world.findUnique({ where: { id } });

    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (world.ownerId !== userId) {
      throw new ForbiddenException('You do not own this world');
    }

    await this.prisma.world.delete({ where: { id } });

    return { message: 'World deleted successfully' };
  }
}
