# Advertising Integration Guide

## Overview
This guide covers the integration of mobile advertising for the Tech Jargon Translator app.

---

## Advertising Strategy

### Ad Placement Strategy
1. **Banner Ads** - Bottom of search results page (free users)
2. **Interstitial Ads** - Between term lookups (after every 5 searches)
3. **Rewarded Video Ads** - Watch ad to unlock premium term or remove daily limit
4. **Native Ads** - In-feed ads within term lists

### User Experience Guidelines
- Never interrupt active use
- Provide value (rewarded ads)
- Allow ad-free experience via subscription
- Respect user preferences
- Comply with privacy regulations

---

## Recommended Ad Networks

### 1. Google AdMob (Primary - Recommended)
**Pros:**
- Excellent fill rates
- High eCPM
- Easy integration
- Strong mediation platform
- Works well with Firebase
- GDPR/CCPA compliant

**Cons:**
- Requires Google account
- Revenue share

### 2. Facebook Audience Network (Secondary)
**Pros:**
- High-quality ads
- Good eCPM
- Large advertiser base
- Native ads support

**Cons:**
- Requires Facebook developer account
- Privacy concerns

### 3. Unity Ads (For Rewarded Videos)
**Pros:**
- High engagement
- Good for rewarded video
- Cross-promotion opportunities

**Cons:**
- Better for gaming apps

### 4. AdMob Mediation (Recommended)
Use AdMob mediation to maximize revenue by including multiple networks:
- Google AdMob (primary)
- Facebook Audience Network
- Unity Ads
- AppLovin
- ironSource

---

## Google AdMob Setup

