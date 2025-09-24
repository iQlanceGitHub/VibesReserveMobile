import { Platform, Alert, Linking, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export interface PermissionResult {
  granted: boolean;
  error?: string;
  permissionStatus?: string;
}

export class PermissionManager {
  /**
   * Check storage permission
   */
  static async checkStoragePermission(): Promise<PermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else if (Platform.OS === 'android') {
        // Use new granular permissions for Android 13+
        if (Platform.Version >= 33) {
          permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
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
      console.log('Error checking storage permission:', error);
      return { granted: false, error: 'Failed to check permission' };
    }
  }

  /**
   * Request storage permission with proper alerts
   */
  static async requestStoragePermission(): Promise<PermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else if (Platform.OS === 'android') {
        // Use new granular permissions for Android 13+
        if (Platform.Version >= 33) {
          permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
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
      console.log('Error requesting storage permission:', error);
      return { granted: false, error: 'Failed to request permission' };
    }
  }

  /**
   * Check camera permission
   */
  static async checkCameraPermission(): Promise<PermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.CAMERA;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.CAMERA;
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
      console.log('Error checking camera permission:', error);
      return { granted: false, error: 'Failed to check permission' };
    }
  }

  /**
   * Request camera permission with proper alerts
   */
  static async requestCameraPermission(): Promise<PermissionResult> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.CAMERA;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.CAMERA;
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
      console.log('Error requesting camera permission:', error);
      return { granted: false, error: 'Failed to request permission' };
    }
  }

  /**
   * Show permission denied alert with option to open settings
   */
  static showPermissionDeniedAlert(
    title: string = 'Permission Required',
    message: string = 'This app needs permission to access your photos. Please enable it in Settings.',
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
   * Show camera permission denied alert
   */
  static showCameraPermissionDeniedAlert(
    onCancel?: () => void,
    onOpenSettings?: () => void
  ) {
    this.showPermissionDeniedAlert(
      'Camera Permission Required',
      'This app needs camera access to take photos. Please enable camera permission in Settings.',
      onCancel,
      onOpenSettings
    );
  }

  /**
   * Show storage permission denied alert
   */
  static showStoragePermissionDeniedAlert(
    onCancel?: () => void,
    onOpenSettings?: () => void
  ) {
    this.showPermissionDeniedAlert(
      'Storage Permission Required',
      'This app needs storage access to select photos. Please enable storage permission in Settings.',
      onCancel,
      onOpenSettings
    );
  }

  /**
   * Complete permission flow with user-friendly error handling
   */
  static async requestPermissionWithFlow(
    permissionType: 'camera' | 'storage',
    onSuccess: () => void,
    onError?: (error: string) => void
  ): Promise<boolean> {
    try {
      let result;
      
      if (permissionType === 'camera') {
        result = await this.requestCameraPermission();
      } else {
        result = await this.requestStoragePermission();
      }
      
      if (result.granted) {
        onSuccess();
        return true;
      } else {
        const errorMessage = result.error || `${permissionType} permission denied`;
        
        if (permissionType === 'camera') {
          this.showCameraPermissionDeniedAlert(
            onError ? () => onError(errorMessage) : undefined
          );
        } else {
          this.showStoragePermissionDeniedAlert(
            onError ? () => onError(errorMessage) : undefined
          );
        }
        
        if (onError) {
          onError(errorMessage);
        }
        return false;
      }
    } catch (error) {
      const errorMessage = `Unexpected error requesting ${permissionType} permission`;
      console.log(`Error in requestPermissionWithFlow for ${permissionType}:`, error);
      
      if (onError) {
        onError(errorMessage);
      }
      return false;
    }
  }
}

export default PermissionManager;
