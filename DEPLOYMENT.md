# Deployment Guide

This guide covers various deployment options for the PlayVerse social game platform.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [Production Checklist](#production-checklist)

## Prerequisites

Before deploying, ensure you have:

- ✅ PostgreSQL database (managed service recommended)
- ✅ Domain name (optional but recommended)
- ✅ SSL certificate (Let's Encrypt or cloud provider)
- ✅ Container registry account (if using Docker)
- ✅ Cloud provider account

## Environment Variables

### Backend Environment Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-use-random-string
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_WS_URL=https://api.your-domain.com
```

## Docker Deployment

### Option 1: Docker Compose (VPS)

Perfect for deploying to a VPS (DigitalOcean, Linode, AWS EC2, etc.)

1. **Prepare your VPS**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt install docker-compose -y
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/Pr0gr4m3r74/Game-Website.git
   cd Game-Website
   ```

3. **Configure environment**
   ```bash
   # Create production env files
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   
   # Edit with your production values
   nano packages/backend/.env
   nano packages/frontend/.env
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

5. **Set up nginx reverse proxy**
   ```bash
   sudo apt install nginx -y
   
   # Create nginx config
   sudo nano /etc/nginx/sites-available/playverse
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com -d api.your-domain.com
   ```

### Option 2: Container Registry + Cloud Platform

1. **Build and push images**
   ```bash
   # Login to your registry
   docker login
   
   # Build backend
   docker build -t yourusername/playverse-backend:latest \
     -f packages/backend/Dockerfile .
   
   # Build frontend
   docker build -t yourusername/playverse-frontend:latest \
     -f packages/frontend/Dockerfile .
   
   # Push images
   docker push yourusername/playverse-backend:latest
   docker push yourusername/playverse-frontend:latest
   ```

2. **Deploy to cloud platform** (see specific guides below)

## Cloud Platform Deployment

### Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `packages/frontend` as root directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

4. **Deploy**: Click "Deploy"

#### Backend on Railway

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Add PostgreSQL**
   - Add new service → PostgreSQL
   - Railway will auto-generate DATABASE_URL

3. **Configure Backend Service**
   - Root Directory: `packages/backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

5. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   railway run npx prisma db seed
   ```

### AWS Deployment

#### Using AWS ECS (Fargate)

1. **Push to ECR**
   ```bash
   # Create ECR repositories
   aws ecr create-repository --repository-name playverse-backend
   aws ecr create-repository --repository-name playverse-frontend
   
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin YOUR_ECR_URI
   
   # Tag and push
   docker tag playverse-backend:latest YOUR_ECR_URI/playverse-backend:latest
   docker push YOUR_ECR_URI/playverse-backend:latest
   ```

2. **Set up RDS PostgreSQL**
   - Create RDS PostgreSQL instance
   - Note the connection string

3. **Create ECS Cluster and Task Definitions**
   - Create ECS cluster
   - Define task definitions for backend and frontend
   - Configure environment variables
   - Set up Application Load Balancer

4. **Deploy Services**
   - Create ECS services from task definitions
   - Configure auto-scaling

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure Components**

   **Backend:**
   - Type: Web Service
   - Source Directory: `packages/backend`
   - Build Command: `npm run build`
   - Run Command: `npm run start`
   - HTTP Port: 3001

   **Frontend:**
   - Type: Static Site
   - Source Directory: `packages/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Database**
   - Add PostgreSQL database component
   - DigitalOcean will auto-inject DATABASE_URL

4. **Set Environment Variables** in the console

5. **Deploy**: Click "Deploy"

### Render

#### Frontend

1. **Create Static Site**
   - Connect GitHub repository
   - Build Command: `cd packages/frontend && npm install && npm run build`
   - Publish Directory: `packages/frontend/.next`

#### Backend

1. **Create Web Service**
   - Connect GitHub repository
   - Build Command: `cd packages/backend && npm install && npm run build`
   - Start Command: `cd packages/backend && npm run start`

2. **Add PostgreSQL**
   - Create PostgreSQL database
   - Copy DATABASE_URL

3. **Set Environment Variables**

4. **Run Database Migrations**
   - In the shell tab:
   ```bash
   cd packages/backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Production Checklist

### Security

- [ ] Change all default credentials
- [ ] Use strong, unique JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers (Helmet)
- [ ] Regular security updates
- [ ] Implement input validation
- [ ] Set up monitoring and alerts

### Database

- [ ] Use managed PostgreSQL service
- [ ] Enable automated backups
- [ ] Set up read replicas (if needed)
- [ ] Configure connection pooling
- [ ] Monitor database performance
- [ ] Set up database migrations in CI/CD

### Performance

- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression
- [ ] Monitor application performance
- [ ] Set up auto-scaling

### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging aggregation
- [ ] Set up uptime monitoring
- [ ] Configure alerting
- [ ] Monitor resource usage
- [ ] Track API performance

### Documentation

- [ ] Document deployment process
- [ ] Create runbooks for common issues
- [ ] Document rollback procedures
- [ ] Keep architecture diagrams updated

### CI/CD

- [ ] Automated testing in pipeline
- [ ] Automated deployments
- [ ] Staging environment
- [ ] Rollback capability
- [ ] Blue-green deployment (optional)

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check system health
- Review security alerts

**Weekly:**
- Review performance metrics
- Check backup integrity
- Update dependencies (if needed)

**Monthly:**
- Security audit
- Performance optimization
- Cost optimization review
- Update documentation

### Backup Strategy

1. **Database Backups**
   - Automated daily backups
   - Weekly full backups
   - Retention: 30 days

2. **Application State**
   - Version control (Git)
   - Tagged releases
   - Docker image versioning

### Disaster Recovery

1. **Create restore procedure documentation**
2. **Test restore process quarterly**
3. **Maintain off-site backups**
4. **Document failover procedures**

## Support

For deployment issues:
- Check deployment logs first
- Review environment variables
- Verify database connectivity
- Check security group/firewall rules
- Consult cloud provider documentation

## Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)

---

**Need help?** Open an issue on GitHub or consult your cloud provider's support.
