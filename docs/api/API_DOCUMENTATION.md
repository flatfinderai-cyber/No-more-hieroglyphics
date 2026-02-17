# API Documentation

## Overview
This document describes the API structure for the Tech Jargon Translator app backend services.

---

## Technology Stack

### Recommended: Firebase Cloud Functions
- **Serverless** - No infrastructure management
- **Auto-scaling** - Handles traffic automatically
- **Integrated** - Works seamlessly with Firebase services
- **Cost-effective** - Pay per use

### Alternative: Node.js/Express REST API
- Full control over infrastructure
- Can be deployed to AWS, Google Cloud, Azure, etc.
- Better for complex business logic

---

## API Endpoints

### Base URL
```
Production: https://api.nomohieroglyphics.com/v1
Development: https://dev-api.nomohieroglyphics.com/v1
```

---

## Authentication

All authenticated endpoints require a Firebase Auth token in the header:
```
Authorization: Bearer <firebase-id-token>
```

---

## Endpoints

### 1. Terms

#### GET /terms/search
Search for jargon terms

**Query Parameters:**
- `q` (string, required): Search query
- `category` (string, optional): Filter by category
- `limit` (number, optional): Results per page (default: 20, max: 100)
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "terms": [
      {
        "termId": "uuid",
        "term": "API",
        "translation": "Application Programming Interface...",
        "funnyTranslation": "The secret handshake...",
        "category": "programming",
        "difficulty": "beginner",
        "popularity": 1250,
        "tags": ["integration", "interface"]
      }
    ],
    "total": 42,
    "hasMore": true
  }
}
```

#### GET /terms/:termId
Get detailed information about a specific term

**Response:**
```json
{
  "success": true,
  "data": {
    "termId": "uuid",
    "term": "API",
    "translation": "Application Programming Interface...",
    "funnyTranslation": "The secret handshake...",
    "examples": [
      {
        "technical": "We need to integrate with the payment API",
        "plain": "We need to connect our app to the payment system"
      }
    ],
    "relatedTerms": [
      {
        "termId": "uuid2",
        "term": "REST API"
      }
    ],
    "category": "programming",
    "difficulty": "beginner",
    "popularity": 1250,
    "tags": ["integration", "interface"],
    "upvotes": 324,
    "downvotes": 12
  }
}
```

#### GET /terms/popular
Get most popular terms

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 10, max: 50)
- `category` (string, optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "terms": [
      {
        "termId": "uuid",
        "term": "API",
        "translation": "Application Programming Interface...",
        "popularity": 1250
      }
    ]
  }
}
```

#### GET /terms/random
Get a random term (useful for "Term of the Day" feature)

**Response:**
```json
{
  "success": true,
  "data": {
    "termId": "uuid",
    "term": "Kubernetes",
    "translation": "Container orchestration platform...",
    "funnyTranslation": "A robot that herds your app containers..."
  }
}
```

#### POST /terms/:termId/vote
Vote on a term

**Authentication:** Required

**Body:**
```json
{
  "vote": "up" // or "down"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upvotes": 325,
    "downvotes": 12
  }
}
```

### 2. Categories

#### GET /categories
Get all categories

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "uuid",
        "name": "Programming",
        "description": "General programming terms",
        "icon": "code",
        "termCount": 156,
        "order": 1
      }
    ]
  }
}
```

#### GET /categories/:categoryId/terms
Get terms in a specific category

**Query Parameters:**
- `limit` (number, optional): Results per page
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "categoryId": "uuid",
      "name": "Programming"
    },
    "terms": [...],
    "total": 156,
    "hasMore": true
  }
}
```

### 3. User Favorites

#### GET /user/favorites
Get user's favorite terms

**Authentication:** Required

