# Authentication Backend API

## Overview
This document defines the authentication backend API for NoMoreHieroglyphics. The UI is provided separately by the client application.

## Authentication Strategy

### Recommended: JWT-based Authentication
- Stateless authentication using JSON Web Tokens
- Refresh token rotation for security
- OAuth2 integration for social logins
- Multi-factor authentication support

## API Endpoints

### Base URL
```
Production: https://api.nomohieroglyphics.com/v1/auth
Development: http://localhost:3000/v1/auth
```

---

## Core Authentication Endpoints

### POST /register
Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "userId": "usr_123",
  "email": "user@example.com",
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_...",
  "expiresIn": 3600
}
```

### POST /login
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "userId": "usr_123",
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_...",
  "subscriptionTier": "free"
}
```

### POST /refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "accessToken": "new_token",
  "expiresIn": 3600
}
```

### POST /logout
Invalidate tokens

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Social OAuth

### Supported Providers
- Google OAuth
- Apple Sign In
- GitHub

### GET /oauth/{provider}
Initiate OAuth flow

### GET /oauth/{provider}/callback
Handle OAuth callback

---

## Security

### Password Requirements
- Minimum 8 characters
- Mixed case letters
- Numbers and special characters

### Rate Limiting
- Login: 5 attempts per 15 minutes
- Registration: 3 per hour per IP
- API calls: 100 per minute per user

### JWT Structure
```json
{
  "sub": "usr_123",
  "email": "user@example.com",
  "tier": "pro",
  "exp": 1640003600
}
```

---

## Database Schema

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Implementation Note

**UI is provided by the client.** This API provides only the backend functionality. The client application will implement its own login forms, registration flows, and user interface components.
