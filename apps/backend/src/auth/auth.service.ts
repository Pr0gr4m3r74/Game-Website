import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Profile } from 'passport-google-oauth20';
import { AUTH_CONSTANTS } from './auth.constants';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private jwtSecret: string;
  private jwtRefreshSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    // Validate required secrets on startup
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be set and at least 32 characters long');
    }

    if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
      throw new Error('JWT_REFRESH_SECRET must be set and at least 32 characters long');
    }

    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;

    this.logger.log('AuthService initialized with valid secrets');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // OAuth users don't have a password - reject password login attempts
    if (!user.passwordHash) {
      throw new BadRequestException(
        'This account uses OAuth authentication. Please sign in with Google.',
      );
    }

    if (user.isBanned) {
      throw new UnauthorizedException('This account has been banned');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any): Promise<TokenResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
      secret: this.jwtRefreshSecret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        locale: dto.locale || 'de',
        isVerified: false,
      },
    });

    // TODO: Send verification email
    // NOTE: Currently users can login without email verification
    // This should be enforced before production deployment
    this.logger.log(`New user registered: ${user.email} (ID: ${user.id})`);
    this.logger.warn(`Email verification not yet implemented for user: ${user.id}`);

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async validateGoogleUser(profile: Profile): Promise<any> {
    const { id: googleId, emails, displayName } = profile;

    if (!emails || emails.length === 0) {
      throw new BadRequestException('No email found in Google profile');
    }

    const email = emails[0].value;

    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        if (user.googleId) {
          throw new ConflictException('Email already registered with different Google account');
        }

        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      } else {
        // Create new user via OAuth
        // passwordHash is explicitly null for OAuth-only accounts
        // These users cannot use password-based login (enforced in validateUser)
        user = await this.prisma.user.create({
          data: {
            email,
            googleId,
            displayName: displayName || email.split('@')[0],
            locale: 'de',
            isVerified: true, // OAuth emails are pre-verified by Google
            passwordHash: null,
          },
        });

        this.logger.log(`New user registered via Google: ${user.email} (ID: ${user.id})`);
      }
    }

    if (user.isBanned) {
      throw new UnauthorizedException('This account has been banned');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtRefreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.isBanned) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
        secret: this.jwtRefreshSecret,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
