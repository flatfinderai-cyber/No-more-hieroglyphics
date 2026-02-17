# App Store & Play Store Setup Guide

## iOS App Store (Apple)

### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Valid certificates and provisioning profiles

### App Store Connect Setup

#### 1. Create App Listing
- Log in to [App Store Connect](https://appstoreconnect.apple.com)
- Click "My Apps" → "+" → "New App"
- Fill in required information:
  - Platform: iOS
  - Name: Tech Jargon Translator
  - Primary Language: English (U.S.)
  - Bundle ID: com.nomohieroglyphics.app
  - SKU: tech-jargon-translator-001

#### 2. App Information
- **Subtitle**: "Decode tech speak into plain English"
- **Category**: Primary - Education, Secondary - Productivity
- **Content Rights**: Check if you have necessary rights
- **Age Rating**: 4+ (No objectionable content)

#### 3. Pricing and Availability
- Price: Free (with in-app purchases)
- Availability: All territories
- Pre-order: Optional

#### 4. App Privacy
Required privacy details:
- Data collection: User account information, payment info
- Data usage: App functionality, analytics
- Third-party SDKs: List all advertising and analytics SDKs

#### 5. Screenshots Required
- 6.5" Display (iPhone 14 Pro Max): 1290 x 2796 pixels (3-10 screenshots)
- 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels (3-10 screenshots)
- iPad Pro (12.9"): 2048 x 2732 pixels (3-10 screenshots)

#### 6. App Preview Video (Optional)
- 15-30 seconds showcasing key features
- Same dimensions as screenshots

#### 7. Description
Write compelling description highlighting:
- Simple tech jargon translation
- Extensive database of terms
- Lighthearted, humorous approach
- Regular updates with new terms

#### 8. Keywords
Maximum 100 characters:
- tech jargon, translator, dictionary, tech terms, programming, developer, IT, glossary

#### 9. Support URL & Marketing URL
- Support: https://yourwebsite.com/support
- Marketing: https://yourwebsite.com

#### 10. Build Upload
```bash
# Archive your app in Xcode
# Product → Archive
# Upload to App Store Connect
# Wait for processing (10-60 minutes)
```

#### 11. TestFlight (Beta Testing)
- Add internal testers (up to 100)
- Add external testers (up to 10,000)
- Get feedback before public release

#### 12. Submit for Review
- Select build version
- Export compliance: Set appropriate values
- Advertising identifier: Yes (if using ads)
- Submit for review (typical: 24-48 hours)

### Post-Launch
- Monitor reviews and respond
- Track analytics in App Store Connect
- Regular updates every 2-4 weeks

---

## Google Play Store (Android)

### Prerequisites
- Google Play Developer Account ($25 one-time fee)
- Android Studio installed
- Signed APK or AAB (Android App Bundle)

### Google Play Console Setup

#### 1. Create Application
- Log in to [Google Play Console](https://play.google.com/console)
- Click "Create app"
- Fill in details:
  - App name: Tech Jargon Translator
  - Default language: English (United States)
  - App or game: App
  - Free or paid: Free
  - Declarations: Accept Play policies

#### 2. Store Listing
- **Short description** (80 characters max):
  "Translate confusing tech jargon into plain English. Fun and lighthearted!"

- **Full description** (4000 characters max):
  Comprehensive description of app features, benefits, and functionality

- **App category**: Education or Tools
- **Content rating**: Apply for rating (questionnaire)
- **Contact details**: Email, phone (optional), website

#### 3. Graphics Assets
Required:
- App icon: 512 x 512 pixels (PNG, 32-bit)
- Feature graphic: 1024 x 500 pixels (JPG or PNG, 24-bit)
- Phone screenshots: At least 2, up to 8 (JPG or PNG, 16:9 or 9:16)
  - Min dimension: 320px
  - Max dimension: 3840px
- 7-inch tablet screenshots: At least 2 (optional but recommended)
- 10-inch tablet screenshots: At least 2 (optional but recommended)

Optional:
- Promo video: YouTube URL
- TV banner: 1280 x 720 pixels

#### 4. Store Settings
- App category: Choose primary and secondary
- Tags: Add relevant tags (up to 5)
- Contact email: Required

#### 5. Build Upload

##### Option A: Android App Bundle (AAB) - Recommended
```bash
cd android
./gradlew bundleRelease
# Upload: app/build/outputs/bundle/release/app-release.aab
```

##### Option B: APK
```bash
cd android
./gradlew assembleRelease
# Upload: app/build/outputs/apk/release/app-release.apk
```

#### 6. Release Tracks
- **Internal testing**: Up to 100 testers
- **Closed testing**: Specific user lists
- **Open testing**: Anyone can join (up to limits)
- **Production**: Public release

#### 7. Content Rating
Complete questionnaire:
- Target age group
- Content descriptors
- Interactive elements
- Receive IARC rating

#### 8. App Content
Required declarations:
- Privacy policy URL (mandatory for apps with user data)
- Ads declaration: Does your app contain ads?
- App access: Do all features work without restrictions?
- Content guidelines: Compliance confirmation
- Target audience: Select age groups
- Data safety: Describe data collection and usage

#### 9. Pricing & Distribution
- Countries: Select all or specific countries
- Pricing: Free (with in-app purchases)
- Device categories: Phone, tablet, Chrome OS
- Android version: Minimum SDK version

#### 10. In-App Products (for billing)
- Create subscription plans
- Create consumable/non-consumable products
- Set up pricing per country

#### 11. Submit for Review
- Complete all required sections
- Review and publish
- Typical review time: Few hours to 7 days

### Post-Launch
- Monitor Google Play Console statistics
- Respond to reviews (important for ranking)
- A/B test store listing elements
- Regular updates

---

## Common Best Practices

### 1. App Store Optimization (ASO)
- Use relevant keywords naturally in title and description
- Update screenshots regularly to showcase new features
- Encourage positive reviews from satisfied users
- Respond to all reviews (both positive and negative)
- Localize for major markets

### 2. Version Management
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Keep changelogs clear and user-friendly
- Test thoroughly before submitting updates

### 3. Compliance
- GDPR compliance for EU users
- COPPA compliance if targeting children
- Accessibility features (WCAG 2.1)
- Regular security audits

### 4. Monitoring
- Set up crash reporting (Firebase Crashlytics)
- Track key metrics (DAU, MAU, retention)
- Monitor app performance (loading times, crashes)

### 5. Marketing
- Create landing page
- Social media presence
- Press kit with screenshots and description
- Launch announcement
- App preview videos for both stores

---

## Checklist Before Launch

### iOS
- [ ] Apple Developer Account active
- [ ] App icons in all required sizes
- [ ] Screenshots for all device types
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App description and keywords optimized
- [ ] Content rating completed
- [ ] TestFlight beta testing completed
- [ ] Build uploaded and processed
- [ ] Export compliance info provided
- [ ] All required app information filled

### Android
- [ ] Google Play Developer Account active
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots for phone (at least 2)
- [ ] Privacy policy URL
- [ ] Content rating received
- [ ] Data safety section completed
- [ ] Signed AAB or APK uploaded
- [ ] Store listing complete
- [ ] Pricing and distribution set
- [ ] All declarations completed

### Both Platforms
- [ ] App tested on multiple devices
- [ ] All features working
- [ ] No crashes or critical bugs
- [ ] Terms of Service created
- [ ] Privacy Policy created
- [ ] Support email set up
- [ ] Website or landing page live
- [ ] Analytics integrated
- [ ] Crash reporting set up
- [ ] Push notifications configured (if applicable)
