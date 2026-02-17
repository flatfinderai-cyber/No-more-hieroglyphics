# NoMoreHieroglyphics

**iOS and Android mobile app** for translating technical jargon into professional, plain English.

## 📱 Platform

iOS and Android Mobile App (React Native)
- iOS 13.0+
- Android 8.0+ (API 26+)

## 🎨 Design System

### Color Palette (Fresh Sky Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| Fresh Sky | `#00B0FF` | Primary background |
| Gold | `#FFD600` | Highlights & accents |
| Vivid Tangerine | `#F57C00` | Primary action buttons |
| Dusk Blue | `#215089` | Secondary actions |
| Carbon Black | `#1A1A1B` | Text & borders (3px) |

📄 **Complete palette details**: See [COLORS.md](./COLORS.md) with RGB, CMYK, HSB, HSL, Lab values

### Typography - Raleway Font

- **Font**: Raleway (Google Fonts)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700), Black (900)
- **Special**: Old-style numerals enabled
- **Setup**: [docs/THEME_CONFIG.md](./docs/THEME_CONFIG.md)

## ✨ Features

1. **Direct Decode** - Translate technical jargon instantly
2. **Tone Sanitizer** - Remove patronizing language
3. **Jargon Dictionary** - Searchable technical terms database

## 🛠 Tech Stack

- React Native 0.72+
- Firebase (Auth, Firestore, Analytics)
- Stripe + In-App Purchases
- Google AdMob

## 📚 Complete Documentation

### 🚀 Quick Start Guides
- **[GitHub & Monetization Setup](./docs/GITHUB_MONETIZATION_GUIDE.md)** - How to manage repo & get paid
- **[High-Converting Setup](./docs/monetization/HIGH_CONVERSION_SETUP.md)** - Maximum revenue optimization
- [Development Setup](./docs/DEVELOPMENT_SETUP.md) - Environment setup

### 🎨 Design System
- [Color Palette](./COLORS.md) - Fresh Sky theme with all color formats
- [Theme Config](./docs/THEME_CONFIG.md) - Raleway font & styling guide

### 🔐 Authentication (Highest Converting Methods)
- **[Wallet Connect](./docs/authentication/WALLET_CONNECT.md)** - Web3 wallet integration (MetaMask)
- [Authentication API](./docs/authentication/AUTHENTICATION_API.md) - OAuth, JWT, users
  - Google OAuth (fastest)
  - Apple Sign In (iOS required)
  - GitHub OAuth (developer audience)
  - Email/Password (fallback)

### 💳 Payment & Billing
- [Billing API](./docs/billing/BILLING_API.md) - Subscriptions, IAP, Stripe
  - Apple In-App Purchases
  - Google Play Billing
  - Stripe (cards, Apple Pay, Google Pay)
  - Crypto payments (USDC, ETH)

### 🏗️ Infrastructure (Backend APIs)
- [Backend Architecture](./docs/backend/BACKEND_ARCHITECTURE.md) - Complete API specs
- [Database](./docs/database/DATABASE_SETUP.md) - Firestore schema
- [App Stores](./docs/app-stores/APP_STORE_API.md) - iOS & Android publishing
- [Advertising](./docs/advertising/ADVERTISING_SETUP.md) - AdMob integration
- [Analytics](./docs/analytics/ANALYTICS_SETUP.md) - Firebase Analytics & tracking
- [Deployment](./docs/deployment/DEPLOYMENT_GUIDE.md) - Build & release process

### ⚖️ Legal
- [Privacy Policy](./docs/legal/PRIVACY_POLICY.md)
- [Terms of Service](./docs/legal/TERMS_OF_SERVICE.md)

## 🚀 Quick Start

```bash
# Install
npm install
cd ios && pod install && cd ..

# Run
npm run ios     # iOS
npm run android # Android
```

## 🎨 Custom UI

**You provide the UI**. All backend infrastructure is documented and ready:
- Authentication system ✅
- Billing & payments ✅
- Database schema ✅
- App Store integration ✅
- Analytics ✅

Client implements login screens, payment forms, dictionary UI, etc.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/flatfinderai-cyber/No-more-hieroglyphics/issues)
- Docs: [./docs](./docs)

---

**Built for professionals who value precision over patronization.**

🍎 iOS | 🤖 Android | 📱 React Native
