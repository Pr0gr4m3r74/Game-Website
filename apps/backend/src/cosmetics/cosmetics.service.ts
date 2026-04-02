import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCosmeticDto } from './dto/create-cosmetic.dto';
import { UpdateCosmeticDto } from './dto/update-cosmetic.dto';
import { CosmeticType } from '@prisma/client';
import * as Filter from 'bad-words';

@Injectable()
export class CosmeticsService {
  private filter = new Filter();

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCosmeticDto) {
    if (this.filter.isProfane(dto.name) || (dto.description && this.filter.isProfane(dto.description))) {
      throw new BadRequestException('Name or description contains inappropriate language');
    }

    return this.prisma.cosmeticItem.create({
      data: {
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        assetUrl: dto.assetUrl,
        previewThumbnail: dto.previewThumbnail,
        metadata: dto.metadata,
        priceBits: 0,
        isForSale: false,
        isApproved: false,
      },
    });
  }

  async findAll(filters?: {
    type?: CosmeticType;
    isForSale?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 30;
    const skip = (page - 1) * limit;

    const where: any = {
      isApproved: true,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.isForSale !== undefined) {
      where.isForSale = filters.isForSale;
    }

    const [items, total] = await Promise.all([
      this.prisma.cosmeticItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, displayName: true },
          },
        },
      }),
      this.prisma.cosmeticItem.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserCosmetics(userId: string) {
    return this.prisma.cosmeticItem.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, displayName: true },
        },
      },
    });

    if (!cosmetic) {
      throw new NotFoundException(`Cosmetic item with ID ${id} not found`);
    }

    return cosmetic;
  }

  async update(id: string, userId: string, dto: UpdateCosmeticDto) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({
      where: { id },
    });

    if (!cosmetic) {
      throw new NotFoundException(`Cosmetic item with ID ${id} not found`);
    }

    if (cosmetic.ownerId !== userId) {
      throw new ForbiddenException('You do not own this cosmetic item');
    }

    if (dto.name && this.filter.isProfane(dto.name)) {
      throw new BadRequestException('Name contains inappropriate language');
    }

    if (dto.description && this.filter.isProfane(dto.description)) {
      throw new BadRequestException('Description contains inappropriate language');
    }

    return this.prisma.cosmeticItem.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type && { type: dto.type }),
        ...(dto.assetUrl && { assetUrl: dto.assetUrl }),
        ...(dto.previewThumbnail !== undefined && { previewThumbnail: dto.previewThumbnail }),
        ...(dto.metadata && { metadata: dto.metadata }),
      },
    });
  }

  async listForSale(id: string, userId: string, priceBits: number) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({
      where: { id },
    });

    if (!cosmetic) {
      throw new NotFoundException(`Cosmetic item with ID ${id} not found`);
    }

    if (cosmetic.ownerId !== userId) {
      throw new ForbiddenException('You do not own this cosmetic item');
    }

    if (!cosmetic.isApproved) {
      throw new BadRequestException('Cosmetic item must be approved before listing for sale');
    }

    return this.prisma.cosmeticItem.update({
      where: { id },
      data: {
        isForSale: true,
        priceBits,
      },
    });
  }

  async unlist(id: string, userId: string) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({
      where: { id },
    });

    if (!cosmetic) {
      throw new NotFoundException(`Cosmetic item with ID ${id} not found`);
    }

    if (cosmetic.ownerId !== userId) {
      throw new ForbiddenException('You do not own this cosmetic item');
    }

    return this.prisma.cosmeticItem.update({
      where: { id },
      data: {
        isForSale: false,
      },
    });
  }

  async delete(id: string, userId: string) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({
      where: { id },
    });

    if (!cosmetic) {
      throw new NotFoundException(`Cosmetic item with ID ${id} not found`);
    }

    if (cosmetic.ownerId !== userId) {
      throw new ForbiddenException('You do not own this cosmetic item');
    }

    if (cosmetic.isForSale) {
      throw new BadRequestException('Cannot delete a cosmetic item that is listed for sale. Unlist it first.');
    }

    await this.prisma.cosmeticItem.delete({
      where: { id },
    });

    return { message: 'Cosmetic item deleted successfully' };
  }
}
