# Avatar3D - 3D Avatar Social Game Platform 🎮

Eine produktionsreife MVP-Plattform für soziale Spiele mit Fokus auf 3D-Avatare. Spielbar im Web, auf iOS und Android via PWA/native Wrapper.

> **🔒 Sicherheitshinweis**: Alle Abhängigkeiten sind aktuell. Führen Sie regelmäßig `pnpm audit` aus, um die Sicherheit zu gewährleisten.

## 🚀 Features

- **3D Avatar System**: Umfangreiches Avatar-System mit Low-Poly-Ästhetik, Three.js-basiert
- **Creator Tools**: Upload von GLB/GLTF-Assets, Templates, Quick-Create-Wizard
- **Marketplace**: Bits-Economy, Cosmetics kaufen/verkaufen/giften
- **Mehrsprachig**: Vollständige i18n-Unterstützung (Deutsch/Englisch)
- **Cross-Platform**: Web-first PWA, spielbar auf Desktop, iOS und Android
- **World Editor**: Lightweight Scene-Editor mit Grid/Prefab-System
- **Moderation**: Content-Reporting, Admin-Panel, Profanity-Filter
- **GDPR-Ready**: Datenexport, Account-Löschung, Consent-Flows
- **Moderner Stack**: React, NestJS, TypeScript, PostgreSQL, Prisma ORM
- **CI/CD Ready**: GitHub Actions für automatisierte Tests und Deployment

## 📁 Projektstruktur

```
Game-Website/
├── apps/
│   ├── frontend/             # React + Vite Web-Anwendung
│   │   ├── src/
│   │   │   ├── components/  # React-Komponenten
│   │   │   ├── pages/       # Seiten (Router)
│   │   │   ├── three/       # 3D Avatar-System (Three.js)
│   │   │   ├── i18n/        # Übersetzungen (DE/EN)
│   │   │   ├── api/         # API-Client
│   │   │   └── hooks/       # Custom Hooks
│   │   └── public/          # Statische Assets, PWA-Manifest
│   │
│   └── backend/             # NestJS API-Server
│       ├── src/
│       │   ├── auth/        # Authentifizierung (JWT, OAuth)
│       │   ├── users/       # Benutzerverwaltung
│       │   ├── avatars/     # Avatar-System
│       │   ├── cosmetics/   # Cosmetics-System
│       │   ├── marketplace/ # Marketplace & Bits-Economy
│       │   ├── worlds/      # World-Editor
│       │   ├── moderation/  # Moderation & Reporting
│       │   └── prisma/      # Prisma-Service
│       └── prisma/          # DB-Schema, Migrations, Seed
│
├── packages/
│   └── common/              # Shared Types & Utilities
│       └── src/
│           ├── types.ts     # Gemeinsame TypeScript-Typen
│           └── utils.ts     # Hilfs-Funktionen
│
├── .github/workflows/       # CI/CD-Pipeline
├── docker-compose.yml       # Docker-Orchestrierung
├── pnpm-workspace.yaml      # pnpm Workspace-Config
└── package.json             # Root-Workspace-Konfiguration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI-Framework
- **Vite 5** - Build-Tool & Dev-Server
- **TypeScript** - Typsichere Entwicklung
- **Tailwind CSS** - Utility-first Styling
- **Three.js** - 3D-Rendering
- **@react-three/fiber** - React-Renderer für Three.js
- **react-i18next** - Internationalisierung (DE/EN)

### Backend
- **NestJS** - Progressives Node.js-Framework
- **TypeScript** - Typsichere Entwicklung
- **Prisma** - Modernes ORM für PostgreSQL
- **JWT** - Authentifizierung (Access & Refresh Tokens)
- **bcrypt** - Passwort-Hashing
- **Passport** - OAuth (Google, Apple)

### Datenbank & Speicher
- **PostgreSQL** - Relationale Datenbank
- **Redis** - Sessions & Caching
- **S3-kompatibel** - Asset-Speicher (AWS S3, MinIO, etc.)

### DevOps
- **pnpm** - Monorepo-Paketmanager
- **Docker & Docker Compose** - Containerisierung
- **GitHub Actions** - CI/CD-Pipeline

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ und pnpm 8+
- Docker und Docker Compose (für Container-Setup)
- PostgreSQL 15+ (falls ohne Docker)

### Option 1: Docker (Empfohlen)

1. **Repository klonen**
   ```bash
   git clone https://github.com/Pr0gr4m3r74/Game-Website.git
   cd Game-Website
   ```

2. **Secrets setzen** (WICHTIG für Produktion)
   ```bash
   # JWT-Secrets via Umgebungsvariablen setzen
   export JWT_SECRET="dein-sicherer-jwt-secret-mindestens-32-zeichen"
   export JWT_REFRESH_SECRET="dein-sicherer-refresh-secret-mindestens-32-zeichen"
   ```

3. **Services starten**
   ```bash
   docker-compose up -d
   ```

4. **Anwendung aufrufen**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs
   - Health Check: http://localhost:3001/health

> **⚠️ Sicherheitshinweis**: Die Standard-docker-compose.yml ist für Entwicklung konfiguriert. Für Produktion sichere JWT-Secrets setzen und Secrets-Management verwenden.

### Option 2: Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone https://github.com/Pr0gr4m3r74/Game-Website.git
   cd Game-Website
   ```

2. **Dependencies installieren**
   ```bash
   pnpm install
   ```

