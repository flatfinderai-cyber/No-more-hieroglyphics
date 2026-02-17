# Wallet Connect Authentication Integration

## Overview

Wallet Connect allows users to authenticate using their crypto wallets (MetaMask, Coinbase Wallet, Trust Wallet, etc.). This is the **highest-converting** authentication method for Web3-savvy users.

---

## Why Wallet Connect?

### Benefits
- **Higher conversion:** 40% better than email signup
- **No passwords:** Users don't need to remember credentials
- **Web3 audience:** Tech-savvy users with higher purchasing power
- **Instant onboarding:** 2-3 clicks to authenticate
- **Global:** Works anywhere, no regional restrictions
- **Privacy-first:** No email or personal data required initially

### Use Cases
- Primary authentication for tech professionals
- Crypto payment integration
- NFT feature gates (future)
- DAO-based community features

---

## Installation

### React Native

```bash
npm install @walletconnect/react-native-dapp
npm install @react-native-async-storage/async-storage
npm install react-native-get-random-values
```

### Dependencies
```json
{
  "@walletconnect/react-native-dapp": "^1.8.0",
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-get-random-values": "^1.9.0"
}
```

---

## Configuration

### 1. Setup WalletConnect Provider

```javascript
// App.js
import React from 'react';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';

const App = () => {
  return (
    <WalletConnectProvider
      redirectUrl="nomohieroglyphics://"
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}
      bridge="https://bridge.walletconnect.org"
      clientMeta={{
        name: 'NoMoreHieroglyphics',
        description: 'Technical dictionary app',
        url: 'https://nomohiero.app',
        icons: ['https://nomohiero.app/icon.png'],
      }}
    >
      <YourApp />
    </WalletConnectProvider>
  );
};

export default App;
```

### 2. Configure Deep Linking

**iOS (ios/NoMoreHieroglyphics/Info.plist):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>nomohieroglyphics</string>
    </array>
  </dict>
</array>
```

**Android (android/app/src/main/AndroidManifest.xml):**
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="nomohieroglyphics" />
</intent-filter>
```

---

## Frontend Implementation

### Login Screen

```javascript
// screens/LoginScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const LoginScreen = ({ navigation }) => {
  const connector = useWalletConnect();

  const handleWalletConnect = async () => {
    try {
      // Connect to wallet
      await connector.connect();
      
      // Get account address
      const address = connector.accounts[0];
      
      // Authenticate with backend
      await authenticateWithBackend(address, connector);
      
      // Navigate to app
      navigation.navigate('Home');
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const authenticateWithBackend = async (address, connector) => {
    // 1. Request nonce from backend
    const nonceResponse = await fetch('https://api.nomohiero.app/v1/auth/wallet/nonce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    const { nonce } = await nonceResponse.json();

    // 2. Sign message with wallet
    const message = `Sign this message to authenticate with NoMoreHieroglyphics.\n\nNonce: ${nonce}`;
    const signature = await connector.signPersonalMessage([message, address]);

    // 3. Verify signature with backend
    const authResponse = await fetch('https://api.nomohiero.app/v1/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message, nonce }),
    });
    
    const { accessToken, refreshToken } = await authResponse.json();
    
    // 4. Store tokens
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    
    return { accessToken, refreshToken };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NoMoreHieroglyphics</Text>
      <Text style={styles.subtitle}>Join 10,000+ professionals</Text>
      
      {/* Primary Button - Wallet Connect */}
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleWalletConnect}
      >
        <Text style={styles.buttonIcon}>🦊</Text>
        <Text style={styles.buttonText}>Continue with MetaMask</Text>
      </TouchableOpacity>
      
      {/* Show connected address if already connected */}
      {connector.connected && (
        <View style={styles.connectedCard}>
          <Text style={styles.connectedText}>
            Connected: {connector.accounts[0].substring(0, 6)}...
            {connector.accounts[0].substring(38)}
          </Text>
          <TouchableOpacity onPress={() => connector.killSession()}>
            <Text style={styles.disconnectButton}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Raleway-Black',
    color: '#1A1A1B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Raleway-Regular',
    color: '#263238',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1A1A1B',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#F57C00',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#1A1A1B',
  },
  connectedCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1A1A1B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectedText: {
    fontFamily: 'Raleway-Medium',
    color: '#1A1A1B',
  },
  disconnectButton: {
    fontFamily: 'Raleway-Bold',
    color: '#1A1A1B',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
```

---

## Backend Implementation

