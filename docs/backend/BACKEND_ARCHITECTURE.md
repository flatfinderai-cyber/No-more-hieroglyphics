# Backend Architecture - NoMoreHieroglyphics

## Overview
Complete backend API architecture for NoMoreHieroglyphics. **The UI is provided by the client application separately.**

This backend provides:
- Authentication & user management
- Subscription billing
- Dictionary term database
- Translation services
- App store integration
- Analytics

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  (Web, iOS, Android - UI provided by client)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
│                    (Rate Limiting, CORS)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────▼────────┐ ┌───▼────────┐ ┌───▼─────────┐
│ Authentication│ │  Billing   │ │ Dictionary  │
│    Service    │ │  Service   │ │   Service   │
└──────┬────────┘ └───┬────────┘ └───┬─────────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
        ┌─────────────▼─────────────┐
        │      Database Layer        │
        │  (PostgreSQL/MongoDB)      │
        └───────────────────────────┘
```

---

## Technology Stack

### Recommended Stack
```
Runtime: Node.js 18+ / Python 3.11+
Framework: Express.js / FastAPI
Database: PostgreSQL 15+ (relational) + Redis (cache)
Authentication: JWT + OAuth2
Payment: Stripe
Hosting: AWS / Google Cloud / Azure
```

### Alternative Stack
```
Runtime: Go 1.21+
Framework: Gin / Echo
Database: MongoDB + Redis
Everything else same as recommended
```

---

## API Structure

### Base URL
```
Production: https://api.nomohieroglyphics.com/v1
Development: http://localhost:3000/v1
```

### API Modules

#### 1. Authentication (`/auth`)
- User registration & login
- OAuth (Google, Apple, GitHub)
- Token refresh
- Password reset
- Profile management

**Docs:** [authentication/AUTHENTICATION_API.md](../authentication/AUTHENTICATION_API.md)

#### 2. Billing (`/billing`)
- Subscription plans
- Payment methods
- Invoices
- Usage tracking
- Receipt validation (iOS/Android)

**Docs:** [billing/BILLING_API.md](../billing/BILLING_API.md)

#### 3. Dictionary (`/dictionary`)
- Term search
- Category browsing
- Term details
- Favorites
- History

**Docs:** [database/DATABASE_SETUP.md](../database/DATABASE_SETUP.md)

#### 4. Translation (`/translate`)
- Direct decode
- Tone sanitization
- Batch processing

#### 5. App Store (`/app`)
- Version info
- Feature flags
- Store URLs
- Update checks

**Docs:** [app-stores/APP_STORE_API.md](../app-stores/APP_STORE_API.md)

---

## API Endpoints Summary

### Authentication Endpoints
```
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout
GET    /v1/auth/profile
PATCH  /v1/auth/profile
POST   /v1/auth/forgot-password
POST   /v1/auth/reset-password
GET    /v1/auth/oauth/{provider}
GET    /v1/auth/oauth/{provider}/callback
```

### Billing Endpoints
```
GET    /v1/billing/plans
POST   /v1/billing/subscribe
GET    /v1/billing/subscription
POST   /v1/billing/subscription/cancel
PATCH  /v1/billing/subscription
GET    /v1/billing/invoices
GET    /v1/billing/usage
POST   /v1/billing/verify-receipt/ios
POST   /v1/billing/verify-receipt/android
```

### Dictionary Endpoints
```
GET    /v1/dictionary/search?q={term}
GET    /v1/dictionary/terms/{id}
GET    /v1/dictionary/categories
GET    /v1/dictionary/categories/{id}/terms
POST   /v1/dictionary/favorites
GET    /v1/dictionary/favorites
DELETE /v1/dictionary/favorites/{id}
GET    /v1/dictionary/history
```

### Translation Endpoints
```
POST   /v1/translate/decode
POST   /v1/translate/sanitize
POST   /v1/translate/batch
GET    /v1/translate/history
```

### App Endpoints
```
GET    /v1/app/info
GET    /v1/app/features
POST   /v1/webhooks/stripe
POST   /v1/webhooks/apple
POST   /v1/webhooks/google
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  photo_url TEXT,
  oauth_provider VARCHAR(20),
  oauth_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_id VARCHAR(255),
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  preferences JSONB DEFAULT '{}'::jsonb,
  INDEX idx_email (email),
  INDEX idx_oauth (oauth_provider, oauth_id)
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

