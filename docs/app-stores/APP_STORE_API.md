# App Store & Play Store Integration

## Overview
Backend API integration for mobile app distribution through Apple App Store and Google Play Store.

**Note:** UI is provided by the client. This documentation covers backend requirements only.

---

## iOS App Store

### App Store Connect Configuration

#### App Information
- **App Name:** NoMoreHieroglyphics
- **Bundle ID:** com.nomohieroglyphics.app
- **SKU:** NOMOHIERO001
- **Primary Category:** Productivity
- **Secondary Category:** Education

#### Pricing & Availability
- **Base Price:** Free (with in-app purchases)
- **Availability:** All countries

#### In-App Purchases
```
Product ID: com.nomohieroglyphics.pro_monthly
Type: Auto-Renewable Subscription
Price Tier: 9.99 USD
Duration: 1 month

Product ID: com.nomohieroglyphics.pro_yearly
Type: Auto-Renewable Subscription
Price Tier: 99.99 USD
Duration: 1 year
```

---

### App Store Receipt Validation

#### Endpoint
```
POST /api/v1/billing/verify-receipt/ios
```

#### Request
```json
{
  "receiptData": "base64_encoded_receipt_data",
  "excludeOldTransactions": false
}
```

#### Apple Verification
```javascript
const verifyReceipt = async (receiptData, isProduction) => {
  const endpoint = isProduction 
    ? 'https://buy.itunes.apple.com/verifyReceipt'
    : 'https://sandbox.itunes.apple.com/verifyReceipt';
    
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      'receipt-data': receiptData,
      'password': process.env.IOS_SHARED_SECRET,
      'exclude-old-transactions': false
    })
  });
  
  return await response.json();
};
```

#### Environment Variables
```
IOS_SHARED_SECRET=your_shared_secret_from_app_store_connect
IOS_BUNDLE_ID=com.nomohieroglyphics.app
```

---

### App Store Metadata

#### App Store Listing
```yaml
Name: NoMoreHieroglyphics
Subtitle: Technical Jargon Dictionary
Description: |
  Transform complex technical jargon into clear, professional English.
  
  FEATURES:
  • Direct Decode: Translate technical terms instantly
  • Tone Sanitizer: Remove patronizing language
  • Jargon Dictionary: Searchable technical terms database
  • Professional Communication: Business-appropriate translations
  
  Perfect for professionals working with technical teams who need
  quick, accurate translations without the fluff.

Keywords: technical,dictionary,jargon,translator,professional,developer,programming,decode

Support URL: https://nomohieroglyphics.com/support
Marketing URL: https://nomohieroglyphics.com
Privacy Policy URL: https://nomohieroglyphics.com/privacy
```

#### Screenshots Required
- 6.5" iPhone (1284 x 2778)
- 5.5" iPhone (1242 x 2208)
- 12.9" iPad Pro (2048 x 2732)

#### App Preview Video
- Length: 15-30 seconds
- Shows core functionality
- No music with lyrics

---

### StoreKit Configuration

#### Products.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
    <dict>
        <key>product_id</key>
        <string>com.nomohieroglyphics.pro_monthly</string>
        <key>type</key>
        <string>auto-renewable</string>
        <key>duration</key>
        <string>1 month</string>
    </dict>
    <dict>
        <key>product_id</key>
        <string>com.nomohieroglyphics.pro_yearly</string>
        <key>type</key>
        <string>auto-renewable</string>
        <key>duration</key>
        <string>1 year</string>
    </dict>
</array>
</plist>
```

---

## Google Play Store

### Play Console Configuration

#### App Details
- **App Name:** NoMoreHieroglyphics
- **Package Name:** com.nomohieroglyphics.app
- **Category:** Productivity
- **Content Rating:** Everyone

#### Pricing & Distribution
- **App Price:** Free
- **In-App Products:** Yes
- **Availability:** All countries

#### In-App Products
```
Product ID: pro_monthly
Type: Subscription
Price: $9.99/month
Billing Period: 1 month

Product ID: pro_yearly
Type: Subscription
Price: $99.99/year
Billing Period: 1 year
```

---

### Play Store Receipt Validation

#### Endpoint
```
POST /api/v1/billing/verify-receipt/android
```

#### Request
```json
{
  "purchaseToken": "google_purchase_token",
  "productId": "pro_monthly",
  "packageName": "com.nomohieroglyphics.app"
}
```

#### Google Play Billing API
```javascript
const { google } = require('googleapis');

const verifyAndroidPurchase = async (packageName, productId, token) => {
  const androidpublisher = google.androidpublisher('v3');
  
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
  });
  
  const authClient = await auth.getClient();
  
  const result = await androidpublisher.purchases.subscriptions.get({
    auth: authClient,
    packageName: packageName,
    subscriptionId: productId,
    token: token
  });
  
  return result.data;
};
```

#### Service Account Setup
1. Create service account in Google Cloud Console
2. Download JSON key file
3. Grant access in Play Console
4. Store as environment variable

```
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json
ANDROID_PACKAGE_NAME=com.nomohieroglyphics.app
```

---

### Play Store Listing

#### Store Listing
```yaml
Title: NoMoreHieroglyphics
Short Description: Technical jargon to professional English translator

