# Authentication Setup Guide

## Overview
This guide covers user authentication and authorization for the Tech Jargon Translator app.

---

## Authentication Strategy

### Recommended: Firebase Authentication
**Why Firebase Auth?**
- Easy integration with Firebase services (Firestore, Analytics)
- Multiple authentication providers
- Secure and scalable
- Built-in user management
- No backend code required
- Free generous tier

### Supported Authentication Methods
1. **Email/Password** - Traditional signup
2. **Google Sign-In** - OAuth integration
3. **Apple Sign-In** - Required for iOS (if using social login)
4. **Anonymous Authentication** - Try before signup
5. **Phone Authentication** - Optional for verification

---

## Firebase Authentication Setup

### 1. Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to "Authentication" → "Sign-in method"
4. Enable desired authentication providers

### 2. Enable Sign-In Providers

#### Email/Password
```
Status: Enabled
Email link (passwordless sign-in): Optional
```

#### Google Sign-In
```
Status: Enabled
Project support email: your-email@domain.com
```

#### Apple Sign-In (Required for iOS if using social login)
```
Status: Enabled
Services ID: com.nomohieroglyphics.app.signin
```

#### Anonymous Sign-In
```
Status: Enabled
(Useful for trial before requiring signup)
```

---

## React Native Implementation

### Install Dependencies

```bash
# Firebase Authentication
npm install @react-native-firebase/auth

# Google Sign-In
npm install @react-native-google-signin/google-signin

# Apple Sign-In (iOS only)
npm install @invertase/react-native-apple-authentication

# iOS setup
cd ios && pod install && cd ..
```

### Configuration

#### iOS Configuration

##### Info.plist
```xml
<!-- Google Sign-In -->
<key>GIDClientID</key>
<string>YOUR-IOS-CLIENT-ID.apps.googleusercontent.com</string>

<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR-IOS-CLIENT-ID</string>
    </array>
  </dict>
</array>
```

##### Capabilities
Enable "Sign In with Apple" capability in Xcode:
1. Open Xcode workspace
2. Select target → "Signing & Capabilities"
3. Click "+ Capability"
4. Add "Sign In with Apple"

#### Android Configuration

##### android/build.gradle
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

##### android/app/build.gradle
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

##### Download google-services.json
1. Go to Firebase Console
2. Project Settings → Your Apps → Android app
3. Download google-services.json
4. Place in `android/app/` directory

---

## Authentication Service Implementation

### Auth Service
```javascript
// src/services/auth.js
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';

// Initialize Google Sign-In
export const initializeAuth = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com',
  });
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    
    // Update profile with display name
    await userCredential.user.updateProfile({
      displayName: displayName,
    });
    
    // Send email verification
    await userCredential.user.sendEmailVerification();
    
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Get user's ID token
    const { idToken } = await GoogleSignin.signIn();
    
    // Create Google credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
    // Sign in to Firebase
    const userCredential = await auth().signInWithCredential(googleCredential);
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign in with Apple (iOS only)
export const signInWithApple = async () => {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign-In is only available on iOS');
  }
  
  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    
    // Create Apple credential
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );
    
    // Sign in to Firebase
    const userCredential = await auth().signInWithCredential(appleCredential);
    
    // Update profile if name is provided
    if (appleAuthRequestResponse.fullName) {
      const { givenName, familyName } = appleAuthRequestResponse.fullName;
      if (givenName) {
        await userCredential.user.updateProfile({
          displayName: `${givenName} ${familyName || ''}`.trim(),
        });
      }
    }
    
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign in anonymously
export const signInAnonymously = async () => {
  try {
    const userCredential = await auth().signInAnonymously();
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Link anonymous account to email/password
export const linkAnonymousAccount = async (email, password) => {
  try {
    const user = auth().currentUser;
    if (!user || !user.isAnonymous) {
      throw new Error('No anonymous user to link');
    }
    
    const credential = auth.EmailAuthProvider.credential(email, password);
    const userCredential = await user.linkWithCredential(credential);
    
    // Send verification email
    await userCredential.user.sendEmailVerification();
    
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign out
export const signOut = async () => {
  try {
    // Sign out from Google if signed in
    const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    if (isGoogleSignedIn) {
      await GoogleSignin.signOut();
    }
    
    // Sign out from Firebase
    await auth().signOut();
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Update email
export const updateEmail = async (newEmail) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await user.updateEmail(newEmail);
    await user.sendEmailVerification();
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await user.updatePassword(newPassword);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Update profile
export const updateProfile = async (updates) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await user.updateProfile(updates);
    return user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await user.delete();
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Re-authenticate user (required for sensitive operations)
export const reauthenticate = async (password) => {
  try {
    const user = auth().currentUser;
    if (!user || !user.email) {
      throw new Error('No user logged in');
    }
    
    const credential = auth.EmailAuthProvider.credential(user.email, password);
    await user.reauthenticateWithCredential(credential);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Error handler
const handleAuthError = (error) => {
  console.error('Auth error:', error);
  
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/user-disabled': 'This account has been disabled',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',
    'auth/requires-recent-login': 'Please sign in again to complete this action',
  };
  
  const message = errorMessages[error.code] || error.message || 'Authentication failed';
  return new Error(message);
};

// Get current user
export const getCurrentUser = () => {
  return auth().currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return auth().currentUser !== null;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};
```

---

## Auth Context Provider

