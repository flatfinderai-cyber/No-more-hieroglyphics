# Deployment Guide

## Overview
This guide covers the deployment process for the Tech Jargon Translator mobile app to production environments.

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console warnings or errors
- [ ] Code reviewed and approved
- [ ] No hardcoded credentials or secrets
- [ ] Environment variables properly configured
- [ ] Error handling implemented
- [ ] Analytics integrated
- [ ] Crash reporting configured

### Performance
- [ ] App loads in < 3 seconds
- [ ] No memory leaks detected
- [ ] Images optimized
- [ ] Bundle size optimized
- [ ] Network requests optimized
- [ ] Offline functionality tested

### Security
- [ ] API endpoints secured
- [ ] Authentication properly implemented
- [ ] Sensitive data encrypted
- [ ] Security audit completed
- [ ] Third-party dependencies audited
- [ ] SSL/TLS configured

### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance verified (EU)
- [ ] COPPA compliance verified (if applicable)
- [ ] App Store guidelines reviewed
- [ ] Play Store policies reviewed

---

## Environment Configuration

### Development
```bash
NODE_ENV=development
API_BASE_URL=https://dev-api.nomohieroglyphics.com/v1
FIREBASE_PROJECT_ID=nomohieroglyphics-dev
```

### Staging
```bash
NODE_ENV=staging
API_BASE_URL=https://staging-api.nomohieroglyphics.com/v1
FIREBASE_PROJECT_ID=nomohieroglyphics-staging
```

### Production
```bash
NODE_ENV=production
API_BASE_URL=https://api.nomohieroglyphics.com/v1
FIREBASE_PROJECT_ID=nomohieroglyphics-prod
```

---

## iOS Deployment

### 1. Prepare for Release

#### Update Version Numbers
In `ios/NoMoreHieroglyphics/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

Or use command:
```bash
cd ios
agvtool new-marketing-version 1.0.0
agvtool new-version -all 1
```

#### Configure Release Scheme
1. Open Xcode
2. Product → Scheme → Edit Scheme
3. Select "Release" for Run, Test, Analyze, Archive

### 2. Generate App Icon
1. Create 1024x1024 px icon
2. Use [App Icon Generator](https://appicon.co)
3. Place generated icons in `ios/NoMoreHieroglyphics/Images.xcassets/AppIcon.appiconset/`

### 3. Configure Signing
1. In Xcode, select project
2. Select target → Signing & Capabilities
3. Enable "Automatically manage signing"
4. Select your development team
5. Verify bundle identifier matches App Store Connect

### 4. Create Archive
```bash
# Clean build
cd ios
xcodebuild clean
cd ..

# Archive from Xcode:
# Product → Archive
# Wait for archive to complete
```

### 5. Upload to App Store Connect
1. Once archive completes, Organizer opens automatically
2. Select archive → Distribute App
3. Choose "App Store Connect"
4. Upload
5. Wait for processing (10-60 minutes)

### 6. Submit for Review
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → Version
3. Select the build that was uploaded
4. Fill in all required information:
   - Screenshots
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
5. Answer questionnaire:
   - Export compliance
   - Advertising identifier usage
   - Content rights
6. Submit for review

### 7. TestFlight Distribution (Optional)
Before production:
1. In App Store Connect → TestFlight
2. Add internal testers (up to 100)
3. Add external testers (up to 10,000)
4. Collect feedback
5. Fix issues
6. Submit updated build

---

## Android Deployment

### 1. Prepare for Release

#### Update Version
In `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### Generate Upload Key
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Store in android/app/
# DO NOT commit this to git!
```

#### Configure Signing
In `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

In `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. Generate Release Build

#### Android App Bundle (Recommended)
```bash
cd android
./gradlew clean
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### APK (Alternative)
```bash
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### 3. Test Release Build
```bash
# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Check for issues:
# - App launches correctly
# - No crashes
# - All features working
# - Performance acceptable
```

### 4. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select app → Production
3. Create new release
4. Upload AAB file
5. Add release notes:
   ```
   Version 1.0.0
   - Initial release
   - Tech jargon translation
   - Search functionality
   - User favorites
   - Subscription options
   ```
6. Review release
7. Rollout to production

### 5. Internal Testing (Optional)
Before production:
1. Go to Testing → Internal testing
2. Create release
3. Add testers via email or Google Group
4. Share test link
5. Collect feedback
6. Fix issues

### 6. Staged Rollout
Gradually release to users:
1. Start with 10% rollout
2. Monitor for 24-48 hours
3. Check for crashes and errors
4. Increase to 25%, 50%, 100%
5. Halt rollout if issues detected

---

## Backend Deployment

### Firebase Cloud Functions

#### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Initialize Functions
```bash
firebase init functions
# Select JavaScript or TypeScript
# Install dependencies
```

#### Deploy Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:functionName

# Set environment variables
firebase functions:config:set someservice.key="THE API KEY"
```

#### Monitor Functions
```bash
# View logs
firebase functions:log

# View logs for specific function
firebase functions:log --only functionName
```

### Firebase Hosting (for website)
```bash
# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Environment Configuration
```bash
# Set production config
firebase functions:config:set \
  apple.shared_secret="YOUR_SECRET" \
  google.client_id="YOUR_CLIENT_ID" \
  admob.app_id="YOUR_APP_ID"

# View current config
firebase functions:config:get
```

---

## Database Deployment

### Firestore Security Rules
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Test rules
firebase emulators:start --only firestore
```

