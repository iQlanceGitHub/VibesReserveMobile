# Location Permission Handling Guide

This guide explains how to implement consistent location permission handling across all screens in the VibesReserveMobile app.

## 🚀 Quick Start

### Option 1: Using the Hook (Recommended)

```tsx
import React from 'react';
import { useLocationPermission } from '../hooks/useLocationPermission';

const YourScreen: React.FC = () => {
  const { hasPermission, isLoading, error, getCurrentLocation } = useLocationPermission();

  const handleGetLocation = async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData) {
        console.log('Location:', locationData.latitude, locationData.longitude);
        // Use location data
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  return (
    // Your UI here
  );
};
```

### Option 2: Using the Utility Class

```tsx
import LocationPermissionManager from '../utilis/locationPermissionUtils';

const handleGetLocation = async () => {
  try {
    const result = await LocationPermissionManager.getCurrentLocation();
    
    if (result.success && result.data) {
      console.log('Location:', result.data.latitude, result.data.longitude);
      // Use location data
    } else {
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('Location error:', error);
  }
};
```

## 📁 Files Overview

### Core Files

1. **`src/utilis/locationPermissionUtils.ts`** - Main utility class with all permission logic
2. **`src/hooks/useLocationPermission.ts`** - React hook for easy integration
3. **`src/utilis/locationUtils.ts`** - Updated to use the new permission system
4. **`src/components/LocationPermissionExample.tsx`** - Example implementation

### Updated Files

- **`src/screen/auth/LocationScreen/LocationScreen.tsx`** - Fixed permission handling

## 🔧 Features

### ✅ What's Fixed

1. **Permission Request Logic** - Proper permission checking and requesting
2. **Error Handling** - User-friendly error messages and alerts
3. **Android 15 Compatibility** - Works with Android 15's new permission system
4. **Consistent API** - Same interface across all screens
5. **Fallback Handling** - Graceful degradation when location fails

### 🛠️ Available Methods

#### LocationPermissionManager Class

```tsx
// Check if permission is granted
const result = await LocationPermissionManager.checkLocationPermission();

// Request permission from user
const result = await LocationPermissionManager.requestLocationPermission();

// Get current location (handles permission automatically)
const result = await LocationPermissionManager.getCurrentLocation(options);

// Complete flow with user-friendly error handling
const success = await LocationPermissionManager.requestLocationWithPermissionFlow(
  onSuccess,    // (locationData) => void
  onError,      // (error) => void
  options       // { enableHighAccuracy, timeout, maximumAge }
);
```

#### useLocationPermission Hook

```tsx
const {
  hasPermission,      // boolean - current permission status
  isLoading,          // boolean - loading state
  error,              // string | null - error message
  getCurrentLocation, // () => Promise<LocationData | null>
  requestPermission,  // () => Promise<boolean>
  checkPermission     // () => Promise<boolean>
} = useLocationPermission();
```

## 📱 Implementation Examples

### Basic Location Access

```tsx
import { useLocationPermission } from '../hooks/useLocationPermission';

const MyScreen: React.FC = () => {
  const { hasPermission, isLoading, getCurrentLocation } = useLocationPermission();

  const handleGetLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      // Use location data
      console.log('Got location:', location);
    }
  };

  return (
    <TouchableOpacity onPress={handleGetLocation} disabled={isLoading}>
      <Text>{isLoading ? 'Getting Location...' : 'Get Location'}</Text>
    </TouchableOpacity>
  );
};
```

### Advanced Error Handling

```tsx
import LocationPermissionManager from '../utilis/locationPermissionUtils';

const handleAdvancedLocation = async () => {
  const success = await LocationPermissionManager.requestLocationWithPermissionFlow(
    (locationData) => {
      // Success callback
      console.log('Location obtained:', locationData);
      // Update UI with location
    },
    (error) => {
      // Error callback
      console.log('Location error:', error);
      // Show error to user
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    }
  );
};
```

### Permission Status Display

```tsx
const LocationStatus: React.FC = () => {
  const { hasPermission, isLoading, error } = useLocationPermission();

  return (
    <View>
      <Text>Permission: {hasPermission ? '✅ Granted' : '❌ Denied'}</Text>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
    </View>
  );
};
```

## 🔒 Permission States

### iOS
- `PERMISSIONS.IOS.LOCATION_WHEN_IN_USE` - Location when app is in use

### Android
- `PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION` - Precise location access

## 🚨 Error Handling

The system handles these common errors:

1. **Permission Denied** - Shows settings dialog
2. **Location Unavailable** - Network/device issues
3. **Timeout** - Location request timed out
4. **Generic Errors** - Fallback error handling

## 🎯 Best Practices

1. **Always check permission status** before requesting location
2. **Use the hook** for React components (easier state management)
3. **Handle errors gracefully** with user-friendly messages
4. **Provide fallback options** when location fails
5. **Test on both platforms** (iOS and Android)

## 🔄 Migration Guide

### From Old System

**Before:**
```tsx
// Old way - inconsistent error handling
Geolocation.getCurrentPosition(
  (position) => { /* success */ },
  (error) => { /* error handling */ },
  options
);
```

**After:**
```tsx
// New way - consistent and user-friendly
const { getCurrentLocation } = useLocationPermission();
const location = await getCurrentLocation();
```

## 🧪 Testing

1. Test permission denied scenarios
2. Test network connectivity issues
3. Test on different Android versions (especially Android 15)
4. Test on iOS with different permission states

## 📝 Notes

- The system automatically handles permission requests
- Error messages are user-friendly and actionable
- Works with both debug and release builds
- Compatible with Android 15's new permission system
- Includes proper TypeScript types

## 🆘 Troubleshooting

### Common Issues

1. **"Geolocation is not supported by this browser"** - Fixed with proper permission handling
2. **Permission always denied** - Check Android manifest permissions
3. **Location timeout** - Increase timeout value in options
4. **Network errors** - Check internet connectivity

### Debug Steps

1. Check console logs for detailed error messages
2. Verify Android manifest has location permissions
3. Test on physical device (not simulator)
4. Check location services are enabled on device