```javascript
// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, getCurrentUser } from '../services/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Load user profile from Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      
      if (initializing) {
        setInitializing(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [initializing]);

  const loadUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Create new user profile
        const newProfile = {
          userId: userId,
          email: getCurrentUser()?.email,
          displayName: getCurrentUser()?.displayName || '',
          photoURL: getCurrentUser()?.photoURL || '',
          subscriptionTier: 'free',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: 'auto',
            notifications: true,
            language: 'en',
          },
          stats: {
            totalSearches: 0,
            favoriteTermsCount: 0,
            contributionsCount: 0,
          },
        };
        
        await setDoc(doc(db, 'users', userId), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
    isPremium: userProfile?.subscriptionTier === 'pro' || 
               userProfile?.subscriptionTier === 'premium',
    refreshProfile: () => user && loadUserProfile(user.uid),
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## UI Components

### Sign In Screen
```javascript
// src/screens/SignInScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signInAnonymously,
} from '../services/auth';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Navigation handled by AuthContext
    } catch (error) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Apple Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymously();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text>OR</Text>
      </View>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.anonymousButton}
        onPress={handleAnonymousSignIn}
        disabled={loading}
      >
        <Text style={styles.linkText}>Try without signing in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpLink}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.linkText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Sign Up Screen
```javascript
// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signUpWithEmail } from '../services/auth';

const SignUpScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName);
      Alert.alert(
        'Success!',
        'Account created. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.linkText}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## Security Best Practices

### 1. Password Requirements
```javascript
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  if (password.length < minLength) {
    return 'Password must be at least 8 characters';
  }
  if (!hasUpperCase || !hasLowerCase) {
    return 'Password must contain uppercase and lowercase letters';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  
  return null; // Valid
};
```

### 2. Email Verification
```javascript
// Check if email is verified before allowing certain actions
const requireEmailVerification = (user) => {
  if (!user.emailVerified) {
    Alert.alert(
      'Email Not Verified',
      'Please verify your email address to continue',
      [
        { text: 'Resend Email', onPress: () => user.sendEmailVerification() },
        { text: 'OK' },
      ]
    );
    return false;
  }
  return true;
};
```

### 3. Session Management
```javascript
// Implement session timeout
let lastActivity = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const checkSession = () => {
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    signOut();
    Alert.alert('Session Expired', 'Please sign in again');
  }
};

// Update last activity on user interaction
const updateActivity = () => {
  lastActivity = Date.now();
};
```

### 4. Rate Limiting
```javascript
// Implement rate limiting for sensitive operations
const rateLimiter = {
  attempts: 0,
  lastAttempt: Date.now(),
  maxAttempts: 5,
  resetTime: 15 * 60 * 1000, // 15 minutes
  
  checkLimit() {
    const now = Date.now();
    if (now - this.lastAttempt > this.resetTime) {
      this.attempts = 0;
    }
    
    if (this.attempts >= this.maxAttempts) {
      throw new Error('Too many attempts. Please try again later.');
    }
    
    this.attempts++;
    this.lastAttempt = now;
  }
};
```

---

## Account Linking

### Link Anonymous to Permanent Account
```javascript
// src/screens/UpgradeAccountScreen.js
const handleUpgrade = async () => {
  try {
    await linkAnonymousAccount(email, password);
    Alert.alert(
      'Success!',
      'Your account has been upgraded. Your data has been saved.',
      [{ text: 'OK' }]
    );
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert(
        'Email Already Registered',
        'Would you like to merge your data with the existing account?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Merge', onPress: handleMerge },
        ]
      );
    } else {
      Alert.alert('Error', error.message);
    }
  }
};
```

---

## Protected Routes

```javascript
// src/navigation/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignInScreen from '../screens/SignInScreen';

const ProtectedRoute = ({ children, requirePremium = false }) => {
  const { isAuthenticated, isPremium, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  if (requirePremium && !isPremium) {
    return <SubscriptionScreen />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## Analytics Integration

```javascript
// Track authentication events
import analytics from '@react-native-firebase/analytics';

export const trackSignUp = async (method) => {
  await analytics().logSignUp({ method });
};

export const trackSignIn = async (method) => {
  await analytics().logLogin({ method });
};

export const trackSignOut = async () => {
  await analytics().logEvent('sign_out');
};
```

---

## Testing

### Test Accounts
Create test accounts for development:
- test@example.com / password123
- testgoogle@example.com (Google OAuth)
- testapple@example.com (Apple Sign-In)

### Test Scenarios
- [ ] Email/password sign up
- [ ] Email/password sign in
- [ ] Google Sign-In
- [ ] Apple Sign-In (iOS)
- [ ] Anonymous sign in
- [ ] Link anonymous to permanent
- [ ] Password reset
- [ ] Email verification
- [ ] Sign out
- [ ] Update profile
- [ ] Update password
- [ ] Delete account
- [ ] Session persistence
- [ ] Error handling

---

## Troubleshooting

### Common Issues

**Google Sign-In not working:**
- Verify webClientId is correct
- Check SHA-1 certificate in Firebase Console
- Ensure Google Sign-In is enabled in Firebase

**Apple Sign-In not working:**
- Enable capability in Xcode
- Verify Services ID in Apple Developer
- Check bundle ID matches

**Email not verified:**
- Check spam folder
- Resend verification email
- Use development mode for testing

---

## Checklist

### Pre-Launch
- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in configured
- [ ] Google Sign-In configured (iOS & Android)
- [ ] Apple Sign-In configured (iOS)
- [ ] Anonymous auth enabled
- [ ] Email verification implemented
- [ ] Password reset flow working
- [ ] Account linking implemented
- [ ] Session management configured
- [ ] Protected routes implemented
- [ ] Error handling comprehensive
- [ ] Analytics tracking added
- [ ] Privacy policy includes auth data handling
- [ ] Terms of service created

### Post-Launch
- [ ] Monitor sign-up conversion rate
- [ ] Track authentication method usage
- [ ] Monitor failed login attempts
- [ ] Review security logs regularly
- [ ] Update authentication policies as needed
- [ ] Handle user account issues promptly
