# Database Setup Guide

## Overview
This document outlines the database architecture for the Tech Jargon Translator app.

## Database Technology Selection

### Recommended: Firebase Firestore
**Pros:**
- Real-time synchronization across devices
- Automatic scaling
- Offline support built-in
- Easy integration with authentication
- Free tier available
- No server management required
- Great mobile SDK support

**Cons:**
- Vendor lock-in
- Query limitations compared to SQL
- Cost at scale

### Alternative: PostgreSQL + Supabase
**Pros:**
- Open-source
- Full SQL capabilities
- Self-hostable
- Built-in authentication
- Real-time subscriptions
- PostgreSQL reliability

**Cons:**
- Requires more setup
- Server management (if self-hosted)

### Alternative: MongoDB Atlas
**Pros:**
- Flexible schema
- Great for document storage
- Free tier available
- Good mobile SDK

**Cons:**
- Requires careful indexing
- Learning curve for queries

---

## Database Schema

### Collections/Tables

#### 1. **users**
Stores user profile information
```json
{
  "userId": "string (primary key)",
  "email": "string",
  "displayName": "string",
  "photoURL": "string (optional)",
  "subscriptionTier": "string (free|pro|premium)",
  "subscriptionExpiry": "timestamp",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "preferences": {
    "theme": "string (light|dark|auto)",
    "notifications": "boolean",
    "language": "string"
  },
  "stats": {
    "totalSearches": "number",
    "favoriteTermsCount": "number",
    "contributionsCount": "number"
  }
}
```

#### 2. **jargon_terms**
Main database of tech jargon and translations
```json
{
  "termId": "string (primary key)",
  "term": "string (indexed)",
  "termLowercase": "string (indexed for search)",
  "category": "string (programming|networking|database|cloud|general)",
  "translation": "string",
  "funnyTranslation": "string (lighthearted version)",
  "examples": [
    {
      "technical": "string",
      "plain": "string"
    }
  ],
  "relatedTerms": ["string (termIds)"],
  "difficulty": "string (beginner|intermediate|advanced)",
  "popularity": "number (search count)",
  "tags": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "createdBy": "string (userId)",
  "verified": "boolean",
  "upvotes": "number",
  "downvotes": "number"
}
```

#### 3. **user_favorites**
User's saved/favorited terms
```json
{
  "favoriteId": "string (primary key)",
  "userId": "string (indexed)",
  "termId": "string (indexed)",
  "addedAt": "timestamp",
  "notes": "string (optional)"
}
```

#### 4. **search_history**
Track user searches for analytics and suggestions
```json
{
  "searchId": "string (primary key)",
  "userId": "string (indexed, optional for anonymous)",
  "searchTerm": "string (indexed)",
  "resultFound": "boolean",
  "resultTermId": "string (optional)",
  "timestamp": "timestamp",
  "deviceType": "string (ios|android)"
}
```

#### 5. **user_contributions**
User-submitted terms (for community feature)
```json
{
  "contributionId": "string (primary key)",
  "userId": "string (indexed)",
  "term": "string",
  "translation": "string",
  "funnyTranslation": "string",
  "examples": ["object"],
  "status": "string (pending|approved|rejected)",
  "submittedAt": "timestamp",
  "reviewedAt": "timestamp (optional)",
  "reviewedBy": "string (userId, optional)",
  "reviewNotes": "string (optional)"
}
```

#### 6. **categories**
Manage term categories
```json
{
  "categoryId": "string (primary key)",
  "name": "string",
  "description": "string",
  "icon": "string (icon name)",
  "termCount": "number",
  "order": "number (display order)"
}
```

#### 7. **analytics_events**
Track app usage analytics
```json
{
  "eventId": "string (primary key)",
  "userId": "string (indexed, optional)",
  "eventType": "string (search|view_term|favorite|share|etc)",
  "eventData": "object (flexible structure)",
  "timestamp": "timestamp",
  "deviceInfo": {
    "platform": "string (ios|android)",
    "version": "string",
    "model": "string"
  }
}
```

#### 8. **app_settings**
Global app configuration
```json
{
  "settingKey": "string (primary key)",
  "settingValue": "any",
  "description": "string",
  "updatedAt": "timestamp",
  "updatedBy": "string (admin userId)"
}
```

---

