# Billing & Payments Setup Guide

## Overview
This guide covers the setup of in-app purchases and subscriptions for both iOS and Android platforms.

---

## Monetization Strategy

### Freemium Model (Recommended)
- **Free Tier**: Basic features, limited searches per day, ads
- **Pro Tier**: $2.99/month or $29.99/year - No ads, unlimited searches, offline mode
- **Premium Tier**: $4.99/month or $49.99/year - All Pro features + community contributions, advanced examples

### One-Time Purchases (Optional)
- Remove Ads: $1.99
- Term Packs: $0.99 per specialized category (e.g., "Cloud Computing Terms", "AI/ML Jargon")

---

## iOS In-App Purchases (Apple)

### Prerequisites
- Apple Developer Account
- Signed agreement for Paid Applications
- Banking and tax information completed in App Store Connect

### Setup in App Store Connect

#### 1. Navigate to In-App Purchases
- Go to App Store Connect
- Select your app
- Click "In-App Purchases" in sidebar

#### 2. Create Subscription Group
```
Group Name: Tech Jargon Translator Subscriptions
Reference Name: TechJargonSubs
```

#### 3. Create Subscriptions

##### Pro Monthly Subscription
```
Reference Name: pro_monthly
Product ID: com.nomohieroglyphics.app.pro.monthly
Duration: 1 Month
Introductory Offer: 7 days free trial
Price: $2.99 USD
```

##### Pro Annual Subscription
```
Reference Name: pro_annual
Product ID: com.nomohieroglyphics.app.pro.annual
Duration: 1 Year
Introductory Offer: 14 days free trial
Price: $29.99 USD (save 17%)
```

##### Premium Monthly Subscription
```
Reference Name: premium_monthly
Product ID: com.nomohieroglyphics.app.premium.monthly
Duration: 1 Month
Introductory Offer: 7 days free trial
Price: $4.99 USD
```

##### Premium Annual Subscription
```
Reference Name: premium_annual
Product ID: com.nomohieroglyphics.app.premium.annual
Duration: 1 Year
Introductory Offer: 14 days free trial
Price: $49.99 USD (save 17%)
```

#### 4. Create Consumable/Non-Consumable Products

##### Remove Ads (Non-Consumable)
```
Reference Name: remove_ads
Product ID: com.nomohieroglyphics.app.removeads
Type: Non-Consumable
Price: $1.99 USD
```

##### Term Packs (Consumable)
```
Reference Name: cloud_terms_pack
Product ID: com.nomohieroglyphics.app.pack.cloud
Type: Consumable
Price: $0.99 USD
```

#### 5. Localization
Add localized display names and descriptions for major markets:
- English (US, UK, Australia)
- Spanish (Spain, Mexico)
- French (France, Canada)
- German
- Japanese
- Chinese (Simplified, Traditional)

#### 6. Screenshot for Review
Upload screenshots showing:
- Subscription selection screen
- Purchase confirmation
- Premium features in use

### iOS Implementation

#### Install Dependencies
```bash
npm install react-native-iap
cd ios && pod install && cd ..
```

#### Configuration
```javascript
// src/services/iap.ios.js
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'com.nomohieroglyphics.app.pro.monthly',
    'com.nomohieroglyphics.app.pro.annual',
    'com.nomohieroglyphics.app.premium.monthly',
    'com.nomohieroglyphics.app.premium.annual',
    'com.nomohieroglyphics.app.removeads',
  ],
});

// Initialize IAP
export const initIAP = async () => {
  try {
    await RNIap.initConnection();
    console.log('IAP initialized');
  } catch (err) {
    console.warn('IAP initialization error:', err);
  }
};

// Get available products
export const getProducts = async () => {
  try {
    const products = await RNIap.getProducts({ skus: itemSkus });
    return products;
  } catch (err) {
    console.warn('Get products error:', err);
    return [];
  }
};

// Get available subscriptions
export const getSubscriptions = async () => {
  try {
    const subscriptions = await RNIap.getSubscriptions({ skus: itemSkus });
    return subscriptions;
  } catch (err) {
    console.warn('Get subscriptions error:', err);
    return [];
  }
};

// Purchase subscription
export const purchaseSubscription = async (sku) => {
  try {
    await RNIap.requestSubscription({ sku });
  } catch (err) {
    console.warn('Purchase error:', err);
    throw err;
  }
};

// Purchase product
export const purchaseProduct = async (sku) => {
  try {
    await RNIap.requestPurchase({ sku });
  } catch (err) {
    console.warn('Purchase error:', err);
    throw err;
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases;
  } catch (err) {
    console.warn('Restore purchases error:', err);
    return [];
  }
};

// Verify receipt with your backend
export const verifyReceipt = async (receipt) => {
  try {
    const response = await fetch('https://your-api.com/verify-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receipt }),
    });
    return await response.json();
  } catch (err) {
    console.warn('Receipt verification error:', err);
    throw err;
  }
};

// Clean up on unmount
export const endIAP = async () => {
  try {
    await RNIap.endConnection();
  } catch (err) {
    console.warn('IAP end connection error:', err);
  }
};
```

