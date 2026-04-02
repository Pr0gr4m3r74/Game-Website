import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_CONSTANTS, getCookieOptions } from './auth.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'Registration successful. Please verify your email.',
      warning: 'Email verification is not yet enforced. This must be implemented before production.',
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authService.login(user);

    response.cookie(
      AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      getCookieOptions(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_MAX_AGE),
    );

    response.cookie(
      AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      getCookieOptions(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE),
    );

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear authentication cookies' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE);
    response.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE);

    return {
      message: 'Logout successful',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    return {
      user,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiResponse({ status: 401, description: 'Google authentication failed' })
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user;
    const tokens = await this.authService.login(user);

    response.cookie(
      AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      getCookieOptions(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_MAX_AGE),
    );

    response.cookie(
      AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      getCookieOptions(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE),
    );

    return {
      message: 'Google authentication successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    response.cookie(
      AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      getCookieOptions(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_MAX_AGE),
    );

    response.cookie(
      AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      getCookieOptions(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE),
    );

    return {
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