## Firebase Firestore Setup (Recommended)

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore
```

### 2. Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId);
    }
    
    // Jargon terms - read by all, write by admins only
    match /jargon_terms/{termId} {
      allow read: if true;
      allow write: if isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User favorites
    match /user_favorites/{favoriteId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Search history
    match /search_history/{searchId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if true; // Allow anonymous searches
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // User contributions
    match /user_contributions/{contributionId} {
      allow read: if isSignedIn() && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories - read by all
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Analytics - write only
    match /analytics_events/{eventId} {
      allow read: if false; // Analytics read through admin tools only
      allow create: if true;
    }
    
    // App settings - read by all, write by admins
    match /app_settings/{settingKey} {
      allow read: if true;
      allow write: if isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. Indexes
Create these in Firebase Console or firestore.indexes.json:
```json
{
  "indexes": [
    {
      "collectionGroup": "jargon_terms",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "popularity", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "jargon_terms",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "termLowercase", "order": "ASCENDING" },
        { "fieldPath": "popularity", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "search_history",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "user_favorites",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "addedAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 4. Installation
```bash
# Install Firebase SDK
npm install firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install @react-native-firebase/auth
```

### 5. Configuration File
```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## Database Operations Examples

### Create/Insert
```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config/firebase';

// Add a new jargon term
const addTerm = async (termData) => {
  try {
    const docRef = await addDoc(collection(db, 'jargon_terms'), {
      ...termData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding term:', error);
    throw error;
  }
};
```

### Read/Query
```javascript
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Search for terms
const searchTerms = async (searchText) => {
  const q = query(
    collection(db, 'jargon_terms'),
    where('termLowercase', '>=', searchText.toLowerCase()),
    where('termLowercase', '<=', searchText.toLowerCase() + '\uf8ff'),
    orderBy('termLowercase'),
    orderBy('popularity', 'desc'),
    limit(20)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get popular terms
const getPopularTerms = async (limitCount = 10) => {
  const q = query(
    collection(db, 'jargon_terms'),
    orderBy('popularity', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Update
```javascript
import { doc, updateDoc, increment } from 'firebase/firestore';

// Update term popularity
const incrementPopularity = async (termId) => {
  const termRef = doc(db, 'jargon_terms', termId);
  await updateDoc(termRef, {
    popularity: increment(1),
    updatedAt: serverTimestamp()
  });
};
```

### Delete
```javascript
import { doc, deleteDoc } from 'firebase/firestore';

// Delete a favorite
const deleteFavorite = async (favoriteId) => {
  await deleteDoc(doc(db, 'user_favorites', favoriteId));
};
```

---

## Data Seeding

### Initial Jargon Terms (Sample)
```javascript
const initialTerms = [
  {
    term: "API",
    termLowercase: "api",
    category: "programming",
    translation: "Application Programming Interface - A way for different software programs to talk to each other",
    funnyTranslation: "The secret handshake that lets apps gossip with each other",
    examples: [
      {
        technical: "We need to integrate with the payment API",
        plain: "We need to connect our app to the payment system"
      }
    ],
    difficulty: "beginner",
    tags: ["integration", "interface", "communication"],
    verified: true,
    popularity: 0,
    upvotes: 0,
    downvotes: 0
  },
  {
    term: "Docker",
    termLowercase: "docker",
    category: "cloud",
    translation: "A tool that packages software and all its dependencies into a standardized container",
    funnyTranslation: "A magical lunchbox that makes your code work anywhere",
    examples: [
      {
        technical: "Let's dockerize this application",
        plain: "Let's package this app so it works the same everywhere"
      }
    ],
    difficulty: "intermediate",
    tags: ["containers", "deployment", "devops"],
    verified: true,
    popularity: 0,
    upvotes: 0,
    downvotes: 0
  }
  // Add more terms...
];
```

---

## Backup and Disaster Recovery

### Automated Backups (Firebase)
```javascript
// Cloud Function for daily backups
const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

exports.scheduledFirestoreBackup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    
    return client.exportDocuments({
      name: databaseName,
      outputUriPrefix: `gs://${projectId}-firestore-backups`,
      collectionIds: []
    });
  });
```

### Manual Export
```bash
# Export Firestore data
gcloud firestore export gs://[BUCKET_NAME]

# Import Firestore data
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

---

## Performance Optimization

### 1. Indexing Strategy
- Index frequently queried fields
- Composite indexes for multi-field queries
- Monitor slow queries in Firebase Console

### 2. Caching
```javascript
// Use React Native AsyncStorage for caching
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheKey = 'popular_terms';
const CACHE_DURATION = 3600000; // 1 hour

const getPopularTermsWithCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.log('Cache read error:', error);
  }
  
  // Fetch from Firestore
  const terms = await getPopularTerms();
  
  // Cache the result
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify({
      data: terms,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.log('Cache write error:', error);
  }
  
  return terms;
};
```

### 3. Pagination
```javascript
import { query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

let lastVisible = null;

const getNextPage = async () => {
  let q = query(
    collection(db, 'jargon_terms'),
    orderBy('term'),
    limit(20)
  );
  
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }
  
  const documentSnapshots = await getDocs(q);
  lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  
  return documentSnapshots.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

---

## Security Best Practices

1. **Never expose API keys in code** - Use environment variables
2. **Implement proper security rules** - Test with Firebase emulator
3. **Validate all user input** - Both client and server-side
4. **Rate limiting** - Prevent abuse of database queries
5. **Audit logs** - Track administrative changes
6. **Regular backups** - Automated daily backups
7. **Monitor usage** - Set up alerts for unusual activity

---

## Migration Strategy

If you need to migrate from one database to another:

1. **Set up new database** alongside old one
2. **Dual-write period** - Write to both databases
3. **Migrate historical data** - Background process
4. **Verify data integrity** - Compare both databases
5. **Switch reads** to new database
6. **Monitor** for issues
7. **Deprecate old database** after stabilization

---

## Monitoring and Maintenance

### Key Metrics to Track
- Query performance (average response time)
- Database size and growth rate
- Number of reads/writes per day
- Error rates
- Popular search terms
- Cache hit rates

### Regular Maintenance Tasks
- Review and optimize indexes monthly
- Clean up old analytics data (>90 days)
- Review security rules quarterly
- Update database schema as needed
- Performance testing before major releases