#### Purchase Listener
```javascript
// src/services/purchaseListener.js
import { purchaseUpdatedListener, purchaseErrorListener } from 'react-native-iap';

export const setupPurchaseListener = () => {
  const purchaseUpdateSubscription = purchaseUpdatedListener(
    async (purchase) => {
      const receipt = purchase.transactionReceipt;
      
      if (receipt) {
        try {
          // Verify receipt with your backend
          await verifyReceipt(receipt);
          
          // Grant access to premium features
          await unlockPremiumFeatures(purchase.productId);
          
          // Acknowledge purchase
          if (Platform.OS === 'ios') {
            await RNIap.finishTransaction({ purchase });
          }
          
          console.log('Purchase successful:', purchase);
        } catch (err) {
          console.error('Purchase verification failed:', err);
        }
      }
    }
  );

  const purchaseErrorSubscription = purchaseErrorListener(
    (error) => {
      console.warn('Purchase error:', error);
      // Show error to user
    }
  );

  return () => {
    purchaseUpdateSubscription.remove();
    purchaseErrorSubscription.remove();
  };
};
```

---

## Android In-App Billing (Google Play)

### Prerequisites
- Google Play Developer Account
- App published (at least in internal testing)
- Payment profile set up

### Setup in Google Play Console

#### 1. Navigate to Monetization
- Open Google Play Console
- Select your app
- Go to "Monetize" → "Products" → "Subscriptions"

#### 2. Create Subscription Products

##### Pro Monthly
```
Product ID: pro_monthly
Name: Pro Monthly
Description: Unlimited searches, no ads, offline mode
Billing Period: Monthly
Price: $2.99 USD
Free Trial: 7 days
Grace Period: 3 days
```

##### Pro Annual
```
Product ID: pro_annual
Name: Pro Annual
Description: Unlimited searches, no ads, offline mode
Billing Period: Yearly
Price: $29.99 USD
Free Trial: 14 days
Grace Period: 3 days
```

##### Premium Monthly
```
Product ID: premium_monthly
Name: Premium Monthly
Description: All Pro features + community access
Billing Period: Monthly
Price: $4.99 USD
Free Trial: 7 days
```

##### Premium Annual
```
Product ID: premium_annual
Name: Premium Annual
Description: All Pro features + community access
Billing Period: Yearly
Price: $49.99 USD
Free Trial: 14 days
```

#### 3. Create One-Time Products
Go to "Products" → "In-app products"

##### Remove Ads
```
Product ID: remove_ads
Name: Remove Ads
Description: Remove all advertisements permanently
Price: $1.99 USD
```

#### 4. Base Plans and Offers
For each subscription, create:
- Base plan (standard pricing)
- Introductory offer (free trial)
- Optional: Promotional offers for existing users

### Android Implementation

#### Update build.gradle
```gradle
// android/app/build.gradle
dependencies {
    implementation 'com.android.billingclient:billing:5.2.1'
}
```

#### Configuration (Same as iOS)
```javascript
// The react-native-iap library works for both platforms
// Use the same implementation as iOS section
```

