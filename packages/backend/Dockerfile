# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Build shared package
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared and backend
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/backend

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3001

CMD ["node", "packages/backend/dist/index.js"]
