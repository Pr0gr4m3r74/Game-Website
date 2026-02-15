# Authentication Module

Complete authentication system for the 3D Avatar Social Platform backend.

## Features

- **Local Authentication**: Email/password authentication with bcrypt hashing
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Google OAuth**: Social login integration
- **Role-Based Access Control**: ADMIN, MODERATOR, CREATOR, USER roles
- **Security Best Practices**: 
  - HttpOnly cookies for tokens
  - Password strength validation
  - Rate limiting ready
  - CSRF protection via SameSite cookies

## Structure

```
auth/
├── auth.module.ts          # Main module with dependencies
├── auth.service.ts         # Business logic (login, register, OAuth)
├── auth.controller.ts      # HTTP endpoints
├── dto/
│   ├── register.dto.ts    # Registration validation
│   └── login.dto.ts       # Login validation
├── strategies/
│   ├── jwt.strategy.ts    # JWT token validation
│   ├── local.strategy.ts  # Local username/password
│   └── google.strategy.ts # Google OAuth2
├── guards/
│   ├── jwt-auth.guard.ts  # Protect routes with JWT
│   └── roles.guard.ts     # Role-based authorization
└── decorators/
    ├── current-user.decorator.ts  # Extract user from request
    └── roles.decorator.ts         # Set required roles
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Application
NODE_ENV=development
```

## API Endpoints

### POST /auth/register
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe",
  "locale": "de"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "USER",
    "locale": "de",
    "isVerified": false
  }
}
```

### POST /auth/login
Login with email and password. Returns JWT tokens in cookies and response body.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

**Cookies Set:**
- `access_token` (15 minutes, httpOnly)
- `refresh_token` (7 days, httpOnly)

### POST /auth/logout
Clears authentication cookies.

**Response:**
```json
{
  "message": "Logout successful"
}
```

### GET /auth/profile
Get current authenticated user profile. Requires JWT authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```
Or cookie: `access_token`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### GET /auth/google
Initiates Google OAuth flow. Redirects to Google login.

### GET /auth/google/callback
Google OAuth callback handler. Sets cookies and returns tokens.

### POST /auth/refresh
Refresh access token using refresh token from cookie.

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

## Usage Examples

### Protecting Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
```

### Role-Based Authorization

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('ADMIN', 'MODERATOR')
  getDashboard() {
    return { message: 'Admin dashboard' };
  }
}
```

### Get Current User

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';

@Controller('posts')
export class PostsController {
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }
}
```

## Security Considerations

1. **Password Requirements**: Minimum 8 characters, must contain uppercase, lowercase, and number
2. **Token Storage**: Access tokens stored in httpOnly cookies (XSS protection)
3. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days
4. **CORS**: Configured to allow credentials from specified origins
5. **Rate Limiting**: Should be implemented at the controller level
6. **Email Verification**: TODO - Currently not enforced, users can login immediately

## TODO

- [ ] Implement email verification flow
- [ ] Add password reset functionality
- [ ] Add two-factor authentication (2FA)
- [ ] Implement account lockout after failed attempts
- [ ] Add session management (revoke all sessions)
- [ ] Add audit logging for security events
- [ ] Implement Apple Sign-In
- [ ] Add refresh token rotation
- [ ] Implement token blacklisting for logout

## Testing

### Manual Testing with cURL

Register:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","displayName":"Test User"}'
```

Login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' \
  -c cookies.txt
```

Get Profile:
```bash
curl -X GET http://localhost:3001/auth/profile \
  -b cookies.txt
```

## Dependencies

- `@nestjs/jwt` - JWT token generation and validation
- `@nestjs/passport` - Authentication middleware
- `passport-jwt` - JWT strategy for Passport
- `passport-google-oauth20` - Google OAuth strategy
- `bcrypt` - Password hashing
- `cookie-parser` - Parse cookies from requests
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation

## Database Schema

The auth module uses the Prisma `User` model:

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   // null for OAuth users
  displayName   String
  role          UserRole  @default(USER)
  locale        String    @default("de")
  isVerified    Boolean   @default(false)
  isBanned      Boolean   @default(false)
  googleId      String?   @unique
  appleId       String?   @unique
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  USER
  CREATOR
  MODERATOR
  ADMIN
}
```
