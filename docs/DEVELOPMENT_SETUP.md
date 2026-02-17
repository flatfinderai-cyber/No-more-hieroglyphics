# Development Environment Setup

## Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or your preferred IDE

### Platform-Specific Requirements

#### For iOS Development:
- **macOS**: Required (iOS development only works on Mac)
- **Xcode**: Latest version from App Store
- **Xcode Command Line Tools**: `xcode-select --install`
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator**: Included with Xcode

#### For Android Development:
- **Android Studio**: Latest version
- **Android SDK**: API Level 30 or higher
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)**: Version 11 or higher

---

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/flatfinderai-cyber/No-more-hieroglyphics.git
cd No-more-hieroglyphics
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create `.env` file in the project root:
```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
API_BASE_URL=https://api.nomohieroglyphics.com/v1
API_TIMEOUT=10000

# AdMob Configuration (Use test IDs for development)
ADMOB_APP_ID_IOS=ca-app-pub-3940256099942544~1458002511
ADMOB_APP_ID_ANDROID=ca-app-pub-3940256099942544~3347511713
ADMOB_BANNER_IOS=ca-app-pub-3940256099942544/2934735716
ADMOB_BANNER_ANDROID=ca-app-pub-3940256099942544/6300978111

# Google Sign-In
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Environment
NODE_ENV=development
```

### 4. iOS Setup (Mac only)

```bash
# Navigate to iOS directory
cd ios

# Install CocoaPods dependencies
pod install

# Return to project root
cd ..
```

### 5. Android Setup

1. Open Android Studio
2. Go to Preferences → Appearance & Behavior → System Settings → Android SDK
3. Install required SDK versions (API 30+)
4. Add Android SDK to PATH:

```bash
# Add to ~/.bash_profile or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

5. Place `google-services.json` in `android/app/` directory

---

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### 2. Add iOS App
1. In Firebase Console, click "Add app" → iOS
2. Register app with bundle ID: `com.nomohieroglyphics.app`
3. Download `GoogleService-Info.plist`
4. Place in `ios/NoMoreHieroglyphics/` directory

### 3. Add Android App
1. Click "Add app" → Android
2. Register app with package name: `com.nomohieroglyphics.app`
3. Download `google-services.json`
4. Place in `android/app/` directory

### 4. Enable Firebase Services
- Authentication (Email, Google, Apple)
- Cloud Firestore
- Cloud Functions (optional)
- Analytics
- Performance Monitoring
- Crashlytics

---

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on iOS
```bash
# Run on iOS Simulator
npm run ios

# Run on specific simulator
npm run ios -- --simulator="iPhone 14 Pro"

# Run on physical device
npm run ios -- --device
```

### Run on Android
```bash
# Run on Android Emulator or connected device
npm run android

# Run on specific device
npm run android -- --deviceId=DEVICE_ID
```

---

## Development Tools

### VS Code Extensions (Recommended)
- **React Native Tools** - Debugging and IntelliSense
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Auto Rename Tag** - Rename paired tags
- **GitLens** - Git integration
- **Firebase Explorer** - Firebase management

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### Browser Developer Tools
- **React Native Debugger**: Standalone debugging tool
  ```bash
  brew install --cask react-native-debugger
  ```

- **Flipper**: Mobile app debugging platform
  ```bash
  brew install --cask flipper
  ```

---

## Code Quality Tools

### ESLint Configuration
Already configured in the project. Run:
```bash
npm run lint
```

### Prettier Configuration
Format code:
```bash
npm run format
```

### Pre-commit Hooks
Install Husky for git hooks:
```bash
npm install --save-dev husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## Testing

### Unit Tests
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests with Detox
```bash
# Install Detox CLI
npm install -g detox-cli

# Build for testing (iOS)
detox build --configuration ios.sim.debug

# Run tests (iOS)
detox test --configuration ios.sim.debug

# Build for testing (Android)
detox build --configuration android.emu.debug

# Run tests (Android)
detox test --configuration android.emu.debug
```

---

## Debugging

### React Native Debugger
1. Open React Native Debugger
2. In app, press `Cmd+D` (iOS) or `Cmd+M` (Android)
3. Select "Debug"

### Console Logs
```javascript
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');
```

### Chrome DevTools
1. In app, open Developer menu
2. Select "Debug with Chrome"
3. Open Chrome DevTools (`Cmd+Option+I`)

### iOS-Specific Debugging
```bash
# View iOS logs
react-native log-ios

# Open iOS Simulator logs
open ~/Library/Logs/CoreSimulator/
```

### Android-Specific Debugging
```bash
# View Android logs
react-native log-android

# ADB logcat
adb logcat
```

---

## Common Issues and Solutions

### iOS Build Fails
```bash
# Clean build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Android Build Fails
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Gradle cache
rm -rf ~/.gradle/caches/
```

### Metro Bundler Issues
```bash
# Reset Metro cache
npm start -- --reset-cache

# Or
watchman watch-del-all
rm -rf $TMPDIR/react-*
```

### Node Modules Issues
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CocoaPods Issues
```bash
# Update CocoaPods
sudo gem install cocoapods

# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

---

## Project Structure

```
No-more-hieroglyphics/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API, Auth, Ads services
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── config/           # App configuration
│   ├── assets/           # Images, fonts, etc.
│   └── styles/           # Global styles
├── docs/                 # Documentation
├── __tests__/            # Test files
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
├── app.json
└── README.md
```

---

## Git Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent fixes
- `docs/description` - Documentation updates

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(auth): add Google Sign-In support

Implemented Google OAuth integration for authentication.
Includes error handling and user profile creation.

Closes #123
```

---

## Performance Monitoring

### Flipper Plugins
- Network Inspector
- Layout Inspector
- Performance Monitor
- Crash Reporter

### React DevTools
```bash
# Install standalone React DevTools
npm install -g react-devtools

# Start React DevTools
react-devtools
```

---

## Build for Production

### iOS Production Build
1. Open Xcode workspace
2. Select "Generic iOS Device" or your device
3. Product → Archive
4. Follow App Store Connect upload process

### Android Production Build
```bash
cd android
./gradlew bundleRelease

# APK location:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm test
```

---

## Resources

### Official Documentation
- [React Native Docs](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Community
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Reddit r/reactnative](https://www.reddit.com/r/reactnative/)

### Troubleshooting
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Common Issues](https://github.com/facebook/react-native/issues)

---

## Next Steps

1. ✅ Set up development environment
2. ✅ Configure Firebase
3. ✅ Run app on simulator/emulator
4. 📝 Start implementing features
5. 🧪 Write tests
6. 🚀 Deploy to stores

---

## Support

For questions or issues:
- Check documentation in `/docs` directory
- Search existing issues on GitHub
- Create new issue with detailed description
- Contact: support@nomohieroglyphics.com
