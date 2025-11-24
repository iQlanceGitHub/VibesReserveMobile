import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData, getCurrentLocation, checkLocationPermission, requestLocationPermission, getLocationDisplayText, getShortLocationDisplayText } from '../utilis/locationUtils';
import LocationPermissionManager from '../utilis/locationPermissionUtils';

interface LocationContextType {
  locationData: LocationData | null;
  locationDisplayText: string;
  shortLocationDisplayText: string;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  setLocationData: (location: LocationData) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

const LOCATION_STORAGE_KEY = 'user_location_data';

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locationData, setLocationDataState] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const locationDisplayText = locationData ? getLocationDisplayText(locationData) : 'Location not available';
  const shortLocationDisplayText = locationData ? getShortLocationDisplayText(locationData) : 'Location not available';

  // Load location from storage on mount and request permission if needed
  useEffect(() => {
    loadLocationFromStorage();
    // Automatically request location permission on app startup
    requestLocationPermissionOnStartup();
  }, []);

  const loadLocationFromStorage = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        setLocationDataState(parsedLocation);
      }
    } catch (error) {
    }
  };

  const requestLocationPermissionOnStartup = async () => {
    try {
      // Check if permission is already granted
      const permissionResult = await checkLocationPermission();
      
      if (!permissionResult.granted) {
        
        // Request permission
        const requestResult = await requestLocationPermission();
        
        if (requestResult.granted) {
          // Permission granted, try to get location
          await refreshLocation();
        } else {
          // Show permission denied alert with option to open settings
          LocationPermissionManager.showPermissionDeniedAlert(
            'Location Permission Required',
            'This app needs location access to find nearby events and clubs. Please enable location permission in Settings to get the best experience.',
            () => {
              setError('Location permission denied');
            },
            () => {
            }
          );
          setError('Location permission denied');
        }
      } else {
        // Permission already granted, try to get location
        await refreshLocation();
      }
    } catch (error) {
      setError('Failed to request location permission');
    }
  };

  const saveLocationToStorage = async (location: LocationData) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
    }
  };

  const refreshLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check permission first
      const permissionResult = await checkLocationPermission();
      
      if (!permissionResult.granted) {
        const errorMessage = permissionResult.message || 'Location permission denied';
        setError(errorMessage);
        setIsLoading(false);
        
        // Show permission denied alert
        LocationPermissionManager.showPermissionDeniedAlert(
          'Location Permission Required',
          'This app needs location access to find nearby events and clubs. Please enable location permission in Settings to get the best experience.',
          () => {
          },
          () => {
          }
        );
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      
      // Update state
      setLocationDataState(location);
      
      // Save to storage
      await saveLocationToStorage(location);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current location';
      setError(errorMessage);
      
      // Show location error alert with retry option
      LocationPermissionManager.showLocationErrorAlert(
        errorMessage,
        () => {
          refreshLocation();
        },
        () => {
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setLocationData = (location: LocationData) => {
    setLocationDataState(location);
    saveLocationToStorage(location);
  };

  const value: LocationContextType = {
    locationData,
    locationDisplayText,
    shortLocationDisplayText,
    isLoading,
    error,
    refreshLocation,
    setLocationData,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

