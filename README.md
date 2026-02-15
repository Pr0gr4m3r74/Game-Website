# PlayVerse - Cross-Platform Social Game Platform 🎮

A production-ready MVP for a cross-platform social game platform built with modern web technologies. Play on web, iOS, and Android via PWA/native wrappers.

> **🔒 Security Update**: Next.js has been updated to version 15.0.8+ to address CVE-2025 vulnerabilities related to HTTP request deserialization DoS. Always run `npm audit` and keep dependencies up to date.

## 🚀 Features

- **Cross-Platform**: Web-first PWA design, playable on desktop, iOS, and Android
- **Real-Time Multiplayer**: WebSocket-based real-time game interactions
- **Social Features**: Friend system, chat, achievements, and user profiles
- **Responsive Design**: Beautiful UI with Tailwind CSS, optimized for all screen sizes
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Modern Stack**: TypeScript, Next.js, Express, PostgreSQL, Prisma ORM
- **Developer Experience**: Monorepo structure, hot reload, Docker support
- **CI/CD Ready**: GitHub Actions workflows for automated testing and deployment

## 📁 Project Structure

```
Game-Website/
├── packages/
│   ├── frontend/          # Next.js web application
│   │   ├── src/
│   │   │   ├── app/      # Next.js 14 app router pages
│   │   │   ├── components/  # React components
│   │   │   ├── lib/      # API client, WebSocket, utilities
│   │   │   └── styles/   # Global CSS and Tailwind
│   │   ├── public/       # Static assets, PWA manifest
│   │   └── Dockerfile    # Frontend production build
│   │
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── routes/       # API routes
│   │   │   ├── middleware/   # Auth, error handling
│   │   │   ├── config/       # Configuration
│   │   │   └── index.ts      # Server entry point
│   │   ├── prisma/       # Database schema and migrations
│   │   └── Dockerfile    # Backend production build
│   │
│   └── shared/           # Shared types and utilities
│       └── src/
│           ├── types.ts   # Common TypeScript types
│           └── utils.ts   # Shared utility functions
│
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD pipeline
├── docker-compose.yml    # Docker orchestration
└── package.json          # Root workspace configuration
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **SWR** - Data fetching and caching

### Backend
- **Express.js** - Web server framework
- **TypeScript** - Type-safe development
- **Prisma** - Modern ORM for PostgreSQL
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Database
- **PostgreSQL** - Relational database
- **Prisma Migrate** - Database migrations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development orchestration
- **GitHub Actions** - CI/CD pipelines

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for containerized setup)
- PostgreSQL 15+ (if running without Docker)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pr0gr4m3r74/Game-Website.git
   cd Game-Website
   ```

2. **Set production secrets** (IMPORTANT for production)
   ```bash
   # Set JWT secret via environment variable
   export JWT_SECRET="your-secure-random-jwt-secret-here"
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/api/health

> **⚠️ Security Note**: The default docker-compose.yml is configured for development. For production, ensure you set a secure JWT_SECRET environment variable and use proper secrets management.

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pr0gr4m3r74/Game-Website.git
   cd Game-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp packages/backend/.env.example packages/backend/.env
   
   # Frontend
   cp packages/frontend/.env.example packages/frontend/.env
   ```

4. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Using Docker for just the database
   docker run -d \
     --name playverse-db \
     -e POSTGRES_USER=playverse \
     -e POSTGRES_PASSWORD=playverse123 \
     -e POSTGRES_DB=playverse \
     -p 5432:5432 \
     postgres:15-alpine
   ```

5. **Run database migrations**
   ```bash
   cd packages/backend
   npx prisma migrate dev
   npx prisma db seed
   cd ../..
   ```

6. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:backend  # Backend on :3001
   npm run dev:frontend # Frontend on :3000
   ```

## 🎮 Demo Accounts

Try the platform with these pre-seeded accounts:

- **Email**: alice@playverse.com | **Password**: Demo1234
- **Email**: bob@playverse.com | **Password**: Demo1234
- **Email**: charlie@playverse.com | **Password**: Demo1234

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecurePass123",
  "displayName": "New User"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Game Endpoints

#### List Games
```http
GET /api/games?status=waiting&page=1&limit=20
Authorization: Bearer <token>
```

#### Create Game
```http
POST /api/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Game Room",
  "description": "Let's play together!",
  "maxPlayers": 4
}
```

#### Join Game
```http
POST /api/games/:id/join
Authorization: Bearer <token>
```

## 🔧 Database Schema

### Core Models

- **User**: User accounts with authentication
- **Game**: Game sessions/rooms
- **GameParticipant**: Many-to-many relationship for users in games
- **Friend**: Social connections between users
- **Message**: Chat messages in game rooms
- **Achievement**: Unlockable achievements
- **UserAchievement**: User's unlocked achievements

See `packages/backend/prisma/schema.prisma` for the complete schema.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=packages/backend
npm test --workspace=packages/frontend
```

## 🎨 Linting & Formatting

```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🏗️ Building for Production

### Build all packages
```bash
npm run build
```

### Build individual packages
```bash
npm run build:frontend
npm run build:backend
```

### Docker production build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

## 🚢 Deployment

### Prerequisites for Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: PostgreSQL instance (e.g., AWS RDS, Digital Ocean, Supabase)
3. **Container Registry**: For Docker images (e.g., Docker Hub, AWS ECR, GitHub Container Registry)

### Deployment Options

#### Option 1: Docker Container Platform
- Deploy to AWS ECS, Google Cloud Run, Azure Container Apps, or DigitalOcean App Platform
- Use the provided Dockerfiles and docker-compose.yml as reference

#### Option 2: Platform-as-a-Service
- **Frontend**: Deploy to Vercel, Netlify, or Cloudflare Pages
- **Backend**: Deploy to Railway, Render, or Fly.io
- **Database**: Use managed PostgreSQL from the same provider

#### Option 3: Virtual Private Server
- Deploy to any VPS (DigitalOcean, Linode, AWS EC2)
- Use docker-compose for orchestration
- Set up nginx as reverse proxy

### Example: Vercel + Railway Deployment

**Frontend (Vercel)**:
1. Connect your GitHub repository to Vercel
2. Set root directory to `packages/frontend`
3. Add environment variables for API URLs
4. Deploy

**Backend (Railway)**:
1. Create new project on Railway
2. Add PostgreSQL database service
3. Connect GitHub repository
4. Set root directory to `packages/backend`
5. Add environment variables
6. Deploy

## 📱 PWA Installation

The frontend is a Progressive Web App that can be installed on mobile devices:

1. Open the app in a mobile browser
2. Look for "Add to Home Screen" prompt
3. Install the app
4. Launch from your home screen like a native app

## 🤝 Contributing

This is a production-ready MVP designed for team collaboration. Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (ESLint + Prettier configured)
- Write meaningful commit messages
- Update documentation for new features
- Add tests for new functionality
- Ensure all CI checks pass before requesting review

## 📝 License

This project is available for educational and commercial use.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by social and sandbox gaming platforms
- Designed for scalability and team collaboration

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the API examples in `/examples`

---

**Built with ❤️ as a production-ready MVP for cross-platform social gaming**