### Database Indexes
```bash
# Deploy indexes
firebase deploy --only firestore:indexes
```

### Data Migration
```javascript
// scripts/migrateData.js
const admin = require('firebase-admin');
admin.initializeApp();

async function migrateData() {
  const db = admin.firestore();
  
  // Example: Add field to all documents
  const snapshot = await db.collection('jargon_terms').get();
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { 
      verified: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log('Migration complete');
}

migrateData().catch(console.error);
```

---

## CI/CD Pipeline

### GitHub Actions

#### iOS Build
```yaml
# .github/workflows/ios.yml
name: iOS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install pods
        run: cd ios && pod install
      
      - name: Build iOS
        run: |
          xcodebuild -workspace ios/NoMoreHieroglyphics.xcworkspace \
            -scheme NoMoreHieroglyphics \
            -configuration Release \
            -destination 'generic/platform=iOS' \
            clean build
```

#### Android Build
```yaml
# .github/workflows/android.yml
name: Android Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Setup JDK
        uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: '11'
      
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease
```

### Fastlane (Advanced)

#### Install Fastlane
```bash
sudo gem install fastlane -NV
```

#### iOS Fastlane
```ruby
# ios/Fastfile
default_platform(:ios)

platform :ios do
  desc "Push a new release build to App Store"
  lane :release do
    increment_build_number(xcodeproj: "NoMoreHieroglyphics.xcodeproj")
    build_app(scheme: "NoMoreHieroglyphics")
    upload_to_app_store
  end
  
  desc "Submit a new Beta Build to TestFlight"
  lane :beta do
    build_app(scheme: "NoMoreHieroglyphics")
    upload_to_testflight
  end
end
```

#### Android Fastlane
```ruby
# android/Fastfile
default_platform(:android)

platform :android do
  desc "Deploy a new version to the Google Play"
  lane :deploy do
    gradle(task: "clean bundleRelease")
    upload_to_play_store
  end
  
  desc "Submit a new Beta Build to Play Store"
  lane :beta do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(track: 'beta')
  end
end
```

---

## Monitoring & Analytics

### Firebase Crashlytics
```bash
# Install
npm install @react-native-firebase/crashlytics

# iOS setup
cd ios && pod install && cd ..

# Force crash for testing
import crashlytics from '@react-native-firebase/crashlytics';
crashlytics().crash();
```

### Firebase Analytics
```javascript
import analytics from '@react-native-firebase/analytics';

// Track events
await analytics().logEvent('app_opened');
await analytics().logEvent('term_searched', {
  term: 'kubernetes'
});
```

### Performance Monitoring
```javascript
import perf from '@react-native-firebase/perf';

// Measure custom trace
const trace = await perf().startTrace('search_term');
// ... perform search ...
await trace.stop();
```

### Error Tracking with Sentry (Alternative)
```bash
npm install @sentry/react-native

# Initialize
npx @sentry/wizard -i reactNative -p ios android
```

---

## Post-Deployment

### 1. Monitor Initial Release
- Watch for crashes in first 24 hours
- Monitor user reviews
- Track key metrics (installs, crashes, errors)
- Be ready to hotfix critical issues

### 2. Gather Feedback
- App Store reviews
- In-app feedback mechanism
- User surveys
- Analytics data

### 3. Plan Updates
- Bug fixes (weekly/bi-weekly)
- Feature updates (monthly)
- Major versions (quarterly)

### 4. Maintenance
- Update dependencies regularly
- Monitor security vulnerabilities
- Keep SDKs up to date
- Review and optimize performance

---

## Rollback Plan

### iOS Rollback
1. Remove current version from sale in App Store Connect
2. Make previous version available
3. Note: Users who already downloaded can't auto-rollback

### Android Rollback
1. Halt rollout in Play Console
2. Create new release with previous version
3. Rollout gradually

### Backend Rollback
```bash
# Firebase Functions rollback
firebase functions:delete functionName
firebase deploy --only functions

# Firestore rules rollback
# Keep previous version in git, redeploy
firebase deploy --only firestore:rules
```

---

## Troubleshooting Deployment Issues

### iOS Certificate Issues
```bash
# Check certificates
security find-identity -v -p codesigning

# Clear provisioning profiles
rm -rf ~/Library/MobileDevice/Provisioning\ Profiles/

# Download from Xcode
Xcode → Preferences → Accounts → Download Manual Profiles
```

### Android Signing Issues
- Verify keystore file exists
- Check passwords in gradle.properties
- Ensure key alias is correct
- Verify keystore validity: `keytool -list -v -keystore my-upload-key.keystore`

### Build Failures
- Clean build folders
- Update dependencies
- Check for breaking changes in libraries
- Review build logs for specific errors

---

## Checklist

### Pre-Launch
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] All features tested
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email configured
- [ ] App Store listings complete
- [ ] Screenshots prepared
- [ ] Marketing materials ready

### Launch Day
- [ ] Submit to stores
- [ ] Monitor submission status
- [ ] Prepare for feedback
- [ ] Social media announcement ready
- [ ] Press release ready (if applicable)
- [ ] Support team briefed

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track analytics
- [ ] Respond to reviews
- [ ] Fix critical bugs immediately
- [ ] Plan first update
- [ ] Collect user feedback

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review error messages carefully
- Search for similar issues online
- Contact platform support if needed
- Maintain deployment documentation
