# Mobile App Theme Configuration

## Color Palette (Updated)

### Primary Colors
```javascript
export const colors = {
  // Background & Base
  freshSky: '#00B0FF',
  carbonBlack: '#1A1A1B',
  white: '#FFFFFF',
  
  // Accent Colors
  duskBlue: '#215089',
  vividTangerine: '#F57C00',
  gold: '#FFD600',
  
  // Text Colors
  primaryText: '#263238',
  secondaryText: '#546E7A',
  
  // Semantic Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3'
};
```

## Typography (Raleway Font)

### Font Family Configuration

**React Native:**
```javascript
export const typography = {
  fontFamily: {
    regular: 'Raleway-Regular',
    medium: 'Raleway-Medium',
    semiBold: 'Raleway-SemiBold',
    bold: 'Raleway-Bold',
    black: 'Raleway-Black'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8
  }
};
```

### Font Installation

#### iOS (Xcode)
1. Download Raleway font family from Google Fonts
2. Add font files to `ios/YourApp/Fonts/` directory
3. Update `Info.plist`:
```xml
<key>UIAppFonts</key>
<array>
  <string>Raleway-Regular.ttf</string>
  <string>Raleway-Medium.ttf</string>
  <string>Raleway-SemiBold.ttf</string>
  <string>Raleway-Bold.ttf</string>
  <string>Raleway-Black.ttf</string>
</array>
```

#### Android
1. Create `android/app/src/main/assets/fonts/` directory
2. Add Raleway font files:
   - Raleway-Regular.ttf
   - Raleway-Medium.ttf
   - Raleway-SemiBold.ttf
   - Raleway-Bold.ttf
   - Raleway-Black.ttf

#### React Native Configuration
```javascript
// react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {}
  },
  assets: ['./assets/fonts/']
};
```

### Usage in Components

```javascript
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Raleway-Black',
    fontSize: 32,
    color: colors.carbonBlack,
    fontVariant: ['oldstyle-nums'] // Old-style numerals
  },
  body: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    color: colors.primaryText,
    lineHeight: 24
  },
  button: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: colors.white
  }
});

<Text style={styles.heading}>Technical Dictionary</Text>
```

## Theme Object

```javascript
// theme.js
export const theme = {
  colors: {
    primary: '#00B0FF', // Fresh Sky
    secondary: '#F57C00', // Vivid Tangerine
    accent: '#FFD600', // Gold
    background: '#00B0FF',
    surface: '#FFFFFF',
    text: '#263238',
    border: '#1A1A1B',
    
    // Button Colors
    buttonPrimary: '#F57C00',
    buttonSecondary: '#215089',
    
    // Status Colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#215089'
  },
  
  fonts: {
    regular: 'Raleway-Regular',
    medium: 'Raleway-Medium',
    semiBold: 'Raleway-SemiBold',
    bold: 'Raleway-Bold',
    black: 'Raleway-Black'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    pill: 999
  },
  
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
    heavy: 5
  }
};
```

## Component Styles

### Buttons
```javascript
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.buttonPrimary, // Vivid Tangerine
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border
  },
  primaryText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.surface,
    textAlign: 'center'
  }
});
```

### Cards
```javascript
export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    shadowColor: theme.colors.carbonBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
});
```

### Input Fields
```javascript
export const inputStyles = StyleSheet.create({
  container: {
    borderWidth: theme.borderWidth.thick,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  input: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text
  }
});
```

## Old-Style Numerals

### CSS (Web)
```css
.oldstyle-numbers {
  font-variant-numeric: oldstyle-nums;
  font-feature-settings: "onum";
}
```

### React Native
```javascript
// Note: fontVariant support varies by platform
const styles = StyleSheet.create({
  numbers: {
    fontFamily: 'Raleway-Regular',
    fontVariant: ['oldstyle-nums']
  }
});
```

## Implementation Example

```javascript
// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>NoMoreHieroglyphics</Text>
      <Text style={styles.body}>Technical Jargon Dictionary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // Fresh Sky
    padding: theme.spacing.lg
  },
  heading: {
    fontFamily: theme.fonts.black,
    fontSize: 32,
    color: theme.colors.border, // Carbon Black
    marginBottom: theme.spacing.md
  },
  body: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24
  }
});

export default App;
```

## Font Files to Download

**Google Fonts URL:** https://fonts.google.com/specimen/Raleway

**Required Weights:**
- Raleway-Regular (400)
- Raleway-Medium (500)
- Raleway-SemiBold (600)
- Raleway-Bold (700)
- Raleway-Black (900)

**File Format:** TTF or OTF (TTF recommended for React Native)

## Installation Commands

```bash
# React Native CLI
react-native link

# Or with expo
expo install expo-font @expo-google-fonts/raleway

# Then in your app:
import { useFonts, Raleway_400Regular, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
```

## Design Tokens JSON

```json
{
  "colors": {
    "freshSky": "#00B0FF",
    "gold": "#FFD600",
    "vividTangerine": "#F57C00",
    "duskBlue": "#215089",
    "carbonBlack": "#1A1A1B"
  },
  "typography": {
    "fontFamily": "Raleway",
    "weights": {
      "regular": 400,
      "medium": 500,
      "semiBold": 600,
      "bold": 700,
      "black": 900
    },
    "features": {
      "oldStyleNumerals": true
    }
  }
}
```

This ensures Raleway font with old-style numerals is properly configured across iOS and Android.