### Terms Table
```sql
CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  technical_definition TEXT NOT NULL,
  practical_definition TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  related_terms JSONB DEFAULT '[]'::jsonb,
  search_vector tsvector,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_slug (slug),
  INDEX idx_search_vector USING GIN (search_vector)
);
```

### User History Table
```sql
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  term_id UUID,
  action_type VARCHAR(20) NOT NULL,
  input_text TEXT,
  output_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_stripe_subscription_id (stripe_subscription_id)
);
```

---

## Environment Variables

### Required
```bash
# Server
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.nomohieroglyphics.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Store
IOS_SHARED_SECRET=...
GOOGLE_SERVICE_ACCOUNT_KEY=...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...
FROM_EMAIL=noreply@nomohieroglyphics.com

# CORS
ALLOWED_ORIGINS=https://nomohieroglyphics.com,https://app.nomohieroglyphics.com
```

---

## Security

### Rate Limiting
```javascript
// Express example
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts'
});

app.post('/v1/auth/login', authLimiter, loginHandler);
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));
```

### Password Hashing
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashedPassword = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Implementation
```javascript
const jwt = require('jsonwebtoken');

const accessToken = jwt.sign(
  { sub: user.id, email: user.email, tier: user.subscription_tier },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const refreshToken = jwt.sign(
  { sub: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

---

## Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://db:5432/nomohiero
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nomohiero
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nomohiero-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nomohiero-api
  template:
    metadata:
      labels:
        app: nomohiero-api
    spec:
      containers:
      - name: api
        image: nomohiero/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: database-url
```

---

## Monitoring & Logging

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // check actual DB
    redis: 'connected' // check actual Redis
  });
});
```

### Structured Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { userId: user.id, ip: req.ip });
```

### Metrics
- Request latency
- Error rates
- Authentication success/failure
- Subscription conversion rates
- API endpoint usage

---

## Testing

### Unit Tests
```javascript
describe('Authentication', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePassword123!',
        displayName: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('accessToken');
  });
});
```

### Integration Tests
```javascript
describe('Subscription Flow', () => {
  it('should create subscription and verify access', async () => {
    // Register user
    // Subscribe to plan
    // Verify subscription active
    // Check feature access
  });
});
```

---

## Performance Optimization

### Caching Strategy
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache term lookups
const getTerm = async (slug) => {
  const cached = await client.get(`term:${slug}`);
  if (cached) return JSON.parse(cached);
  
  const term = await db.terms.findOne({ slug });
  await client.setex(`term:${slug}`, 3600, JSON.stringify(term));
  return term;
};
```

### Database Indexing
- Email index for fast user lookup
- Search vector for full-text search
- Composite indexes for common queries

### CDN for Static Assets
- Use CloudFront or similar
- Cache API responses when possible

---

## Client Integration

### Authentication Flow
```
1. Client calls POST /v1/auth/login
2. Backend returns accessToken + refreshToken
3. Client stores tokens securely (httpOnly cookie or secure storage)
4. Client includes Authorization header in requests
5. When token expires, client uses refreshToken
6. Client implements login UI separately
```

### Subscription Flow
```
1. Client displays plans (UI provided by client)
2. Client collects payment via Stripe Elements
3. Client calls POST /v1/billing/subscribe with payment method
4. Backend creates subscription
5. Client updates UI to show subscription status
```

---

## Important Notes

1. **UI is Separate**: This backend provides APIs only. The client application provides all UI components including:
   - Login/registration forms
   - Payment forms
   - Subscription management interface
   - Dictionary search interface
   - Translation results display

2. **Security First**: All endpoints require proper authentication except public ones (login, register, forgot-password)

3. **Scalability**: Designed to scale horizontally with multiple API instances behind a load balancer

4. **Mobile Ready**: Full support for iOS and Android in-app purchases with receipt validation

---

## Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/flatfinderai-cyber/No-more-hieroglyphics.git
cd No-more-hieroglyphics/backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run Migrations
```bash
npm run migrate
npm run seed
```

### 4. Start Development
```bash
npm run dev
```

### 5. Test API
```bash
curl http://localhost:3000/health
```

---

For detailed API specifications, see:
- [Authentication API](../authentication/AUTHENTICATION_API.md)
- [Billing API](../billing/BILLING_API.md)
- [App Store Integration](../app-stores/APP_STORE_API.md)
- [Database Schema](../database/DATABASE_SETUP.md)
