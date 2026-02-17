# Mobile App Deployment Guide

## iOS & Android Deployment

Complete deployment guide for NoMoreHieroglyphics mobile app to App Store and Google Play.

## iOS Deployment

### Prerequisites
- Apple Developer Account
- Xcode 14+
- Valid certificates

### Build & Deploy
```bash
cd ios && pod install
xcodebuild archive -workspace NoMoreHieroglyphics.xcworkspace
# Upload via Xcode Organizer
```

## Android Deployment

### Build AAB
```bash
cd android
./gradlew bundleRelease
# Upload to Google Play Console
```

## CI/CD
Use GitHub Actions or Fastlane for automated builds.

See full deployment documentation for complete steps.
