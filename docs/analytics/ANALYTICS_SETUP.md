# Analytics & Monitoring Setup Guide

## Overview
This guide covers analytics, monitoring, and observability setup for the Tech Jargon Translator app.

---

## Analytics Strategy

### Key Metrics to Track

#### User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Session frequency
- Retention rate (Day 1, Day 7, Day 30)
- Churn rate

#### Feature Usage
- Search queries performed
- Terms viewed
- Favorites added
- Contributions submitted
- Share actions

#### Business Metrics
- Free to paid conversion rate
- Subscription renewal rate
- Revenue per user (ARPU)
- Lifetime value (LTV)
- Customer acquisition cost (CAC)

#### Performance Metrics
- App load time
- Search response time
- Crash-free rate
- API response times
- Network errors

---

## Firebase Analytics

### Setup

```bash
# Install Firebase Analytics
npm install @react-native-firebase/analytics

# iOS setup
cd ios && pod install && cd ..
```

### Implementation

```javascript
// src/services/analytics.js
import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  // Log screen views
  async logScreenView(screenName, screenClass) {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass
    });
  }

  // Log custom events
  async logEvent(eventName, params = {}) {
    await analytics().logEvent(eventName, params);
  }

  // Set user properties
  async setUserProperty(name, value) {
    await analytics().setUserProperty(name, value);
  }

  // Set user ID
  async setUserId(userId) {
    await analytics().setUserId(userId);
  }

  // App-specific events
  async logSearch(query, resultCount) {
    await analytics().logEvent('search', {
      search_term: query,
      result_count: resultCount
    });
  }

  async logTermView(termId, termName, category) {
    await analytics().logEvent('view_item', {
      item_id: termId,
      item_name: termName,
      item_category: category
    });
  }

  async logFavoriteAdd(termId, termName) {
    await analytics().logEvent('add_to_wishlist', {
      item_id: termId,
      item_name: termName
    });
  }

  async logShare(method, termName) {
    await analytics().logEvent('share', {
      method: method,
      content_type: 'term',
      item_id: termName
    });
  }

  async logPurchase(productId, value, currency) {
    await analytics().logEvent('purchase', {
      transaction_id: Date.now().toString(),
      value: value,
      currency: currency,
      items: [{
        item_id: productId,
        item_name: this.getProductName(productId),
        item_category: 'subscription',
        price: value
      }]
    });
  }

  async logSignUp(method) {
    await analytics().logEvent('sign_up', {
      method: method
    });
  }

  async logLogin(method) {
    await analytics().logEvent('login', {
      method: method
    });
  }

  getProductName(productId) {
    const productNames = {
      'pro_monthly': 'Pro Monthly',
      'pro_annual': 'Pro Annual',
      'premium_monthly': 'Premium Monthly',
      'premium_annual': 'Premium Annual',
      'remove_ads': 'Remove Ads'
    };
    return productNames[productId] || productId;
  }
}

export default new AnalyticsService();
```

---

## Privacy Considerations

### GDPR Compliance
- Allow users to opt out of analytics
- Anonymize personal data
- Provide data export functionality
- Honor deletion requests

### Implementation

```javascript
// src/services/privacySettings.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

class PrivacySettings {
  async setAnalyticsEnabled(enabled) {
    await AsyncStorage.setItem('analytics_enabled', enabled.toString());
    await analytics().setAnalyticsCollectionEnabled(enabled);
  }

  async isAnalyticsEnabled() {
    const enabled = await AsyncStorage.getItem('analytics_enabled');
    return enabled !== 'false'; // Enabled by default
  }
}

export default new PrivacySettings();
```

---

## Checklist

### Initial Setup
- [ ] Firebase Analytics configured
- [ ] Crashlytics integrated
- [ ] Performance monitoring enabled
- [ ] Custom events defined
- [ ] Screen view tracking implemented
- [ ] User properties set

### Advanced Features
- [ ] Remote Config set up
- [ ] A/B tests configured
- [ ] Alerts configured
- [ ] Data export automated
- [ ] Privacy controls implemented
- [ ] Feedback mechanism added

### Monitoring
- [ ] Daily metrics review process
- [ ] Weekly performance review
- [ ] Monthly trend analysis
- [ ] Quarterly goal setting
- [ ] Alert response procedures defined
