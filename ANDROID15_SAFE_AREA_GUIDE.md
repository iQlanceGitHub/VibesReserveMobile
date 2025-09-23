# Android 15 Safe Area Implementation Guide

This guide documents the changes made to handle safe areas properly for Android 15 edge-to-edge display requirements.

## Overview

Android 15 enforces edge-to-edge rendering for apps targeting API level 35. This means content extends behind system UI elements like status bars and navigation bars, requiring proper safe area handling.

## Changes Made

### 1. App.tsx - Root Level Configuration

- **Enhanced SafeAreaProvider**: Added `initialMetrics` configuration for better Android 15 support
- **StatusBar Configuration**: Added Android-specific properties for edge-to-edge rendering
- **Platform-specific handling**: Different configurations for Android vs iOS

```tsx
<SafeAreaProvider
  initialMetrics={{
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
    frame: { x: 0, y: 0, width: 0, height: 0 },
  }}
>
  <StatusBar
    translucent
    backgroundColor="transparent"
    barStyle="dark-content"
    {...(Platform.OS === 'android' && {
      statusBarTranslucent: true,
      statusBarBackgroundColor: 'transparent',
    })}
  />
</SafeAreaProvider>
```

### 2. Screen Components - useSafeAreaInsets Hook

Replaced `SafeAreaView` with `useSafeAreaInsets` hook for better Android 15 compatibility:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyScreen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Content */}
    </View>
  );
};
```

### 3. SafeAreaWrapper Component

Created a reusable component for consistent safe area handling:

```tsx
import SafeAreaWrapper from '../components/SafeAreaWrapper';

<SafeAreaWrapper
  backgroundColor="transparent"
  statusBarStyle="light-content"
  statusBarBackgroundColor="transparent"
>
  {/* Your content */}
</SafeAreaWrapper>
```

### 4. Bottom Tab Navigator

Updated to handle bottom safe area insets:

```tsx
const insets = useSafeAreaInsets();

<View style={[styles.mainContainerTab, { paddingBottom: insets.bottom }]}>
  {/* Tab content */}
</View>
```

### 5. Android Native Configuration

#### MainActivity.kt
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  
  // Enable edge-to-edge display for Android 15 compatibility
  if (Build.VERSION.SDK_INT >= 35) {
    WindowCompat.setDecorFitsSystemWindows(window, false)
  }
}
```

#### styles.xml
```xml
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
  <!-- Android 15 edge-to-edge support -->
  <item name="android:windowTranslucentStatus">true</item>
  <item name="android:windowTranslucentNavigation">true</item>
  <item name="android:statusBarColor">@android:color/transparent</item>
  <item name="android:navigationBarColor">@android:color/transparent</item>
  <item name="android:windowLightStatusBar">false</item>
  <item name="android:windowLightNavigationBar">false</item>
  <item name="android:enforceStatusBarContrast">false</item>
  <item name="android:enforceNavigationBarContrast">false</item>
</style>
```

#### AndroidManifest.xml
```xml
<activity
  android:name=".MainActivity"
  android:enableOnBackInvokedCallback="true"
  android:theme="@style/AppTheme">
  <!-- Other attributes -->
</activity>
```

## Key Benefits

1. **Android 15 Compliance**: Properly handles edge-to-edge display requirements
2. **Consistent Behavior**: Same safe area handling across all screens
3. **Future-proof**: Uses modern React Native safe area patterns
4. **Performance**: More efficient than SafeAreaView in many cases
5. **Flexibility**: Easy to customize per screen if needed

## Migration Guide for Other Screens

To update existing screens to use the new safe area approach:

1. **Remove SafeAreaView import and usage**
2. **Add useSafeAreaInsets import**
3. **Replace SafeAreaView with View and apply insets manually**
4. **Update StatusBar configuration if needed**

Example migration:

```tsx
// Before
import { SafeAreaView } from 'react-native';

<SafeAreaView style={styles.safeArea}>
  {/* Content */}
</SafeAreaView>

// After
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={[styles.safeArea, { paddingTop: insets.top }]}>
  {/* Content */}
</View>
```

## Testing

Test the implementation on:
- Android 15 devices/emulators
- Devices with notches/display cutouts
- Different screen orientations
- Various screen sizes

## Troubleshooting

If you encounter issues:

1. **Content overlapping status bar**: Ensure `paddingTop: insets.top` is applied
2. **Content overlapping navigation bar**: Ensure `paddingBottom: insets.bottom` is applied
3. **Status bar not transparent**: Check Android theme configuration
4. **Inconsistent behavior**: Verify SafeAreaProvider is properly configured at root level

## Dependencies

Ensure you have the latest version of:
- `react-native-safe-area-context`: ^5.5.1
- `react-native`: 0.78.2
- Android target SDK: 35 (for Android 15)
