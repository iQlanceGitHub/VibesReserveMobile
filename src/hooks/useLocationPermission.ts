import { useState, useEffect, useCallback } from 'react';
import LocationPermissionManager, { LocationData } from '../utilis/locationPermissionUtils';

interface UseLocationPermissionReturn {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationData | null>;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<boolean>;
}

export const useLocationPermission = (): UseLocationPermissionReturn => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocationPermissionManager.checkLocationPermission();
      setHasPermission(result.granted);
      setError(result.error || null);
      return result.granted;
    } catch (err) {
      console.log('Error checking location permission:', err);
      setError('Failed to check location permission');
      setHasPermission(false);
      return false;
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await LocationPermissionManager.requestLocationPermission();
      setHasPermission(result.granted);
      setError(result.error || null);
      
      return result.granted;
    } catch (err) {
      console.log('Error requesting location permission:', err);
      setError('Failed to request location permission');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get current location with permission handling
  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await LocationPermissionManager.getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });

      if (result.success && result.data) {
        setHasPermission(true);
        return result.data;
      } else {
        setError(result.error || 'Failed to get location');
        return null;
      }
    } catch (err) {
      console.log('Error getting current location:', err);
      setError('Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    isLoading,
    error,
    getCurrentLocation,
    requestPermission,
    checkPermission
  };
};

export default useLocationPermission;

