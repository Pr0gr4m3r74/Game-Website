import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async buyCosmetic(buyerId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.cosmeticItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundException('Cosmetic item not found');
      }

      if (!item.isForSale) {
        throw new BadRequestException('This item is not for sale');
      }

      if (item.ownerId === buyerId) {
        throw new BadRequestException('You cannot buy your own item');
      }

      if (!item.isApproved) {
        throw new BadRequestException('This item is not approved for sale');
      }

      const buyerBalance = await tx.bitsBalance.findUnique({
        where: { userId: buyerId },
      });

      if (!buyerBalance || buyerBalance.balance < item.priceBits) {
        throw new BadRequestException('Insufficient Bits balance');
      }

      const platformFee = Math.floor(item.priceBits * 0.1);
      const sellerAmount = item.priceBits - platformFee;

      await tx.bitsBalance.update({
        where: { userId: buyerId },
        data: { balance: { decrement: item.priceBits } },
      });

      const sellerBalance = await tx.bitsBalance.findUnique({
        where: { userId: item.ownerId },
      });

      if (!sellerBalance) {
        await tx.bitsBalance.create({
          data: {
            userId: item.ownerId,
            balance: sellerAmount,
          },
        });
      } else {
        await tx.bitsBalance.update({
          where: { userId: item.ownerId },
          data: { balance: { increment: sellerAmount } },
        });
      }

      await tx.cosmeticItem.update({
        where: { id: itemId },
        data: {
          ownerId: buyerId,
          isForSale: false,
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          fromUserId: buyerId,
          toUserId: item.ownerId,
          amountBits: item.priceBits,
          itemId: itemId,
          type: TransactionType.PURCHASE,
          platformFee: platformFee,
          status: 'COMPLETED',
        },
      });

      return {
        message: 'Purchase successful',
        transaction,
        item: await tx.cosmeticItem.findUnique({ where: { id: itemId } }),
      };
    });
  }

  async giftCosmetic(senderId: string, receiverId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.cosmeticItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundException('Cosmetic item not found');
      }

      if (item.ownerId !== senderId) {
        throw new ForbiddenException('You do not own this item');
      }

      if (item.isForSale) {
        throw new BadRequestException('Cannot gift an item that is listed for sale. Unlist it first.');
      }

      const receiver = await tx.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        throw new NotFoundException('Receiver user not found');
      }

      if (senderId === receiverId) {
        throw new BadRequestException('You cannot gift an item to yourself');
      }

      await tx.cosmeticItem.update({
        where: { id: itemId },
        data: {
          ownerId: receiverId,
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          fromUserId: senderId,
          toUserId: receiverId,
          amountBits: 0,
          itemId: itemId,
          type: TransactionType.GIFT,
          status: 'COMPLETED',
        },
      });

      return {
        message: 'Gift sent successfully',
        transaction,
        item: await tx.cosmeticItem.findUnique({ where: { id: itemId } }),
      };
    });
  }

  async getBalance(userId: string) {
    let balance = await this.prisma.bitsBalance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await this.prisma.bitsBalance.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    return balance;
  }

  async addBits(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let balance = await tx.bitsBalance.findUnique({
        where: { userId },
      });

      if (!balance) {
        balance = await tx.bitsBalance.create({
          data: {
            userId,
            balance: amount,
          },
        });
      } else {
        balance = await tx.bitsBalance.update({
          where: { userId },
          data: { balance: { increment: amount } },
        });
      }

      await tx.transaction.create({
        data: {
          fromUserId: null,
          toUserId: userId,
          amountBits: amount,
          type: TransactionType.PLATFORM_REWARD,
          status: 'COMPLETED',
        },
      });

      return balance;
    });
  }
}