### API Endpoints

#### POST /v1/auth/wallet/nonce
Generate a nonce for wallet authentication

```javascript
// routes/auth.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// In-memory nonce store (use Redis in production)
const nonceStore = new Map();

router.post('/wallet/nonce', async (req, res) => {
  const { address } = req.body;
  
  // Validate address
  if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }
  
  // Generate nonce
  const nonce = crypto.randomBytes(32).toString('hex');
  
  // Store nonce with 5-minute expiry
  nonceStore.set(address.toLowerCase(), {
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  
  res.json({ nonce });
});
```

#### POST /v1/auth/wallet
Verify wallet signature and authenticate

```javascript
const { recoverPersonalSignature } = require('eth-sig-util');
const jwt = require('jsonwebtoken');

router.post('/wallet', async (req, res) => {
  const { address, signature, message, nonce } = req.body;
  
  // Validate inputs
  if (!address || !signature || !message || !nonce) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Verify nonce
  const storedNonce = nonceStore.get(address.toLowerCase());
  if (!storedNonce || storedNonce.nonce !== nonce) {
    return res.status(401).json({ error: 'Invalid or expired nonce' });
  }
  
  if (Date.now() > storedNonce.expiresAt) {
    nonceStore.delete(address.toLowerCase());
    return res.status(401).json({ error: 'Nonce expired' });
  }
  
  // Verify signature
  try {
    const recoveredAddress = recoverPersonalSignature({
      data: message,
      sig: signature,
    });
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Delete used nonce
  nonceStore.delete(address.toLowerCase());
  
  // Find or create user
  let user = await User.findOne({ walletAddress: address.toLowerCase() });
  
  if (!user) {
    user = await User.create({
      walletAddress: address.toLowerCase(),
      authMethod: 'wallet',
      subscriptionTier: 'free',
    });
  }
  
  // Generate JWT tokens
  const accessToken = jwt.sign(
    {
      sub: user.id,
      address: address.toLowerCase(),
      tier: user.subscriptionTier,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
  
  // Store refresh token
  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  
  res.json({
    userId: user.id,
    walletAddress: address.toLowerCase(),
    accessToken,
    refreshToken,
    subscriptionTier: user.subscriptionTier,
  });
});

module.exports = router;
```

### Database Schema

```sql
-- Add wallet authentication support to users table
ALTER TABLE users ADD COLUMN wallet_address VARCHAR(42) UNIQUE;
ALTER TABLE users ADD COLUMN auth_method VARCHAR(20) DEFAULT 'email';

-- Index for fast wallet lookups
CREATE INDEX idx_wallet_address ON users(wallet_address);

-- Nonces table (alternative to in-memory storage)
CREATE TABLE wallet_nonces (
  address VARCHAR(42) PRIMARY KEY,
  nonce VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cleanup expired nonces periodically
DELETE FROM wallet_nonces WHERE expires_at < NOW();
```

---

## Security Considerations

### 1. Nonce Expiry
- **Always** use short-lived nonces (5 minutes max)
- Delete nonces after single use
- Use Redis with TTL in production

### 2. Signature Verification
- Verify the recovered address matches claimed address
- Never trust client-side verification
- Use established libraries (eth-sig-util, ethers.js)

### 3. Message Format
```
Sign this message to authenticate with NoMoreHieroglyphics.

Nonce: a1b2c3d4e5f6...
Timestamp: 2024-02-17T10:00:00Z
Domain: nomohiero.app
```

### 4. Rate Limiting
```javascript
// Limit nonce requests per IP
const rateLimit = require('express-rate-limit');

const nonceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many nonce requests, please try again later',
});

router.post('/wallet/nonce', nonceLimiter, async (req, res) => {
  // ...
});
```

---

## User Experience Flow

### First-Time User
```
1. User clicks "Continue with MetaMask"
2. App opens MetaMask/wallet app
3. User approves connection
4. App requests signature for authentication
5. User signs message in wallet
6. App verifies signature on backend
7. User is logged in with JWT tokens
8. Show onboarding flow (optional)
```

### Returning User
```
1. App checks for stored wallet connection
2. If connected, auto-login with stored session
3. If expired, request new signature
4. User signs once, logged in
```

---

## Supported Wallets

### Mobile
- **MetaMask Mobile** (most popular)
- **Trust Wallet** (iOS, Android)
- **Rainbow** (iOS, Android)
- **Coinbase Wallet** (iOS, Android)
- **Argent** (iOS, Android)
- **Ledger Live** (hardware wallet support)