**Query Parameters:**
- `limit` (number, optional): Results per page
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "favoriteId": "uuid",
        "term": {
          "termId": "uuid",
          "term": "API",
          "translation": "..."
        },
        "addedAt": "2024-01-15T10:30:00Z",
        "notes": "Important for my project"
      }
    ],
    "total": 12
  }
}
```

#### POST /user/favorites
Add term to favorites

**Authentication:** Required

**Body:**
```json
{
  "termId": "uuid",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "favoriteId": "uuid",
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### DELETE /user/favorites/:favoriteId
Remove term from favorites

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Favorite removed"
}
```

### 4. Search History

#### GET /user/history
Get user's search history

**Authentication:** Required

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "searchId": "uuid",
        "searchTerm": "kubernetes",
        "resultFound": true,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### DELETE /user/history
Clear search history

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Search history cleared"
}
```

### 5. User Contributions

#### POST /contributions
Submit a new term

**Authentication:** Required

**Body:**
```json
{
  "term": "GraphQL",
  "translation": "A query language for APIs...",
  "funnyTranslation": "SQL's cooler younger sibling...",
  "examples": [
    {
      "technical": "Let's use GraphQL for our API",
      "plain": "Let's use this flexible API query system"
    }
  ],
  "category": "programming",
  "tags": ["api", "query", "facebook"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contributionId": "uuid",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Contribution submitted for review"
}
```

#### GET /user/contributions
Get user's submitted terms

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "contributions": [
      {
        "contributionId": "uuid",
        "term": "GraphQL",
        "status": "pending",
        "submittedAt": "2024-01-15T10:30:00Z",
        "reviewNotes": null
      }
    ]
  }
}
```

### 6. User Profile

#### GET /user/profile
Get user profile

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "subscriptionTier": "pro",
    "subscriptionExpiry": "2024-12-31T23:59:59Z",
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    },
    "stats": {
      "totalSearches": 245,
      "favoriteTermsCount": 12,
      "contributionsCount": 3
    }
  }
}
```

#### PATCH /user/profile
Update user profile

**Authentication:** Required

**Body:**
```json
{
  "displayName": "Jane Doe",
  "preferences": {
    "theme": "light"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated"
}
```

### 7. Subscriptions

#### POST /subscriptions/verify
Verify in-app purchase receipt

**Authentication:** Required

**Body:**
```json
{
  "platform": "ios", // or "android"
  "receipt": "base64-encoded-receipt",
  "productId": "com.nomohieroglyphics.app.pro.monthly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionTier": "pro",
    "expiryDate": "2024-02-15T10:30:00Z",
    "autoRenewing": true
  }
}
```

