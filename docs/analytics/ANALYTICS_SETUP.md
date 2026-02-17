# Analytics & Monitoring Setup

## Overview
Complete analytics and monitoring setup for NoMoreHieroglyphics iOS and Android app.

## Firebase Analytics

### Setup

#### Installation
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
cd ios && pod install && cd ..
```

#### iOS Configuration
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to Xcode project root
3. Initialize in AppDelegate

#### Android Configuration
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/`
3. Add to `android/build.gradle`:
```gradle
dependencies {
  classpath 'com.google.gms:google-services:4.3.15'
}
```

4. Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### Event Tracking

#### Core Events
```javascript
import analytics from '@react-native-firebase/analytics';

// App opened
await analytics().logEvent('app_open');

// Search performed
await analytics().logEvent('search', {
  search_term: 'API',
  category: 'Programming'
});

// Translation completed
await analytics().logEvent('translation_complete', {
  input_length: 150,
  terms_found: 5,
  mode: 'direct_decode'
});

// Subscription started
await analytics().logEvent('subscription_started', {
  plan: 'pro_monthly',
  price: 9.99,
  currency: 'USD'
});
```

#### Custom Events
```javascript
// User actions
await analytics().logEvent('term_favorited', { term_id: 'api' });
await analytics().logEvent('tone_sanitizer_used', { text_length: 200 });
await analytics().logEvent('dictionary_browsed', { category: 'DevOps' });

// Engagement
await analytics().logEvent('session_duration', { duration: 300 });
await analytics().logEvent('feature_discovered', { feature: 'tone_sanitizer' });
```

## Crashlytics

### Setup
```bash
npm install @react-native-firebase/crashlytics
```

### Implementation
```javascript
import crashlytics from '@react-native-firebase/crashlytics';

// Log non-fatal errors
try {
  await performTranslation();
} catch (error) {
  crashlytics().recordError(error);
}

// Set user identifier
crashlytics().setUserId(user.id);

// Log custom messages
crashlytics().log('User performed complex search');

// Set custom attributes
crashlytics().setAttribute('subscription_tier', user.tier);
crashlytics().setAttribute('app_version', '1.0.0');
```

## Performance Monitoring

### Setup
```bash
npm install @react-native-firebase/perf
```

### Track Custom Metrics
```javascript
import perf from '@react-native-firebase/perf';

// Track API calls
const trace = await perf().startTrace('api_search');
trace.putAttribute('search_term', 'Docker');

try {
  const result = await searchAPI('Docker');
  trace.putMetric('results_count', result.length);
} finally {
  await trace.stop();
}

// Track screen rendering
const screenTrace = await perf().startTrace('dictionary_screen');
// ... render screen
await screenTrace.stop();
```

## User Properties

```javascript
import analytics from '@react-native-firebase/analytics';

// Set user properties
await analytics().setUserProperty('subscription_tier', 'pro');
await analytics().setUserProperty('signup_date', '2024-01-15');
await analytics().setUserProperty('preferred_language', 'en');
await analytics().setUserProperty('usage_frequency', 'daily');
```

## Revenue Tracking

```javascript
// Track in-app purchases
await analytics().logEvent('purchase', {
  transaction_id: 'T12345',
  value: 9.99,
  currency: 'USD',
  items: [{
    item_id: 'pro_monthly',
    item_name: 'Pro Monthly Subscription',
    item_category: 'Subscription'
  }]
});

// Track ad revenue
await analytics().logEvent('ad_impression', {
  ad_platform: 'admob',
  ad_unit_id: 'ca-app-pub-XXX',
  ad_format: 'interstitial',
  value: 0.05,
  currency: 'USD'
});
```

## App State Monitoring

```javascript
import { AppState } from 'react-native';

let sessionStart = Date.now();

AppState.addEventListener('change', async (nextAppState) => {
  if (nextAppState === 'active') {
    sessionStart = Date.now();
    await analytics().logEvent('app_foreground');
  } else if (nextAppState === 'background') {
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
    await analytics().logEvent('session_end', {
      duration: sessionDuration
    });
  }
});
```

