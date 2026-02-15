import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAvatarDto) {
    return this.prisma.avatar.create({
      data: {
        ownerId: userId,
        name: dto.name,
        baseModelUrl: dto.baseModelUrl,
        thumbnailUrl: dto.thumbnailUrl,
        customization: dto.customization,
        equippedItems: dto.equippedItems || [],
        isActive: false,
      },
    });
  }

  async findUserAvatars(userId: string) {
    return this.prisma.avatar.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
      include: { owner: { select: { id: true, displayName: true } } },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${id} not found`);
    }

    return avatar;
  }

  async update(id: string, userId: string, dto: UpdateAvatarDto) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${id} not found`);
    }

    if (avatar.ownerId !== userId) {
      throw new ForbiddenException('You do not own this avatar');
    }

    return this.prisma.avatar.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.baseModelUrl && { baseModelUrl: dto.baseModelUrl }),
        ...(dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
        ...(dto.customization && { customization: dto.customization }),
        ...(dto.equippedItems && { equippedItems: dto.equippedItems }),
      },
    });
  }

  async setActive(id: string, userId: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${id} not found`);
    }

    if (avatar.ownerId !== userId) {
      throw new ForbiddenException('You do not own this avatar');
    }

    await this.prisma.$transaction([
      this.prisma.avatar.updateMany({
        where: { ownerId: userId, isActive: true },
        data: { isActive: false },
      }),
      this.prisma.avatar.update({
        where: { id },
        data: { isActive: true },
      }),
    ]);

    return this.prisma.avatar.findUnique({ where: { id } });
  }

  async delete(id: string, userId: string) {
    const avatar = await this.prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${id} not found`);
    }

    if (avatar.ownerId !== userId) {
      throw new ForbiddenException('You do not own this avatar');
    }

    await this.prisma.avatar.delete({
      where: { id },
    });

    return { message: 'Avatar deleted successfully' };
  }
}
