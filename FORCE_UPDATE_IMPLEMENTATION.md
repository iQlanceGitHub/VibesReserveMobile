# Force Update Implementation Guide

## Overview
This implementation enables forced app updates for both Android and iOS. When a new version is released, users with older versions will be prompted to update before they can continue using the app.

## Features Implemented

### 1. Force Update Modal Component
**Location:** `src/components/ForceUpdateModal.tsx`

A beautiful modal that displays when an update is required. Features:
- Non-dismissible modal (users must update)
- Gradient background matching app theme
- "Update Now" button that opens the app store
- Professional UI with proper styling

### 2. Force Update Service
**Location:** `src/services/forceUpdateService.ts`

A singleton service that handles:
- Checking current app version using `react-native-device-info`
- Calling backend API to get latest version info
- Comparing versions and determining if update is required
- Managing store URLs (iOS App Store / Google Play Store)
- Opening the store URL when user taps "Update Now"

### 3. Integration in App.tsx
The force update check happens:
- On app launch
- When app comes to foreground (from background)

## Version Configuration (No Backend Required!)

The force update system works **locally** by hard-coding version information in the app. No backend API is required!

### Configuration Location
The version configuration is in `src/services/forceUpdateService.ts` (lines 22-26):

```typescript
private versionConfig: VersionInfo = {
  latest_version: '1.0.0',  // Update this to the latest version in store
  min_version: '1.0.0',     // Minimum version required
  force_update: false,       // Set to true when you want to force update
  update_message: 'A new version of VibesReserve is available. Please update your app.',
};
```

### How It Works
1. The app checks its current version against the `min_version`
2. If current version < min_version, update is forced
3. If `force_update` is set to `true`, update is forced regardless

## How It Works

1. **App Launch**: When the app starts, it checks the current version
2. **Version Comparison**: The service compares current app version with `min_version` from configuration
3. **Force Update Check**: If current version < `min_version` OR `force_update` is `true`, the modal appears
4. **Non-dismissible**: Users cannot use the app until they update
5. **Store Redirect**: Tapping "Update Now" opens the appropriate store URL (iOS or Android)

## Configuration

### Default Store URLs

If the backend doesn't provide store URLs, default URLs are used:

**iOS:** 
```typescript
https://apps.apple.com/us/app/vibe-reserve/id6754464237
```

**Android:**
```typescript
https://play.google.com/store/apps/details?id=com.app.VibesReserveMobile
```

✅ Both store URLs are configured.

### Package.json Version
Current app version is read from `package.json`:
```json
{
  "version": "0.0.1"
}
```

### Android Version Code
The Android `versionCode` is located in `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 3
    versionName "1.0"
}
```

### iOS Version
The iOS version is set in the Xcode project settings.

## Testing Force Updates

### Testing on Development

1. **Backend Setup**: Create a test endpoint that returns `force_update: true`
2. **Test the Modal**: Verify the modal appears on app launch
3. **Test Store Redirect**: Verify clicking "Update Now" opens the store
4. **Test Non-dismissible**: Verify users cannot dismiss or bypass the modal

### Testing in Production

1. **Update Version Configuration**: In `src/services/forceUpdateService.ts`:
   - Set `latest_version` to the new version you're releasing
   - Set `min_version` to the minimum version required (usually same as latest)
   - Set `force_update` to `true` to force users to update
   - Optionally update `update_message` with a custom message

2. **Increment Version**: Update version numbers in:
   - `package.json` (version)
   - `android/app/build.gradle` (versionCode, versionName)
   - iOS project settings

3. **Release New Version**: Upload new version to stores

4. **Verify**: Install old version on test device, then open app to see update prompt

## Usage Examples

### Manual Version Check
```typescript
import forceUpdateService from './src/services/forceUpdateService';

// Check if update is required
const needsUpdate = await forceUpdateService.checkForUpdate();

if (needsUpdate) {
  // Get store URL
  const storeUrl = forceUpdateService.getStoreUrl();
  // Open store
  forceUpdateService.openStore();
}
```

### Get Current Version
```typescript
const currentVersion = forceUpdateService.getCurrentAppVersion();
const latestVersion = forceUpdateService.getLatestVersion();
```

## Deployment Checklist

- [x] Update iOS App Store URL: `https://apps.apple.com/us/app/vibe-reserve/id6754464237`
- [x] Update Android Play Store URL: `https://play.google.com/store/apps/details?id=com.app.VibesReserveMobile`
- [ ] Test on both iOS and Android devices
- [ ] Verify modal appears and cannot be dismissed
- [ ] Verify "Update Now" button opens correct store
- [ ] Test when app comes from background (app state change)
- [ ] Update version configuration in `forceUpdateService.ts` when releasing new version
- [ ] Set `force_update: true` in version config to force users to update

## Notes

- The modal is **non-dismissible** - users must update to continue
- Version checking happens on **every app launch** and **when app comes to foreground**
- The service uses a singleton pattern to prevent duplicate version checks
- **No backend API required** - everything is configured locally in the app
- **Safe defaults**: Force update is disabled by default to prevent issues during app review
- **Explicit enablement required**: Only forces update when `force_update: true` is explicitly set
- To force an update, simply update the version configuration in the code
- When you release a new version to stores, update the version config in the new build

## Safety Features

✅ **Validation checks**: Version configuration is validated before forcing updates  
✅ **Error handling**: If version check fails, users can still use the app  
✅ **Explicit enablement**: Force update requires `force_update: true` to be set  
✅ **No accidental updates**: Won't force update during app store review  
✅ **Version format validation**: Only accepts properly formatted version numbers (e.g., "1.0.0")