## A/B Testing

```javascript
import remoteConfig from '@react-native-firebase/remote-config';

// Set defaults
await remoteConfig().setDefaults({
  show_onboarding: true,
  max_free_translations: 5,
  enable_beta_features: false
});

// Fetch config
await remoteConfig().fetchAndActivate();

// Get values
const showOnboarding = remoteConfig().getValue('show_onboarding').asBoolean();
const maxFree = remoteConfig().getValue('max_free_translations').asNumber();
```

## Third-Party Analytics

### Mixpanel (Optional)
```bash
npm install mixpanel-react-native
```

```javascript
import { Mixpanel } from 'mixpanel-react-native';

const mixpanel = await Mixpanel.init('YOUR_TOKEN');

// Track events
mixpanel.track('Translation', {
  mode: 'direct_decode',
  terms_count: 5
});

// Set user properties
mixpanel.getPeople().set({
  'Subscription': 'Pro',
  'Signup Date': '2024-01-15'
});
```

## Monitoring Dashboard

### Firebase Console Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User Retention (1-day, 7-day, 30-day)
- Session Duration
- Screen Views
- Conversion Funnels
- Crash-free Users %
- App Performance Scores

### Custom Dashboard
```javascript
// Backend API: GET /api/v1/analytics/dashboard
{
  "period": "last_30_days",
  "metrics": {
    "totalUsers": 10000,
    "activeUsers": 3500,
    "newUsers": 1200,
    "subscriptions": 450,
    "revenue": 4500,
    "translations": 45000,
    "averageSessionDuration": 240,
    "crashFreeRate": 99.5
  }
}
```

## Error Tracking

### Sentry Integration (Optional)
```bash
npm install @sentry/react-native
```

```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production'
});

// Capture exceptions
try {
  performRiskyOperation();
} catch (error) {
  Sentry.captureException(error);
}
```

## Privacy Compliance

### Opt-Out Support
```javascript
import analytics from '@react-native-firebase/analytics';

// Allow users to opt out
const setAnalyticsEnabled = async (enabled) => {
  await analytics().setAnalyticsCollectionEnabled(enabled);
  await AsyncStorage.setItem('analytics_enabled', enabled.toString());
};
```

### GDPR Compliance
- Only collect necessary data
- Anonymize user identifiers where possible
- Provide opt-out mechanism
- Include in privacy policy

## Alerts & Notifications

### Configure Alerts (Firebase Console)
- Crash rate exceeds 1%
- ANR (App Not Responding) rate increases
- Performance degradation detected
- Revenue drops significantly

## Key Metrics to Track

### User Engagement
```javascript
// Daily
- Active users
- Session count
- Session duration
- Feature usage

// Weekly
- User retention
- Churn rate
- New user activation

// Monthly
- Monthly active users
- Lifetime value (LTV)
- Subscription conversion rate
```

### App Health
```javascript
- Crash-free rate (target: > 99%)
- ANR rate (target: < 0.1%)
- Startup time (target: < 2s)
- API response time (target: < 500ms)
```

### Business Metrics
```javascript
- New subscriptions
- Subscription renewal rate
- Ad revenue
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)
```

## Implementation Checklist

- [ ] Firebase Analytics configured
- [ ] Crashlytics enabled
- [ ] Performance monitoring active
- [ ] Core events tracked
- [ ] User properties set
- [ ] Revenue events logged
- [ ] Error tracking implemented
- [ ] A/B testing configured
- [ ] Privacy controls added
- [ ] Analytics opt-out available
- [ ] Dashboard monitoring set up
- [ ] Alerts configured

## Testing

```javascript
// Enable debug mode
await analytics().setAnalyticsCollectionEnabled(true);

// iOS: Run with scheme argument
// -FIRDebugEnabled

// Android: Run command
// adb shell setprop debug.firebase.analytics.app com.nomohieroglyphics.app

// Verify events in DebugView (Firebase Console)
```

This ensures comprehensive monitoring while respecting user privacy.
