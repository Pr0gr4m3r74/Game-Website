import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getGames = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    const where = status ? { status: status as any } : {};

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.game.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: games,
        total,
        page: pageNum,
        pageSize: limitNum,
        hasMore: skip + games.length < total,
      },
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get games',
    });
  }
};

export const createGame = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, maxPlayers = 4 } = req.body;

    const game = await prisma.game.create({
      data: {
        name,
        description,
        maxPlayers,
        currentPlayers: 1,
        status: 'WAITING',
        createdById: req.userId!,
        participants: {
          create: {
            userId: req.userId!,
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create game',
    });
  }
};

export const joinGame = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
      });
    }

    if (game.currentPlayers >= game.maxPlayers) {
      return res.status(400).json({
        success: false,
        error: 'Game is full',
      });
    }

    // Check if user already joined
    const existingParticipant = game.participants.find(
      (p: any) => p.userId === req.userId
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        error: 'Already joined this game',
      });
    }

    // Add participant and update player count
    await prisma.$transaction([
      prisma.gameParticipant.create({
        data: {
          userId: req.userId!,
          gameId: id,
        },
      }),
      prisma.game.update({
        where: { id },
        data: { currentPlayers: { increment: 1 } },
      }),
    ]);

    const updatedGame = await prisma.game.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedGame,
    });
  } catch (error) {
    console.error('Join game error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join game',
    });
  }
};
