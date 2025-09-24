import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
  permissionStatus?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export class LocationPermissionManager {
  /**
   * Check if location permission is already granted
   */
  static async checkLocationPermission(): Promise<LocationPermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        return { granted: false, error: 'Unsupported platform' };
      }

      const result = await check(permission);
      
      return {
        granted: result === RESULTS.GRANTED,
        permissionStatus: result,
        error: result === RESULTS.GRANTED ? undefined : `Permission status: ${result}`
      };
    } catch (error) {
      console.log('Error checking location permission:', error);
      return { granted: false, error: 'Failed to check permission' };
    }
  }

  /**
   * Request location permission from user
   */
  static async requestLocationPermission(): Promise<LocationPermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        return { granted: false, error: 'Unsupported platform' };
      }

      const result = await request(permission);
      
      return {
        granted: result === RESULTS.GRANTED,
        permissionStatus: result,
        error: result === RESULTS.GRANTED ? undefined : `Permission request result: ${result}`
      };
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return { granted: false, error: 'Failed to request permission' };
    }
  }

  /**
   * Get current location with proper error handling
   */
  static async getCurrentLocation(options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  }): Promise<{ success: boolean; data?: LocationData; error?: string }> {
    try {
      // First check if permission is granted
      const permissionResult = await this.checkLocationPermission();
      
      if (!permissionResult.granted) {
        // Try to request permission
        const requestResult = await this.requestLocationPermission();
        
        if (!requestResult.granted) {
          return {
            success: false,
            error: 'Location permission denied'
          };
        }
      }

      // Permission is granted, get location
      return new Promise((resolve) => {
        const defaultOptions = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          ...options
        };

        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              success: true,
              data: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
              }
            });
          },
          (error) => {
            let errorMessage = 'Failed to get location';
            
            switch (error.code) {
              case 1:
                errorMessage = 'Location permission denied';
                break;
              case 2:
                errorMessage = 'Location unavailable - check network connection';
                break;
              case 3:
                errorMessage = 'Location request timed out';
                break;
              default:
                errorMessage = `Location error: ${error.message}`;
            }
            
            resolve({
              success: false,
              error: errorMessage
            });
          },
          defaultOptions
        );
      });
    } catch (error) {
      console.log('Error in getCurrentLocation:', error);
      return {
        success: false,
        error: 'Unexpected error getting location'
      };
    }
  }

  /**
   * Show permission denied alert with option to open settings
   */
  static showPermissionDeniedAlert(
    title: string = 'Location Permission Required',
    message: string = 'Please enable location access in Settings to use this feature.',
    onCancel?: () => void,
    onOpenSettings?: () => void
  ) {
    Alert.alert(
      title,
      message,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: onCancel
        },
        { 
          text: 'Open Settings', 
          onPress: () => {
            if (onOpenSettings) {
              onOpenSettings();
            } else {
              openSettings();
            }
          }
        },
      ]
    );
  }

  /**
   * Show location error alert with retry option
   */
  static showLocationErrorAlert(
    error: string,
    onRetry?: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(
      'Location Error',
      error,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: onCancel
        },
        ...(onRetry ? [{
          text: 'Try Again',
          onPress: onRetry
        }] : [])
      ]
    );
  }

  /**
   * Complete location permission flow with user-friendly error handling
   */
  static async requestLocationWithPermissionFlow(
    onSuccess: (location: LocationData) => void,
    onError?: (error: string) => void,
    options?: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    }
  ): Promise<boolean> {
    try {
      const result = await this.getCurrentLocation(options);
      
      if (result.success && result.data) {
        onSuccess(result.data);
        return true;
      } else {
        const errorMessage = result.error || 'Failed to get location';
        
        if (errorMessage.includes('permission denied')) {
          this.showPermissionDeniedAlert(
            'Location Permission Required',
            'This app needs location access to find nearby events. Please enable location permission in Settings.',
            onError ? () => onError(errorMessage) : undefined
          );
        } else {
          this.showLocationErrorAlert(
            errorMessage,
            () => this.requestLocationWithPermissionFlow(onSuccess, onError, options),
            onError ? () => onError(errorMessage) : undefined
          );
        }
        
        if (onError) {
          onError(errorMessage);
        }
        return false;
      }
    } catch (error) {
      const errorMessage = 'Unexpected error getting location';
      console.log('Error in requestLocationWithPermissionFlow:', error);
      
      if (onError) {
        onError(errorMessage);
      }
      return false;
    }
  }
}

export default LocationPermissionManager;