#### Platform-Specific Product IDs
```javascript
const itemSkus = Platform.select({
  android: [
    'pro_monthly',
    'pro_annual',
    'premium_monthly',
    'premium_annual',
    'remove_ads',
  ],
  ios: [
    'com.nomohieroglyphics.app.pro.monthly',
    'com.nomohieroglyphics.app.pro.annual',
    'com.nomohieroglyphics.app.premium.monthly',
    'com.nomohieroglyphics.app.premium.annual',
    'com.nomohieroglyphics.app.removeads',
  ],
});
```

---

## Backend Receipt Verification

### Why Backend Verification?
- Prevent fraud and hacking
- Secure subscription status
- Handle subscription events (renewal, cancellation)
- Cross-platform access validation

### Receipt Verification Service

#### iOS Receipt Verification
```javascript
// Backend: Node.js example
const verifyIOSReceipt = async (receipt, isProduction = true) => {
  const endpoint = isProduction
    ? 'https://buy.itunes.apple.com/verifyReceipt'
    : 'https://sandbox.itunes.apple.com/verifyReceipt';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'receipt-data': receipt,
      'password': process.env.APPLE_SHARED_SECRET, // From App Store Connect
      'exclude-old-transactions': true
    })
  });
  
  const data = await response.json();
  
  // Status codes: 0 = valid, 21007 = sandbox receipt, etc.
  if (data.status === 21007) {
    // Retry with sandbox
    return verifyIOSReceipt(receipt, false);
  }
  
  return data;
};
```

#### Android Receipt Verification
```javascript
// Backend: Node.js example with Google Play Developer API
const { google } = require('googleapis');

const verifyAndroidPurchase = async (packageName, productId, purchaseToken) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  
  const androidpublisher = google.androidpublisher({
    version: 'v3',
    auth: auth,
  });
  
  try {
    const result = await androidpublisher.purchases.subscriptions.get({
      packageName: packageName,
      subscriptionId: productId,
      token: purchaseToken,
    });
    
    return result.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};
```

### Database Schema for Purchases
```javascript
// Add to your database
{
  "purchaseId": "string",
  "userId": "string",
  "platform": "string (ios|android)",
  "productId": "string",
  "purchaseType": "string (subscription|one-time)",
  "transactionId": "string",
  "purchaseToken": "string",
  "purchaseDate": "timestamp",
  "expiryDate": "timestamp (for subscriptions)",
  "isActive": "boolean",
  "autoRenewing": "boolean",
  "verificationData": "object",
  "lastVerified": "timestamp"
}
```

---

## Webhook Handlers (Server-to-Server Notifications)

### iOS App Store Server Notifications
```javascript
// Backend endpoint: POST /webhooks/apple
const handleAppleNotification = async (req, res) => {
  const notification = req.body;
  
  switch (notification.notification_type) {
    case 'INITIAL_BUY':
      await handleNewSubscription(notification);
      break;
    case 'DID_RENEW':
      await handleRenewal(notification);
      break;
    case 'DID_FAIL_TO_RENEW':
      await handleFailedRenewal(notification);
      break;
    case 'CANCEL':
      await handleCancellation(notification);
      break;
    case 'REFUND':
      await handleRefund(notification);
      break;
    // Handle other notification types...
  }
  
  res.status(200).send('OK');
};
```

### Google Play Real-time Developer Notifications
```javascript
// Backend endpoint: POST /webhooks/google
const handleGoogleNotification = async (req, res) => {
  const message = JSON.parse(
    Buffer.from(req.body.message.data, 'base64').toString()
  );
  
  switch (message.notificationType) {
    case 1: // SUBSCRIPTION_RECOVERED
      await handleSubscriptionRecovered(message);
      break;
    case 2: // SUBSCRIPTION_RENEWED
      await handleRenewal(message);
      break;
    case 3: // SUBSCRIPTION_CANCELED
      await handleCancellation(message);
      break;
    case 4: // SUBSCRIPTION_PURCHASED
      await handleNewSubscription(message);
      break;
    case 13: // SUBSCRIPTION_EXPIRED
      await handleExpiration(message);
      break;
    // Handle other notification types...
  }
  
  res.status(200).send('OK');
};
```

---

## UI Components

