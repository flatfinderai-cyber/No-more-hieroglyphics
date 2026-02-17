# Advertising Setup - Mobile App

## Overview
Complete advertising integration for NoMoreHieroglyphics iOS and Android app using Google AdMob.

**Note:** Backend API provides ad configuration. User provides custom UI for ad display.

## Google AdMob Setup

### 1. Create AdMob Account
1. Go to https://admob.google.com
2. Sign up with Google account
3. Create new app
   - App name: NoMoreHieroglyphics
   - Platform: iOS and Android
   - App Store URL (after publishing)

### 2. Ad Unit IDs

#### iOS Ad Units
```
App ID: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY

Banner Ad: ca-app-pub-XXXXXXXXXXXXXXXX/1111111111
Interstitial Ad: ca-app-pub-XXXXXXXXXXXXXXXX/2222222222
Rewarded Video Ad: ca-app-pub-XXXXXXXXXXXXXXXX/3333333333
```

#### Android Ad Units
```
App ID: ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ

Banner Ad: ca-app-pub-XXXXXXXXXXXXXXXX/4444444444
Interstitial Ad: ca-app-pub-XXXXXXXXXXXXXXXX/5555555555
Rewarded Video Ad: ca-app-pub-XXXXXXXXXXXXXXXX/6666666666
```

### 3. Test Ad Units
```javascript
// Use these during development
const TEST_AD_UNITS = {
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313'
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
  }
};
```

## React Native Integration

### Installation
```bash
npm install react-native-google-mobile-ads
cd ios && pod install && cd ..
```

### iOS Configuration (Info.plist)
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY</string>

<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
  <!-- Add more SKAdNetwork IDs -->
</array>
```

### Android Configuration (AndroidManifest.xml)
```xml
<manifest>
  <application>
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ"/>
  </application>
</manifest>
```

## Ad Implementation

### Banner Ads
```javascript
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : Platform.OS === 'ios' 
    ? 'ca-app-pub-XXX/111' 
    : 'ca-app-pub-XXX/444';

function BannerAdComponent() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true // GDPR compliance
      }}
    />
  );
}
```

### Interstitial Ads
```javascript
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : Platform.OS === 'ios' 
    ? 'ca-app-pub-XXX/222' 
    : 'ca-app-pub-XXX/555';

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

// Load ad
interstitial.load();

// Show ad
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  interstitial.show();
});
```

### Rewarded Video Ads
```javascript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.REWARDED 
  : Platform.OS === 'ios' 
    ? 'ca-app-pub-XXX/333' 
    : 'ca-app-pub-XXX/666';

const rewarded = RewardedAd.createForAdRequest(adUnitId);

rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
  rewarded.show();
});

rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
  console.log('User earned reward:', reward);
  // Grant user the reward (e.g., remove daily limit)
});

rewarded.load();
```

## Ad Placement Strategy

### Free Tier
```javascript
const AD_STRATEGY = {
  free: {
    banner: {
      show: true,
      locations: ['bottom_of_screen'],
      refreshRate: 60 // seconds
    },
    interstitial: {
      show: true,
      frequency: 'every_5_searches',
      cooldown: 300 // seconds
    },
    rewarded: {
      show: true,
      offer: 'Watch ad for 10 extra translations today'
    }
  },
  pro: {
    banner: { show: false },
    interstitial: { show: false },
    rewarded: { show: false }
  }
};
```

### Implementation
```javascript
// Check subscription status before showing ads
const shouldShowAd = async () => {
  const user = await getCurrentUser();
  return user.subscriptionTier === 'free';
};

// Show interstitial after certain actions
let searchCount = 0;
const onSearch = async () => {
  searchCount++;
  
  if (await shouldShowAd() && searchCount % 5 === 0) {
    showInterstitialAd();
  }
};
```

## GDPR & Privacy Compliance

### Consent Management
```javascript
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

const requestConsent = async () => {
  const consentInfo = await AdsConsent.requestInfoUpdate();
  
  if (consentInfo.isConsentFormAvailable) {
    const { status } = await AdsConsent.showForm();
    
    return status === AdsConsentStatus.OBTAINED;
  }
  
  return false;
};

// Call on app launch
useEffect(() => {
  requestConsent();
}, []);
```

### Non-Personalized Ads
```javascript
// For users who decline consent
const adRequest = {
  requestNonPersonalizedAdsOnly: true
};
```

## Revenue Optimization

### Ad Mediation
```javascript
// Configure mediation in AdMob console
const mediationNetworks = [
  'Facebook Audience Network',
  'Unity Ads',
  'AppLovin',
  'ironSource'
];
```

### eCPM Optimization
- Test different ad formats
- A/B test ad placements
- Monitor fill rates
- Adjust frequency caps

## Analytics Integration

### Track Ad Events
```javascript
import analytics from '@react-native-firebase/analytics';

const trackAdEvent = async (eventName, params) => {
  await analytics().logEvent(eventName, params);
};

// Track ad impressions
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  trackAdEvent('ad_impression', {
    ad_type: 'interstitial',
    ad_unit_id: adUnitId
  });
});

// Track ad revenue
interstitial.addAdEventListener(AdEventType.PAID, event => {
  trackAdEvent('ad_revenue', {
    value: event.value,
    currency: event.currency,
    ad_type: 'interstitial'
  });
});
```

## Backend API Integration

### GET /api/v1/ads/config
Get ad configuration for user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "showAds": true,
  "adUnits": {
    "banner": "ca-app-pub-XXX/111",
    "interstitial": "ca-app-pub-XXX/222",
    "rewarded": "ca-app-pub-XXX/333"
  },
  "frequency": {
    "interstitial": 5,
    "cooldown": 300
  }
}
```

### POST /api/v1/ads/reward
Validate rewarded ad completion

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "adUnitId": "ca-app-pub-XXX/333",
  "rewardType": "extra_translations",
  "rewardAmount": 10
}
```

**Response:**
```json
{
  "success": true,
  "newLimit": 15,
  "expiresAt": "2024-02-17T23:59:59Z"
}
```

## Testing Checklist

- [ ] Test ads show correctly on iOS
- [ ] Test ads show correctly on Android
- [ ] Banner ads don't overlap content
- [ ] Interstitial ads respect frequency caps
- [ ] Rewarded ads grant correct rewards
- [ ] Ads don't show for Pro users
- [ ] GDPR consent works in EU
- [ ] Test ad IDs work in development
- [ ] Production ad IDs configured
- [ ] Analytics tracking ads correctly

## App Store Requirements

### iOS App Store
- AdMob SDK included in privacy details
- Advertising Identifier (IDFA) usage declared
- App Tracking Transparency (ATT) implemented

### Google Play Store
- Ad policy compliance confirmed
- Google Play Families policy (if applicable)
- Ads clearly distinguishable from content

## Troubleshooting

### Ads Not Showing
1. Check ad unit IDs are correct
2. Verify AdMob account approved
3. Wait 24-48 hours after setup
4. Check test ads work first
5. Verify internet connection

### Low Fill Rate
1. Enable mediation
2. Add more ad networks
3. Check geographic targeting
4. Review ad formats

## Revenue Estimates

### Free Tier Users (with ads)
```
Daily Active Users: 1,000
Impressions per User: 10
eCPM: $2.00
Daily Revenue: $20
Monthly Revenue: $600
```

This is a baseline - actual revenue varies by geography and user engagement.
