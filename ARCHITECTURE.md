# Architecture Overview

## System Architecture

PlayVerse is built as a modern, scalable monorepo application with a clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Desktop  │  │  Mobile  │  │  Tablet  │  │   PWA    │   │
│  │ Browser  │  │ Browser  │  │ Browser  │  │   App    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────┐                    ┌──────────────┐
│   Frontend    │                    │   WebSocket  │
│   Next.js     │◄──────────────────►│   Server     │
│   (Port 3000) │                    │  (Socket.io) │
└───────┬───────┘                    └──────┬───────┘
        │                                   │
        │  HTTP/REST                        │
        │  API Calls                        │
        │                                   │
        └────────────────┬──────────────────┘
                         ▼
                 ┌──────────────┐
                 │   Backend    │
                 │   Express    │
                 │  (Port 3001) │
                 └──────┬───────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
           ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │   Auth   │ │  Games   │ │  Social  │
    │  Service │ │ Service  │ │ Service  │
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         └────────────┴────────────┘
                      │
                      ▼
              ┌──────────────┐
              │    Prisma    │
              │     ORM      │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  PostgreSQL  │
              │   Database   │
              └──────────────┘
```

## Technology Stack

### Frontend Layer

**Framework**: Next.js 14 with App Router
- **Why**: Server-side rendering, great performance, built-in routing
- **Benefits**: SEO-friendly, fast page loads, excellent DX

**Styling**: Tailwind CSS
- **Why**: Utility-first, highly customizable, responsive design
- **Benefits**: Consistent styling, rapid development, small bundle size

**State Management**: React hooks + SWR
- **Why**: Built-in with React, SWR for server state
- **Benefits**: Simple, performant, automatic revalidation

**Real-time**: Socket.io Client
- **Why**: Reliable WebSocket library with fallbacks
- **Benefits**: Cross-browser support, reconnection handling

### Backend Layer

**Framework**: Express.js
- **Why**: Minimal, flexible, widely adopted
- **Benefits**: Extensive middleware ecosystem, easy to extend

**Language**: TypeScript
- **Why**: Type safety, better IDE support, fewer runtime errors
- **Benefits**: Improved maintainability, better documentation

**Authentication**: JWT + bcrypt
- **Why**: Stateless auth, industry standard
- **Benefits**: Scalable, secure, works well with SPAs

**Real-time**: Socket.io Server
- **Why**: Pairs with Socket.io client, handles rooms/namespaces
- **Benefits**: Built-in broadcasting, room management

### Database Layer

**Database**: PostgreSQL
- **Why**: ACID compliant, reliable, feature-rich
- **Benefits**: Strong data integrity, good performance, JSON support

**ORM**: Prisma
- **Why**: Type-safe database client, excellent migrations
- **Benefits**: Auto-generated types, intuitive API, great DX

### Shared Layer

**Purpose**: Shared types and utilities
- **Why**: DRY principle, consistency across layers
- **Benefits**: Single source of truth for types

## Data Flow

### Authentication Flow

```
1. User submits credentials
   Frontend → POST /api/auth/login

2. Backend validates credentials
   Express → Prisma → PostgreSQL

3. Generate JWT token
   Backend → JWT.sign()

4. Return token to client
   Backend → Frontend

5. Store token
   Frontend → localStorage

6. Include token in requests
   Frontend → Authorization: Bearer <token>

7. Validate token
   Middleware → JWT.verify()
```

### Game Creation Flow

```
1. User creates game
   Frontend → POST /api/games

2. Validate user authentication
   Middleware → Verify JWT

3. Create game in database
   Controller → Prisma → PostgreSQL

4. Return game data
   Backend → Frontend

5. Redirect to game lobby
   Frontend → /games

6. Connect to WebSocket
   Frontend → socket.join(gameId)

7. Broadcast game update
   Backend → io.to(gameId).emit()
```

## Database Schema

### Core Entities

```prisma
User
├── id (Primary Key)
├── username (Unique)
├── email (Unique)
├── password (Hashed)
├── displayName
├── avatarUrl
├── level
├── experience
└── Relations:
    ├── games (Created games)
    ├── gameParticipants (Joined games)
    ├── friends
    └── achievements

Game
├── id (Primary Key)
├── name
├── description
├── maxPlayers
├── currentPlayers
├── status (Enum: WAITING, IN_PROGRESS, COMPLETED)
├── createdById (Foreign Key → User)
└── Relations:
    ├── participants
    └── messages