#### GET /subscriptions/status
Check subscription status

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "isActive": true,
    "subscriptionTier": "pro",
    "expiryDate": "2024-02-15T10:30:00Z",
    "autoRenewing": true,
    "daysRemaining": 30
  }
}
```

### 8. Analytics

#### POST /analytics/event
Track analytics event

**Authentication:** Optional

**Body:**
```json
{
  "eventType": "search",
  "eventData": {
    "query": "kubernetes",
    "resultFound": true
  },
  "deviceInfo": {
    "platform": "ios",
    "version": "1.0.0",
    "model": "iPhone 14 Pro"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked"
}
```

---

## Firebase Cloud Functions Implementation

### Setup
```bash
# Install Firebase tools
npm install -g firebase-tools

# Initialize Cloud Functions
firebase init functions

# Select JavaScript or TypeScript
```

### Example Function
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Search terms
exports.searchTerms = functions.https.onCall(async (data, context) => {
  const { query, category, limit = 20, offset = 0 } = data;
  
  if (!query) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Query is required'
    );
  }
  
  try {
    const db = admin.firestore();
    let termsQuery = db.collection('jargon_terms')
      .where('termLowercase', '>=', query.toLowerCase())
      .where('termLowercase', '<=', query.toLowerCase() + '\uf8ff')
      .orderBy('termLowercase')
      .orderBy('popularity', 'desc')
      .limit(limit);
    
    if (category) {
      termsQuery = termsQuery.where('category', '==', category);
    }
    
    const snapshot = await termsQuery.get();
    const terms = snapshot.docs.map(doc => ({
      termId: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      data: {
        terms,
        total: terms.length,
        hasMore: terms.length === limit
      }
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new functions.https.HttpsError('internal', 'Search failed');
  }
});

// Add to favorites
exports.addFavorite = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }
  
  const { termId, notes } = data;
  const userId = context.auth.uid;
  
  try {
    const db = admin.firestore();
    const favoriteRef = await db.collection('user_favorites').add({
      userId,
      termId,
      notes: notes || '',
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      success: true,
      data: {
        favoriteId: favoriteRef.id
      }
    };
  } catch (error) {
    console.error('Add favorite error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to add favorite');
  }
});

// Verify receipt (iOS)
exports.verifyIOSReceipt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }
  
  const { receipt, productId } = data;
  const userId = context.auth.uid;
  
  try {
    // Verify with Apple
    const response = await fetch('https://buy.itunes.apple.com/verifyReceipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'receipt-data': receipt,
        'password': functions.config().apple.shared_secret,
        'exclude-old-transactions': true
      })
    });
    
    const result = await response.json();
    
    if (result.status === 0) {
      // Valid receipt - update user subscription
      const db = admin.firestore();
      const latestReceipt = result.latest_receipt_info[0];
      
      await db.collection('users').doc(userId).update({
        subscriptionTier: getSubscriptionTier(productId),
        subscriptionExpiry: new Date(parseInt(latestReceipt.expires_date_ms)),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return {
        success: true,
        message: 'Subscription verified'
      };
    } else {
      throw new Error('Invalid receipt');
    }
  } catch (error) {
    console.error('Receipt verification error:', error);
    throw new functions.https.HttpsError('internal', 'Verification failed');
  }
});

// Helper function
function getSubscriptionTier(productId) {
  if (productId.includes('premium')) return 'premium';
  if (productId.includes('pro')) return 'pro';
  return 'free';
}

// Deploy functions
// firebase deploy --only functions
```

---

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

Rate limits per endpoint (per user):
- Search: 100 requests per minute
- Get term: 200 requests per minute
- Add favorite: 20 requests per minute
- Submit contribution: 5 requests per day (free), unlimited (premium)

---

## API Client Example

```javascript
// src/services/api.js
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const API_BASE_URL = 'https://api.nomohieroglyphics.com/v1';

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const user = auth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response) {
          throw new Error(error.response.data.error.message);
        }
        throw error;
      }
    );
  }
  
  // Search terms
  async searchTerms(query, options = {}) {
    return this.client.get('/terms/search', {
      params: { q: query, ...options }
    });
  }
  
  // Get term details
  async getTerm(termId) {
    return this.client.get(`/terms/${termId}`);
  }
  
  // Add to favorites
  async addFavorite(termId, notes) {
    return this.client.post('/user/favorites', { termId, notes });
  }
  
  // Get user favorites
  async getFavorites(options = {}) {
    return this.client.get('/user/favorites', { params: options });
  }
  
  // Submit contribution
  async submitContribution(termData) {
    return this.client.post('/contributions', termData);
  }
}

export default new APIClient();
```

---

## Testing

### Test with Firebase Emulator
```bash
# Start emulators
firebase emulators:start

# Use emulator endpoints in development
const API_BASE_URL = __DEV__
  ? 'http://localhost:5001/your-project/us-central1'
  : 'https://api.nomohieroglyphics.com/v1';
```

---

## Monitoring

### Key Metrics
- Request rate
- Error rate
- Response time
- Active users
- Popular endpoints

### Tools
- Firebase Performance Monitoring
- Google Cloud Monitoring
- Custom logging with Cloud Logging

---

## Versioning

API versioning via URL path:
- `/v1/` - Current version
- `/v2/` - Future version

Maintain backward compatibility for at least 6 months when releasing new versions.
