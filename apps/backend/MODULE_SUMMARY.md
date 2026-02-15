# New Modules Created

## 1. Worlds Module (`src/worlds/`)

### Features
- Create, read, update, delete user-created worlds
- Scene JSON storage for 3D world data
- Visibility controls (PRIVATE, FRIENDS, PUBLIC)
- Approval system for public worlds
- Pagination support

### Files Created
- `worlds.module.ts` - Module definition with PrismaModule import
- `worlds.service.ts` - Business logic for world management
- `worlds.controller.ts` - REST API endpoints
- `dto/create-world.dto.ts` - DTO for creating worlds
- `dto/update-world.dto.ts` - DTO for updating worlds

### Endpoints
- `POST /worlds` - Create new world (authenticated)
- `GET /worlds` - List public worlds with filters
- `GET /worlds/me` - Get current user's worlds
- `GET /worlds/:id` - Get world details (respects visibility)
- `PATCH /worlds/:id` - Update world (owner only)
- `PATCH /worlds/:id/visibility` - Change visibility (owner only)
- `DELETE /worlds/:id` - Delete world (owner only)

### Key Features
- Bad word filtering on names/descriptions
- Ownership validation
- Visibility permission checks
- Pagination on list endpoints
- Swagger documentation

---

## 2. Moderation Module (`src/moderation/`)

### Features
- User reporting system
- Report review and resolution
- Cosmetic approval workflow
- User ban/unban functionality
- Audit logging for all moderation actions
- Role-based access control

### Files Created
- `moderation.module.ts` - Module definition with PrismaModule import
- `moderation.service.ts` - Business logic for moderation
- `moderation.controller.ts` - REST API endpoints with role guards
- `dto/create-report.dto.ts` - DTO for creating reports
- `dto/review-report.dto.ts` - DTO for reviewing reports

### Endpoints
- `POST /moderation/reports` - Create report (any authenticated user)
- `GET /moderation/reports` - List reports (ADMIN, MODERATOR)
- `GET /moderation/reports/:id` - Get report details (ADMIN, MODERATOR)
- `PATCH /moderation/reports/:id/review` - Review report (ADMIN, MODERATOR)
- `PATCH /moderation/cosmetics/:id/approve` - Approve cosmetic (ADMIN, MODERATOR)
- `POST /moderation/users/:id/ban` - Ban user (ADMIN only)
- `DELETE /moderation/users/:id/ban` - Unban user (ADMIN only)

### Key Features
- Target validation (USER, COSMETIC, WORLD, AVATAR)
- Comprehensive audit logging via AuditLog model
- Role-based guards (@Roles decorator + RolesGuard)
- Report status tracking (PENDING, UNDER_REVIEW, RESOLVED)
- Pagination on list endpoints
- Swagger documentation
- JWT authentication required

### Audit Logging
All moderation actions create audit logs with:
- Admin ID
- Action type (REVIEW_REPORT, APPROVE_COSMETIC, BAN_USER, UNBAN_USER)
- Target type and ID
- Detailed JSON metadata

---

## Integration

Both modules have been registered in `app.module.ts`:
```typescript
imports: [
  // ... existing modules
  WorldsModule,
  ModerationModule,
]
```

## Dependencies Used
- `@nestjs/common` - Controllers, services, decorators
- `@nestjs/swagger` - API documentation
- `@prisma/client` - Database access (Visibility, ReportTarget, ReportStatus enums)
- `class-validator` - DTO validation
- `bad-words` - Content moderation
- Custom guards: `JwtAuthGuard`, `RolesGuard`
- Custom decorators: `@Roles()`

## Security
- JWT authentication on protected routes
- Role-based authorization (USER, MODERATOR, ADMIN)
- Owner validation for resource modification
- Visibility checks for world access
- Profanity filtering on user-generated content