3. **Umgebungsvariablen einrichten**
   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   # .env bearbeiten und Secrets eintragen!
   
   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. **PostgreSQL starten** (falls nicht via Docker)
   ```bash
   # Nur Datenbank via Docker
   docker run -d \
     --name avatar3d-db \
     -e POSTGRES_USER=avatar3d \
     -e POSTGRES_PASSWORD=avatar3d123 \
     -e POSTGRES_DB=avatar3d_db \
     -p 5432:5432 \
     postgres:15-alpine
   ```

5. **Datenbank-Migrationen ausführen**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Dev-Server starten**
   ```bash
   # Beide Server starten
   pnpm dev
   
   # Oder einzeln starten
   pnpm dev:backend   # Backend auf :3001
   pnpm dev:frontend  # Frontend auf :5173
   ```

## 🎮 Demo-Accounts

Probieren Sie die Plattform mit diesen vorinstallierten Test-Accounts:

- **Admin**: admin@avatar3d.dev | **Passwort**: Demo1234
- **Email**: max@test.de | **Passwort**: Demo1234
- **Email**: anna@test.de | **Passwort**: Demo1234
- **Email**: john@test.com | **Passwort**: Demo1234
- **Email**: emma@test.com | **Passwort**: Demo1234
- **Email**: sophie@test.de | **Passwort**: Demo1234

Alle Test-User haben 100 Bits Startguthaben. Admin hat 10.000 Bits.

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

## 📚 Datenbank-Schema

### Kern-Modelle

- **User**: Benutzerkonten mit Authentifizierung, Rollen, Locale (DE/EN)
- **Avatar**: 3D-Avatare mit Customization-JSON, Equipment
- **CosmeticItem**: Handelbare Cosmetics im Marketplace
- **World**: Benutzererstellte 3D-Welten mit Scene-JSON
- **BitsBalance**: Virtuelle Währung pro Benutzer
- **Transaction**: Transaktionslog für Marketplace (atomar)
- **Report**: Content-Reporting für Moderation
- **AuditLog**: Audit-Trail für Admin-Aktionen

Siehe `apps/backend/prisma/schema.prisma` für das vollständige Schema.

## 🧪 Testen

```bash
# Alle Tests ausführen
pnpm test

# Tests für spezifisches Paket
pnpm --filter backend test
pnpm --filter frontend test

# E2E-Tests
pnpm test:e2e
```

## 🎨 Linting & Formatierung

```bash
# Lint alle Pakete
pnpm lint

# Code formatieren
pnpm format

# Formatierung prüfen
pnpm format:check
```

## 🏗️ Production Build

### Alle Pakete bauen
```bash
pnpm build
```

### Individuelle Pakete
```bash
pnpm build:frontend
pnpm build:backend
```

### Docker Production Build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

## 📱 PWA-Installation

Die Frontend-App ist eine Progressive Web App, die auf Mobilgeräten installiert werden kann:

1. App im mobilen Browser öffnen
2. "Zum Startbildschirm hinzufügen" wählen
3. App installieren
4. Vom Startbildschirm wie eine native App starten

## 🤝 Mitwirken

Dies ist ein produktionsreifes MVP für Teamzusammenarbeit. So können Sie beitragen:

1. **Repository forken**
2. **Feature-Branch erstellen**: `git checkout -b feature/tolles-feature`
3. **Änderungen committen**: `git commit -m 'feat: Tolles Feature hinzugefügt'`
4. **Branch pushen**: `git push origin feature/tolles-feature`
5. **Pull Request öffnen**

### Entwicklungsrichtlinien

- Bestehenden Code-Stil befolgen (ESLint + Prettier konfiguriert)
- Aussagekräftige Commit-Messages schreiben
- Dokumentation für neue Features aktualisieren
- Tests für neue Funktionalität hinzufügen
- Sicherstellen, dass alle CI-Checks bestehen

## 🔒 Sicherheit & GDPR

Sicherheit und Datenschutz haben höchste Priorität:

- **GDPR-Compliance**: Datenexport/Löschung, Consent-Flows
- **Content-Moderation**: Profanity-Filter, Reporting, Admin-Review
- **Security**: Input-Sanitization, Rate-Limiting, File-Validation
- **Audit-Trail**: Logging für Transaktionen und Moderations-Aktionen
- Review [SECURITY.md](./SECURITY.md) für Details
- Führen Sie regelmäßig `pnpm audit` aus
- Melden Sie Sicherheitsprobleme privat über GitHub

## 🎯 Nächste Schritte (TODOs)

Geplante Erweiterungen (siehe GitHub Issues):

1. **GDPR-Hardening**: E-Mail-Verifizierung, erweiterte Consent-Flows
2. **Content-Moderation Scaling**: KI-basierte Content-Prüfung
3. **Analytics & Telemetry**: Nutzungsstatistiken, Performance-Monitoring
4. **Mobile Wrappers**: Capacitor/React Native für native Apps (iOS/Android)
5. **Advanced 3D Features**: Skeletal Animation, IK, Physics
6. **Social Features**: Friends, Chat, Multiplayer

## 🙏 Danksagungen

- Gebaut mit modernen Web-Technologien und Best Practices
- Inspiriert von Sandbox- und Social-Gaming-Plattformen
- Designed für Skalierbarkeit und Teamzusammenarbeit

## 📞 Support

Bei Fragen oder Problemen:

- Issue auf GitHub öffnen
- Dokumentation in `/apps/backend` und `/apps/frontend` prüfen
- API-Dokumentation unter http://localhost:3001/api/docs

---

**Gebaut mit ❤️ als produktionsreifes MVP für cross-platform social gaming mit Fokus auf 3D-Avatare**