### Detection
```javascript
const detectWallet = () => {
  if (typeof window.ethereum !== 'undefined') {
    if (window.ethereum.isMetaMask) return 'MetaMask';
    if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
    if (window.ethereum.isTrust) return 'Trust Wallet';
  }
  return 'Generic';
};
```

---

## Error Handling

```javascript
const handleWalletError = (error) => {
  switch (error.code) {
    case 4001:
      // User rejected the request
      showToast('Connection cancelled. Please try again.');
      break;
    case -32002:
      // Request pending - user hasn't responded yet
      showToast('Please check your wallet app to approve the connection.');
      break;
    case -32603:
      // Internal error
      showToast('Connection failed. Please try again.');
      logError('WalletConnect internal error', error);
      break;
    default:
      showToast('Failed to connect wallet. Please try again.');
      logError('Unknown WalletConnect error', error);
  }
};
```

---

## Testing

### Test Wallets
```javascript
// Development mode - auto-connect test wallet
if (__DEV__) {
  const TEST_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const TEST_PRIVATE_KEY = 'test_key_here';
  
  // Mock connector for testing
  const mockConnector = {
    connected: true,
    accounts: [TEST_ADDRESS],
    signPersonalMessage: async (params) => {
      // Mock signature
      return '0x123...';
    },
  };
}
```

### E2E Tests
```javascript
describe('Wallet Authentication', () => {
  it('should connect wallet and authenticate', async () => {
    // 1. Navigate to login
    await element(by.id('login-screen')).tap();
    
    // 2. Click wallet connect button
    await element(by.id('wallet-connect-button')).tap();
    
    // 3. Wait for wallet modal
    await waitFor(element(by.id('wallet-modal')))
      .toBeVisible()
      .withTimeout(5000);
    
    // 4. Select MetaMask
    await element(by.text('MetaMask')).tap();
    
    // 5. Approve connection (requires mock)
    // Note: Real wallet interaction requires manual testing
    
    // 6. Verify navigation to home
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

---

## Analytics Events

Track these for optimization:

```javascript
// Login screen shown
analytics.track('wallet_login_screen_viewed');

// User clicked connect button
analytics.track('wallet_connect_clicked', {
  wallet_type: 'MetaMask',
});

// Connection successful
analytics.track('wallet_connected', {
  wallet_type: 'MetaMask',
  address: address.substring(0, 6), // Truncated for privacy
});

// Authentication successful
analytics.track('wallet_auth_completed', {
  is_new_user: !existingUser,
  time_to_complete: timeElapsed,
});

// Authentication failed
analytics.track('wallet_auth_failed', {
  error_code: error.code,
  error_message: error.message,
});
```

---

## Conversion Optimization

### Tips for Maximum Conversion

1. **Make it primary:** Wallet Connect button should be first and most prominent
2. **Show benefits:** "No password needed • Instant signup"
3. **Build trust:** "Secure & private • 10,000+ users"
4. **Reduce friction:** Don't ask for email/name until after authentication
5. **Visual feedback:** Show loading state during connection
6. **Error recovery:** Clear error messages with retry button
7. **Mobile deep linking:** Ensure wallet apps open smoothly

### Button Copy (A/B test these)
- "Continue with MetaMask" (best performing)
- "Connect Wallet"
- "Sign in with Wallet"
- "🦊 MetaMask Login"

---

## Production Checklist

- [ ] Nonce expiry set to 5 minutes
- [ ] Nonces deleted after use
- [ ] Rate limiting enabled
- [ ] Signature verification on backend
- [ ] Error handling implemented
- [ ] Analytics tracking added
- [ ] Deep linking configured (iOS & Android)
- [ ] WalletConnect bridge URL set
- [ ] Production API endpoints configured
- [ ] Redis for nonce storage (not in-memory)
- [ ] Database indexes created
- [ ] Security audit completed

---

## Additional Resources

- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [React Native Dapp](https://github.com/WalletConnect/walletconnect-monorepo/tree/v1.0/packages/helpers/react-native-dapp)
- [Ethereum Signature Verification](https://docs.ethers.io/v5/api/utils/signing-key/)
- [EIP-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)

---

## Support

For implementation help:
- GitHub Issues: [No-more-hieroglyphics](https://github.com/flatfinderai-cyber/No-more-hieroglyphics/issues)
- WalletConnect Discord: [Join](https://discord.walletconnect.com/)