### 1. Create AdMob Account
1. Go to [AdMob](https://admob.google.com)
2. Sign in with Google account
3. Accept terms and conditions
4. Complete account setup

### 2. Create AdMob App

#### For iOS:
```
App Name: Tech Jargon Translator
Platform: iOS
App Store URL: [Your App Store URL]
```

#### For Android:
```
App Name: Tech Jargon Translator
Platform: Android
Package Name: com.nomohieroglyphics.app
```

### 3. Create Ad Units

#### Banner Ad Unit
```
Name: Main Banner
Format: Banner (320x50)
Ad Unit ID (iOS): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
Ad Unit ID (Android): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

#### Interstitial Ad Unit
```
Name: Search Interstitial
Format: Interstitial
Ad Unit ID (iOS): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
Ad Unit ID (Android): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

#### Rewarded Video Ad Unit
```
Name: Unlock Premium Term
Format: Rewarded
Ad Unit ID (iOS): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
Ad Unit ID (Android): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

#### Native Ad Unit (Optional)
```
Name: Term List Native Ad
Format: Native Advanced
Ad Unit ID (iOS): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
Ad Unit ID (Android): ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

### 4. App-ads.txt (Important for Revenue)
Add to your website root (https://yourwebsite.com/app-ads.txt):
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

---

## React Native Integration

### Install Dependencies

```bash
# Install AdMob package
npm install @react-native-firebase/admob
npm install @react-native-firebase/app

# iOS setup
cd ios && pod install && cd ..
```

### Configuration

#### iOS Configuration (Info.plist)
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>

<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
  <!-- Add more SKAdNetwork IDs as needed -->
</array>
```

#### Android Configuration (AndroidManifest.xml)
```xml
<manifest>
  <application>
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
  </application>
</manifest>
```

### Environment Configuration
```javascript
// src/config/ads.js
export const ADS_CONFIG = {
  admob: {
    appId: {
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
    },
    banner: {
      ios: __DEV__ 
        ? 'ca-app-pub-3940256099942544/2934735716' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      android: __DEV__
        ? 'ca-app-pub-3940256099942544/6300978111' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    interstitial: {
      ios: __DEV__
        ? 'ca-app-pub-3940256099942544/4411468910' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      android: __DEV__
        ? 'ca-app-pub-3940256099942544/1033173712' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    rewarded: {
      ios: __DEV__
        ? 'ca-app-pub-3940256099942544/1712485313' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      android: __DEV__
        ? 'ca-app-pub-3940256099942544/5224354917' // Test ID
        : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
  },
};
```

---

## Implementation

### Initialize AdMob
```javascript
// src/services/ads.js
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import { Platform } from 'react-native';

export const initializeAds = async () => {
  try {
    await admob().initialize();
    
    // Configure settings
    await admob().setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.PG,
      
      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: false,
      
      // Indicates that you want the ad request to be handled in a manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: false,
      
      // An array of test device IDs to whitelist (for development)
      testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
    });
    
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
};
```

### Banner Ads
```javascript
// src/components/BannerAd.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { ADS_CONFIG } from '../config/ads';
import { useSubscription } from '../hooks/useSubscription';

const BannerAdComponent = () => {
  const { isPremium } = useSubscription();
  
  // Don't show ads to premium users
  if (isPremium) {
    return null;
  }
  
  const adUnitId = Platform.select({
    ios: ADS_CONFIG.admob.banner.ios,
    android: ADS_CONFIG.admob.banner.android,
  });

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default BannerAdComponent;
```

### Interstitial Ads
```javascript
// src/services/interstitialAd.js
import { InterstitialAd, AdEventType, TestIds } from '@react-native-firebase/admob';
import { Platform } from 'react-native';
import { ADS_CONFIG } from '../config/ads';

let interstitialAd = null;
let isLoaded = false;
let searchCount = 0;
const SHOW_AD_EVERY_N_SEARCHES = 5;

const adUnitId = Platform.select({
  ios: ADS_CONFIG.admob.interstitial.ios,
  android: ADS_CONFIG.admob.interstitial.android,
});

export const loadInterstitialAd = () => {
  interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  const eventListener = interstitialAd.onAdEvent((type, error) => {
    if (type === AdEventType.LOADED) {
      isLoaded = true;
      console.log('Interstitial ad loaded');
    }

    if (type === AdEventType.CLOSED) {
      isLoaded = false;
      // Preload next ad
      loadInterstitialAd();
    }

    if (type === AdEventType.ERROR) {
      console.error('Interstitial ad error:', error);
      isLoaded = false;
    }
  });

  interstitialAd.load();

  return () => {
    eventListener();
  };
};

export const showInterstitialAd = async (isPremium) => {
  // Don't show ads to premium users
  if (isPremium) {
    return;
  }
  
  searchCount++;
  
  // Show ad every N searches
  if (searchCount % SHOW_AD_EVERY_N_SEARCHES !== 0) {
    return;
  }

  if (isLoaded && interstitialAd) {
    try {
      await interstitialAd.show();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  } else {
    console.log('Interstitial ad not ready');
  }
};

// Call this on app initialization
export const initInterstitialAd = () => {
  loadInterstitialAd();
};
```

### Rewarded Video Ads
```javascript
// src/services/rewardedAd.js
import { RewardedAd, RewardedAdEventType, TestIds } from '@react-native-firebase/admob';
import { Platform } from 'react-native';
import { ADS_CONFIG } from '../config/ads';

let rewardedAd = null;
let isLoaded = false;

const adUnitId = Platform.select({
  ios: ADS_CONFIG.admob.rewarded.ios,
  android: ADS_CONFIG.admob.rewarded.android,
});

export const loadRewardedAd = () => {
  rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  const eventListener = rewardedAd.onAdEvent((type, error, reward) => {
    if (type === RewardedAdEventType.LOADED) {
      isLoaded = true;
      console.log('Rewarded ad loaded');
    }

    if (type === RewardedAdEventType.EARNED_REWARD) {
      console.log('User earned reward:', reward);
      // Grant user reward (e.g., unlock premium term)
    }

    if (type === RewardedAdEventType.CLOSED) {
      isLoaded = false;
      // Preload next ad
      loadRewardedAd();
    }

    if (type === RewardedAdEventType.ERROR) {
      console.error('Rewarded ad error:', error);
      isLoaded = false;
    }
  });

  rewardedAd.load();

  return () => {
    eventListener();
  };
};

export const showRewardedAd = async (onReward) => {
  if (isLoaded && rewardedAd) {
    try {
      // Set reward callback
      const unsubscribe = rewardedAd.onAdEvent((type, error, reward) => {
        if (type === RewardedAdEventType.EARNED_REWARD) {
          onReward && onReward(reward);
        }
      });

      await rewardedAd.show();
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      throw error;
    }
  } else {
    throw new Error('Rewarded ad not ready');
  }
};

export const isRewardedAdReady = () => isLoaded;

// Call this on app initialization
export const initRewardedAd = () => {
  loadRewardedAd();
};
```

### Usage in Components
```javascript
// src/screens/TermDetailScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { showRewardedAd, isRewardedAdReady } from '../services/rewardedAd';

const TermDetailScreen = ({ term }) => {
  const [unlocked, setUnlocked] = useState(false);
  const { isPremium } = useSubscription();

  const handleWatchAd = async () => {
    if (!isRewardedAdReady()) {
      Alert.alert('Ad Not Ready', 'Please try again in a moment');
      return;
    }

    try {
      await showRewardedAd((reward) => {
        // User earned reward
        setUnlocked(true);
        Alert.alert('Success!', 'Premium content unlocked!');
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to show ad. Please try again.');
    }
  };

  return (
    <View>
      <Text>{term.term}</Text>
      <Text>{term.translation}</Text>
      
      {!isPremium && !unlocked && (
        <Button
          title="Watch Ad to Unlock Funny Translation"
          onPress={handleWatchAd}
        />
      )}
      
      {(isPremium || unlocked) && (
        <Text>{term.funnyTranslation}</Text>
      )}
    </View>
  );
};
```

---

## Privacy & Compliance

### GDPR Compliance (EU Users)

#### User Consent
```javascript
// src/services/consent.js
import { AdsConsent, AdsConsentStatus } from '@react-native-firebase/admob';

export const requestConsent = async () => {
  try {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    
    if (
      consentInfo.isRequestLocationInEeaOrUnknown &&
      consentInfo.status === AdsConsentStatus.UNKNOWN
    ) {
      // Show consent form
      const formResult = await AdsConsent.showForm({
        privacyPolicy: 'https://yourwebsite.com/privacy',
        withPersonalizedAds: true,
        withNonPersonalizedAds: true,
        withAdFree: true,
      });
      
      return formResult;
    }
    
    return consentInfo.status;
  } catch (error) {
    console.error('Consent request error:', error);
    return AdsConsentStatus.UNKNOWN;
  }
};
```

### COPPA Compliance (Children)
```javascript
// If your app targets children under 13
await admob().setRequestConfiguration({
  tagForChildDirectedTreatment: true,
  maxAdContentRating: MaxAdContentRating.G,
});
```

### CCPA Compliance (California)
```javascript
// Allow users to opt-out of personalized ads
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setPersonalizedAdsOptOut = async (optOut) => {
  await AsyncStorage.setItem('ads_opt_out', optOut.toString());
  // Configure ad requests accordingly
};
```

---

## Ad Placement Best Practices

### 1. Search Results Screen
```javascript
// Show banner at bottom
<View style={styles.container}>
  <FlatList
    data={searchResults}
    renderItem={renderTerm}
  />
  <BannerAdComponent />
</View>
```

### 2. After User Actions
```javascript
// Show interstitial after every 5 searches
const handleSearch = async (query) => {
  const results = await searchTerms(query);
  setResults(results);
  
  // Show ad if appropriate
  await showInterstitialAd(isPremium);
};
```

### 3. Rewarded Content
```javascript
// Offer value in exchange for watching ad
<TouchableOpacity onPress={handleWatchAd}>
  <Text>Watch ad to unlock 5 more searches today</Text>
</TouchableOpacity>
```

---

## Testing

### Test Mode
Always use test ad units during development:
```javascript
const adUnitId = __DEV__
  ? TestIds.BANNER // Google's test ID
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // Your production ID
```

### Test Devices
Add your test devices to avoid invalid traffic:
```javascript
await admob().setRequestConfiguration({
  testDeviceIdentifiers: [
    'DEVICE_ID_HERE', // Your test device
    'EMULATOR',
  ],
});
```

### Common Issues
- **No ads showing**: Check internet connection, ad unit IDs
- **Low fill rate**: Normal in some regions, use mediation
- **App rejected**: Ensure compliance with platform policies

---

## Analytics & Optimization

### Track Ad Performance
```javascript
import analytics from '@react-native-firebase/analytics';

// Track ad impressions
const trackAdImpression = async (adType, adUnitId) => {
  await analytics().logEvent('ad_impression', {
    ad_type: adType,
    ad_unit: adUnitId,
  });
};

// Track ad clicks
const trackAdClick = async (adType) => {
  await analytics().logEvent('ad_click', {
    ad_type: adType,
  });
};

// Track rewarded ad completions
const trackRewardedAdComplete = async () => {
  await analytics().logEvent('rewarded_ad_complete', {});
};
```

### Key Metrics to Monitor
- **Impressions**: Number of ads shown
- **Click-through rate (CTR)**: Clicks / Impressions
- **eCPM**: Effective cost per thousand impressions
- **Fill rate**: Ads served / Ads requested
- **Revenue per user (RPU)**: Total revenue / Total users

### Optimization Tips
1. **Use mediation** to maximize fill rates
2. **A/B test ad placements** to find optimal positions
3. **Monitor user experience** - don't over-serve ads
4. **Optimize for eCPM** rather than just CTR
5. **Balance ads and subscriptions** - ads should encourage subscriptions

---

## AdMob Mediation Setup

### Add Mediation Networks
```bash
# Facebook Audience Network
npm install react-native-fbsdk-next

# Unity Ads
npm install @react-native-community/unity-ads

# AppLovin
npm install react-native-applovin-max
```

### Configure in AdMob Console
1. Go to Mediation → Create mediation group
2. Select ad format (Banner, Interstitial, Rewarded)
3. Add ad sources:
   - AdMob Network (always included)
   - Facebook Audience Network
   - Unity Ads
   - Others as needed
4. Set eCPM floors for each network
5. Enable optimized ordering

---

## Checklist

### Pre-Launch
- [ ] AdMob account created
- [ ] App added to AdMob
- [ ] Ad units created for all formats
- [ ] Test ads working in development
- [ ] Production ad unit IDs configured
- [ ] app-ads.txt added to website
- [ ] Privacy policy includes ad disclosure
- [ ] GDPR consent flow implemented (EU)
- [ ] COPPA compliance verified (if applicable)
- [ ] Ad placement optimized
- [ ] Ad frequency capped appropriately
- [ ] Rewarded ads working correctly
- [ ] Premium users don't see ads
- [ ] Analytics tracking implemented

### Post-Launch
- [ ] Monitor fill rates
- [ ] Track revenue metrics
- [ ] Optimize ad placements
- [ ] Set up mediation
- [ ] A/B test ad strategies
- [ ] Respond to user feedback about ads
- [ ] Regularly review policy compliance
- [ ] Update SKAdNetwork IDs as needed
- [ ] Monitor for policy violations

---

## Revenue Expectations

### Typical eCPM Ranges (USD)
- **Banner**: $0.50 - $3.00
- **Interstitial**: $3.00 - $10.00
- **Rewarded Video**: $10.00 - $25.00
- **Native**: $2.00 - $8.00

*Varies significantly by region, ad quality, and user engagement

### Estimated Revenue Example
With 10,000 DAU (Daily Active Users):
- 50% free users = 5,000 ad-supported users
- Average 3 ad impressions per user per day = 15,000 impressions
- Average eCPM of $5 = $75/day = $2,250/month

---

## Support Resources

- [AdMob Help Center](https://support.google.com/admob)
- [React Native Firebase Docs](https://rnfirebase.io/)
- [AdMob Policy Center](https://support.google.com/admob/answer/6128543)
- [Ad Formats Best Practices](https://admob.google.com/home/resources/ad-formats-best-practices/)