GameParticipant (Join Table)
├── id (Primary Key)
├── userId (Foreign Key → User)
├── gameId (Foreign Key → Game)
├── score
└── joinedAt

Friend
├── id (Primary Key)
├── userId (Foreign Key → User)
├── friendId (Foreign Key → User)
├── status (Enum: PENDING, ACCEPTED, BLOCKED)
└── createdAt
```

### Relationships

- **User → Games**: One-to-Many (creator)
- **User → GameParticipant**: One-to-Many
- **Game → GameParticipant**: One-to-Many
- **User → Friends**: Many-to-Many (self-referential)
- **User → Achievements**: Many-to-Many

## Security Architecture

### Authentication & Authorization

1. **Password Security**
   - bcrypt hashing (10 rounds)
   - No plain text storage
   - Password strength validation

2. **JWT Tokens**
   - Signed with secret key
   - 7-day expiration
   - Stateless authentication
   - Verified on each protected route

3. **API Security**
   - CORS configured
   - Helmet.js security headers
   - Rate limiting
   - Input validation (express-validator)

### Data Security

- **SQL Injection**: Prevented by Prisma ORM
- **XSS**: React auto-escapes by default
- **CSRF**: Token-based auth (stateless)
- **Secrets**: Environment variables

## Scalability Considerations

### Horizontal Scaling

**Frontend**:
- Static site deployment
- CDN distribution
- Edge caching

**Backend**:
- Stateless design
- Load balancer ready
- Multiple instances supported

**Database**:
- Connection pooling
- Read replicas
- Query optimization

### Performance Optimizations

**Frontend**:
- Code splitting
- Image optimization
- Lazy loading
- Service worker caching

**Backend**:
- Response caching
- Database query optimization
- Efficient indexes
- Connection pooling

**Database**:
- Indexed foreign keys
- Optimized queries
- Regular vacuuming

## Monitoring & Observability

### Logging

**Frontend**:
- Console errors
- User actions
- Performance metrics

**Backend**:
- Request logs
- Error logs
- Performance logs

### Metrics

- Response times
- Error rates
- Active users
- Database connections
- WebSocket connections

### Alerting

- Error rate thresholds
- Performance degradation
- Database issues
- High resource usage

## Development Workflow

### Local Development

```bash
# Start all services
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: localhost:5432
```

### Code Quality

1. **Linting**: ESLint
2. **Formatting**: Prettier
3. **Type Checking**: TypeScript
4. **Git Hooks**: Pre-commit checks

### Testing Strategy

1. **Unit Tests**: Jest
2. **Integration Tests**: Supertest
3. **E2E Tests**: Playwright (future)

### CI/CD Pipeline

```
Push → GitHub
  ↓
Lint & Format Check
  ↓
Type Check
  ↓
Run Tests
  ↓
Build Packages
  ↓
Build Docker Images
  ↓
Deploy (if main branch)
```

## Deployment Architecture

### Production Setup

```
                  ┌──────────────┐
                  │   Internet   │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ Load Balancer│
                  │     (CDN)    │
                  └──────┬───────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
    ┌─────▼─────┐               ┌──────▼──────┐
    │ Frontend  │               │  Backend    │
    │ Container │               │  Container  │
    │ (Next.js) │               │ (Express)   │
    └───────────┘               └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │  PostgreSQL │
                                │   (Managed) │
                                └─────────────┘
```

### Container Orchestration

- Docker Compose (local/VPS)
- Kubernetes (large scale)
- Cloud platform services (Vercel, Railway, etc.)

## Future Enhancements

### Planned Features

1. **Game Engine Integration**
   - Canvas/WebGL rendering
   - Game state management
   - Physics engine

2. **Advanced Social Features**
   - Direct messaging
   - Groups/clans
   - Activity feeds

3. **Monetization**
   - In-game purchases
   - Premium features
   - Advertisement integration

4. **Analytics**
   - Player behavior tracking
   - Gameplay analytics
   - Business metrics

### Technical Improvements

1. **Performance**
   - Redis caching
   - GraphQL API option
   - Microservices architecture

2. **DevOps**
   - Kubernetes deployment
   - Auto-scaling
   - Blue-green deployments

3. **Testing**
   - E2E test suite
   - Load testing
   - Security testing

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to the architecture.

## Support

For architectural questions:
- Open a GitHub Discussion
- Review the codebase
- Check deployment documentation

---

**Last Updated**: 2024
**Version**: 0.1.0