Full Description: |
  Transform complex technical jargon into clear, professional English.
  
  ✓ Direct Decode: Translate technical terms instantly
  ✓ Tone Sanitizer: Remove patronizing language
  ✓ Jargon Dictionary: Searchable technical terms
  ✓ Professional Communication: Business-appropriate translations
  
  Perfect for professionals working with technical teams who need
  quick, accurate translations without the fluff.
  
  FREE FEATURES:
  • 5 translations per day
  • Basic dictionary access
  
  PRO FEATURES:
  • Unlimited translations
  • Full dictionary
  • Tone sanitizer
  • Priority support
  
  Privacy focused. No data collection beyond necessary operations.

Category: Productivity
Content Rating: Everyone
Contact Email: support@nomohieroglyphics.com
Privacy Policy: https://nomohieroglyphics.com/privacy
```

#### Screenshots Required
- Phone: 1080 x 1920 (at least 2)
- 7-inch Tablet: 1024 x 600 (optional)
- 10-inch Tablet: 1280 x 800 (optional)

#### Feature Graphic
- 1024 x 500
- Shows app logo and key features

---

## Backend API for App Metadata

### GET /api/v1/app/info
Get current app version and update info

**Response:**
```json
{
  "latestVersion": "1.0.5",
  "minimumVersion": "1.0.0",
  "updateRequired": false,
  "updateAvailable": true,
  "releaseNotes": "Bug fixes and performance improvements",
  "storeUrls": {
    "ios": "https://apps.apple.com/app/id...",
    "android": "https://play.google.com/store/apps/details?id=com.nomohieroglyphics.app"
  }
}
```

---

### GET /api/v1/app/features
Get feature flags

**Response:**
```json
{
  "features": {
    "directDecode": true,
    "toneSanitizer": true,
    "jargonDictionary": true,
    "socialSharing": false,
    "offlineMode": true
  },
  "subscriptionRequired": {
    "toneSanitizer": true,
    "unlimitedTranslations": true
  }
}
```

---

## Subscription Groups

### iOS Subscription Group
```
Group Name: NoMoreHieroglyphics Pro
Products:
  - Monthly ($9.99)
  - Yearly ($99.99)
  
Introductory Offers:
  - 7-day free trial (all users)
  
Promotional Offers:
  - 50% off for 3 months (lapsed subscribers)
```

### Android Subscription Base Plan
```
Base Plan: pro_monthly
Offers:
  - Free trial: 7 days
  - Promotional: 50% off first 3 months
```

---

## Webhook Handlers

### iOS App Store Server Notifications
```
Endpoint: POST /api/v1/webhooks/apple
Events:
  - INITIAL_BUY
  - DID_RENEW
  - DID_FAIL_TO_RENEW
  - DID_CHANGE_RENEWAL_STATUS
  - REFUND
```

### Google Play Real-Time Developer Notifications
```
Endpoint: POST /api/v1/webhooks/google
Events:
  - SUBSCRIPTION_PURCHASED
  - SUBSCRIPTION_RENEWED
  - SUBSCRIPTION_CANCELED
  - SUBSCRIPTION_EXPIRED
  - SUBSCRIPTION_RECOVERED
```

---

## Analytics Integration

### Track App Store Events
```javascript
// Track install source
POST /api/v1/analytics/install
{
  "platform": "ios",
  "source": "organic",
  "campaign": null
}

// Track subscription events
POST /api/v1/analytics/subscription
{
  "event": "started",
  "platform": "android",
  "productId": "pro_monthly",
  "price": 9.99,
  "currency": "USD"
}
```

---

## Testing

### iOS TestFlight
```
Build Upload: Xcode Cloud or manual
Beta Testing Groups:
  - Internal Testing (up to 100 testers)
  - External Testing (up to 10,000 testers)
```

### Android Internal Testing
```
Track: Internal Testing
Testers: Up to 100 via email list
Update: Instant (no review)
```

---

## Compliance

### App Store Review Guidelines
- No misleading claims
- Privacy policy required
- Subscription terms clear
- Cancel process visible
- Restore purchases available

### Play Store Requirements
- Target API level 33+
- 64-bit architecture support
- Privacy policy URL
- Data safety form completed
- Permissions justified

---

## Implementation Checklist

### Pre-Submission
- [ ] Bundle ID / Package name registered
- [ ] App icons (all sizes)
- [ ] Screenshots prepared
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] In-app products configured
- [ ] Receipt validation working
- [ ] Webhook handlers ready
- [ ] Analytics integrated

### Post-Submission
- [ ] Monitor reviews
- [ ] Track crashes
- [ ] Verify receipts
- [ ] Check webhook delivery
- [ ] Monitor conversion rates

---

## Support Resources

### App Store Connect
https://appstoreconnect.apple.com

### Google Play Console
https://play.google.com/console

### Documentation
- iOS: https://developer.apple.com/app-store/
- Android: https://developer.android.com/distribute

---

**Note:** All UI elements for app store interactions (subscription screens, restore purchases, etc.) should be implemented by the client application. This documentation covers only the backend API requirements.