### Subscription Selection Screen
```javascript
// src/screens/SubscriptionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getSubscriptions, purchaseSubscription } from '../services/iap';

const SubscriptionScreen = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const subs = await getSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    
    try {
      await purchaseSubscription(selectedPlan.productId);
      // Purchase success handled by listener
    } catch (error) {
      console.error('Purchase failed:', error);
      // Show error to user
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      
      {subscriptions.map((sub) => (
        <TouchableOpacity
          key={sub.productId}
          style={[
            styles.planCard,
            selectedPlan?.productId === sub.productId && styles.selectedPlan
          ]}
          onPress={() => setSelectedPlan(sub)}
        >
          <Text style={styles.planName}>{sub.title}</Text>
          <Text style={styles.planPrice}>{sub.localizedPrice}</Text>
          <Text style={styles.planDescription}>{sub.description}</Text>
          {sub.introductoryPrice && (
            <Text style={styles.trial}>
              {sub.introductoryPrice} - Free Trial!
            </Text>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handlePurchase}
        disabled={!selectedPlan}
      >
        <Text style={styles.subscribeButtonText}>Subscribe</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => {/* Restore purchases */}}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## Testing

### iOS Testing (Sandbox)
1. Create sandbox test accounts in App Store Connect
2. Sign out of App Store on device
3. Run app and make test purchase
4. Sign in with sandbox account when prompted
5. Test subscription renewal (accelerated in sandbox)

### Android Testing
1. Add test accounts in Google Play Console
2. Use license testing features
3. Test with internal testing track
4. Verify purchases in Google Play Console

### Test Scenarios
- [ ] New subscription purchase
- [ ] Free trial activation
- [ ] Subscription renewal
- [ ] Subscription cancellation
- [ ] Restore purchases
- [ ] Receipt verification
- [ ] Expired subscription handling
- [ ] Failed payment handling
- [ ] Refund handling

---

## Legal Requirements

### Required Disclosures
1. **Terms of Service** - Subscription terms, cancellation policy
2. **Privacy Policy** - How payment data is handled
3. **Auto-renewal Terms** - Clear disclosure of auto-renewal
4. **Cancellation Instructions** - Easy to find and understand
5. **Pricing Display** - Clear pricing in local currency
6. **Contact Information** - Support email for billing issues

### App Store Requirements
- Clear description of subscription benefits
- Cancellation instructions in app description
- Links to terms and privacy policy
- Proper implementation of restore purchases

---

## Analytics and Monitoring

### Key Metrics
- Conversion rate (free to paid)
- Monthly recurring revenue (MRR)
- Annual recurring revenue (ARR)
- Churn rate
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Trial conversion rate

### Revenue Analytics Integration
```javascript
// Track subscription events
import analytics from '@react-native-firebase/analytics';

const trackSubscriptionPurchase = async (productId, price, currency) => {
  await analytics().logEvent('purchase', {
    currency: currency,
    value: price,
    items: [{
      item_id: productId,
      item_name: getProductName(productId),
      item_category: 'subscription'
    }]
  });
};
```

---

## Support and Refunds

### Handling Refund Requests
- iOS: Users request through App Store, Apple handles
- Android: Users request through Play Store, you can approve/deny
- Always revoke premium access after refund
- Track refund rates to identify issues

### Customer Support
- Dedicated billing support email
- FAQ section in app
- Troubleshooting guide for common issues
- Clear cancellation instructions

---

## Checklist

### Pre-Launch
- [ ] In-app products created in App Store Connect
- [ ] Subscriptions created in Google Play Console
- [ ] Pricing tested in multiple regions
- [ ] Backend verification service deployed
- [ ] Webhooks configured and tested
- [ ] Purchase UI implemented and tested
- [ ] Restore purchases functionality working
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Cancellation instructions accessible
- [ ] Sandbox/test purchases verified
- [ ] Analytics tracking implemented

### Post-Launch
- [ ] Monitor conversion rates
- [ ] Track revenue metrics
- [ ] Respond to billing support requests
- [ ] Handle refund requests appropriately
- [ ] A/B test pricing if needed
- [ ] Optimize subscription offers
- [ ] Review and respond to billing-related reviews
