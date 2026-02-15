/**
 * Example Usage of the Authentication Module
 * 
 * This file demonstrates how to use the authentication module
 * in different scenarios across your NestJS application.
 */

import { Controller, Get, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';

// ============================================================================
// Example 1: Basic Protected Route
// ============================================================================
@ApiTags('Examples')
@Controller('examples')
export class ExampleController {
  
  // Public endpoint - no authentication required
  @Get('public')
  @ApiOperation({ summary: 'Public endpoint accessible to everyone' })
  getPublicData() {
    return { message: 'This is public data' };
  }

  // Protected endpoint - requires authentication
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected endpoint requiring authentication' })
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: 'This is protected data',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Admin only endpoint
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin only endpoint' })
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'This is admin data',
      adminUser: user,
    };
  }

  // Multiple roles allowed
  @Get('moderator')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint for admins and moderators' })
  getModeratorData() {
    return { message: 'Admin or Moderator access' };
  }
}

// ============================================================================
// Example 2: Using Current User Decorator with specific fields
// ============================================================================
@ApiTags('User Posts')
@Controller('posts')
export class PostsController {
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  createPost(
    @CurrentUser('id') userId: string,  // Extract only the ID
    @Body() createPostDto: any,
  ) {
    return {
      message: 'Post created',
      authorId: userId,
      post: createPostDto,
    };
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user posts' })
  getMyPosts(@CurrentUser('id') userId: string) {
    return {
      message: 'Fetching posts for user',
      userId,
    };
  }
}

// ============================================================================
// Example 3: Role-based resource access
// ============================================================================
@ApiTags('Content Moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)  // Apply guards to entire controller
@ApiBearerAuth()
export class ModerationController {
  
  // Only moderators and admins can access
  @Get('reports')
  @Roles('MODERATOR', 'ADMIN')
  @ApiOperation({ summary: 'View reported content' })
  getReports(@CurrentUser() moderator: any) {
    return {
      message: 'Fetching reports',
      moderatorId: moderator.id,
    };
  }

  // Only admins can ban users
  @Post('ban/:userId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Ban a user (admin only)' })
  banUser(
    @CurrentUser() admin: any,
    @Body() banDto: any,
  ) {
    return {
      message: 'User banned',
      bannedBy: admin.id,
      reason: banDto.reason,
    };
  }
}

// ============================================================================
// Example 4: Optional Authentication (user data if logged in, else null)
// ============================================================================
@ApiTags('Content')
@Controller('content')
export class ContentController {
  
  // This endpoint works for both authenticated and non-authenticated users
  // If authenticated, user data is available
  @Get('feed')
  @ApiOperation({ summary: 'Get content feed (optional auth)' })
  getFeed(@CurrentUser() user?: any) {
    if (user) {
      return {
        message: 'Personalized feed',
        userId: user.id,
        content: ['item1', 'item2', 'item3'],
      };
    }
    
    return {
      message: 'Public feed',
      content: ['public1', 'public2'],
    };
  }
}

// ============================================================================
// Example 5: Using in Service Layer
// ============================================================================
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        locale: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: data.displayName,
        locale: data.locale,
      },
    });
  }
}

// ============================================================================
// Example 6: Frontend Integration Examples
// ============================================================================

/**
 * Frontend Integration Examples (TypeScript/JavaScript)
 */

// Register a new user
async function register() {
  const response = await fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePass123!',
      displayName: 'John Doe',
      locale: 'de',
    }),
  });
  
  const data = await response.json();
  console.log(data);
}

// Login
async function login() {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePass123!',
    }),
  });
  
  const data = await response.json();
  // Cookies are automatically set by the browser
  console.log(data);
  
  // Optionally store tokens in localStorage/sessionStorage
  // localStorage.setItem('accessToken', data.accessToken);
}

// Make authenticated request
async function getProfile() {
  const response = await fetch('http://localhost:3001/auth/profile', {
    method: 'GET',
    headers: {
      // Option 1: Use cookies (recommended)
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies
    
    // Option 2: Or use Bearer token from localStorage
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    // },
  });
  
  const data = await response.json();
  console.log(data);
}

// Refresh token
async function refreshAccessToken() {
  const response = await fetch('http://localhost:3001/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Send refresh_token cookie
  });
  
  const data = await response.json();
  console.log('New access token:', data.accessToken);
}

// Logout
async function logout() {
  const response = await fetch('http://localhost:3001/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  
  const data = await response.json();
  // Clear local storage if using
  // localStorage.removeItem('accessToken');
  console.log(data.message);
}

// ============================================================================
// Example 7: Testing with Jest
// ============================================================================

/**
 * Unit test example for AuthService
 */
describe('AuthService', () => {
  let authService: any;
  let prismaService: any;
  let jwtService: any;

  beforeEach(() => {
    // Setup test dependencies
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'Test1234!';
      
      const mockUser = {
        id: '1',
        email,
        passwordHash: 'hashed_password',
        displayName: 'Test User',
        role: 'USER',
      };
      
      // Mock implementations
      // ... test logic
    });

    it('should return null if password is invalid', async () => {
      // ... test logic
    });
  });
});

/**
 * E2E test example
 */
describe('Auth E2E', () => {
  it('should register a new user', async () => {
    // ... test logic
  });

  it('should login with valid credentials', async () => {
    // ... test logic
  });

  it('should reject invalid credentials', async () => {
    // ... test logic
  });
});

// ============================================================================
// Example 8: Custom Guard Combination
// ============================================================================

/**
 * Example of creating a custom guard that combines JWT + custom logic
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard
    const resourceId = request.params.id;

    // Check if user owns the resource
    const resource = await this.prisma.avatar.findUnique({
      where: { id: resourceId },
      select: { ownerId: true },
    });

    if (!resource) {
      return false;
    }

    // Allow if owner or admin
    return resource.ownerId === user.id || user.role === 'ADMIN';
  }
}

// Usage example in controller:
// @Delete('avatars/:id')
// @UseGuards(JwtAuthGuard, OwnershipGuard)
// @ApiBearerAuth()
// deleteAvatar() {
//   return { message: 'Avatar deleted' };
// }
