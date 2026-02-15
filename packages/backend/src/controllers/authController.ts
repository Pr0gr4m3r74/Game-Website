import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        displayName: displayName || username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        level: true,
        experience: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get friend count
    const friendCount = await prisma.friend.count({
      where: {
        userId: user.id,
        status: 'ACCEPTED',
      },
    });

    // Get games played count
    const gamesPlayed = await prisma.gameParticipant.count({
      where: { userId: user.id },
    });

    // Get achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: {
        achievement: true,
      },
    });

    res.json({
      success: true,
      data: {
        ...user,
        friendCount,
        gamesPlayed,
        achievements: achievements.map((ua) => ({
          ...ua.achievement,
          unlockedAt: ua.unlockedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
    });
  }
};
