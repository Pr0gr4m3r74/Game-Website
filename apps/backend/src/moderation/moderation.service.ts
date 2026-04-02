import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReviewReportDto } from './dto/review-report.dto';
import { ReportStatus, ReportTarget } from '@prisma/client';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(reporterId: string, dto: CreateReportDto) {
    // Validate target exists based on type
    const target = await this.validateTarget(dto.targetType, dto.targetId);
    if (!target) {
      throw new BadRequestException('Target entity not found');
    }

    return this.prisma.report.create({
      data: {
        reporterId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        targetUserId: dto.targetUserId,
        reason: dto.reason,
        description: dto.description,
        status: ReportStatus.PENDING,
      },
      include: {
        reporter: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });
  }

  async getReports(status?: ReportStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          targetUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReport(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            displayName: true,
            email: true,
            isBanned: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async reviewReport(id: string, adminId: string, dto: ReviewReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === ReportStatus.RESOLVED) {
      throw new BadRequestException('Report already resolved');
    }

    // Update report
    const updatedReport = await this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.RESOLVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        resolution: dto.resolution,
      },
      include: {
        reporter: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'REVIEW_REPORT',
        targetType: 'REPORT',
        targetId: id,
        details: {
          reportId: id,
          reportTargetType: report.targetType,
          reportTargetId: report.targetId,
          action: dto.action,
          resolution: dto.resolution,
        },
      },
    });

    return updatedReport;
  }

  async approveCosmeticModeration(id: string, adminId: string) {
    const cosmetic = await this.prisma.cosmeticItem.findUnique({ where: { id } });

    if (!cosmetic) {
      throw new NotFoundException('Cosmetic item not found');
    }

    if (cosmetic.isApproved) {
      throw new BadRequestException('Cosmetic is already approved');
    }

    const updatedCosmetic = await this.prisma.cosmeticItem.update({
      where: { id },
      data: { isApproved: true },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'APPROVE_COSMETIC',
        targetType: 'COSMETIC',
        targetId: id,
        details: {
          cosmeticId: id,
          cosmeticName: cosmetic.name,
          ownerId: cosmetic.ownerId,
        },
      },
    });

    return updatedCosmetic;
  }

  async banUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isBanned) {
      throw new BadRequestException('User is already banned');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'BAN_USER',
        targetType: 'USER',
        targetId: userId,
        details: {
          userId,
          reason,
          userEmail: user.email,
          displayName: user.displayName,
        },
      },
    });

    return updatedUser;
  }

  async unbanUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isBanned) {
      throw new BadRequestException('User is not banned');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'UNBAN_USER',
        targetType: 'USER',
        targetId: userId,
        details: {
          userId,
          userEmail: user.email,
          displayName: user.displayName,
        },
      },
    });

    return updatedUser;
  }

  private async validateTarget(targetType: ReportTarget, targetId: string): Promise<boolean> {
    switch (targetType) {
      case ReportTarget.USER:
        const user = await this.prisma.user.findUnique({ where: { id: targetId } });
        return !!user;
      case ReportTarget.COSMETIC:
        const cosmetic = await this.prisma.cosmeticItem.findUnique({ where: { id: targetId } });
        return !!cosmetic;
      case ReportTarget.WORLD:
        const world = await this.prisma.world.findUnique({ where: { id: targetId } });
        return !!world;
      case ReportTarget.AVATAR:
        const avatar = await this.prisma.avatar.findUnique({ where: { id: targetId } });
        return !!avatar;
      default:
        return false;
    }
  }
}
