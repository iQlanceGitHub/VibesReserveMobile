import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData, getCurrentLocation, checkLocationPermission, getLocationDisplayText, getShortLocationDisplayText } from '../utilis/locationUtils';

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

  // Load location from storage on mount
  useEffect(() => {
    loadLocationFromStorage();
  }, []);

  const loadLocationFromStorage = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        setLocationDataState(parsedLocation);
        console.log('Loaded location from storage:', parsedLocation);
      }
    } catch (error) {
      console.log('Error loading location from storage:', error);
    }
  };

  const saveLocationToStorage = async (location: LocationData) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
      console.log('Saved location to storage:', location);
    } catch (error) {
      console.log('Error saving location to storage:', error);
    }
  };

  const refreshLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check permission first
      const permissionResult = await checkLocationPermission();
      
      if (!permissionResult.granted) {
        setError(permissionResult.message || 'Location permission denied');
        setIsLoading(false);
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      
      // Update state
      setLocationDataState(location);
      
      // Save to storage
      await saveLocationToStorage(location);
      
      console.log('Location refreshed:', location);
    } catch (error) {
      console.log('Error refreshing location:', error);
      setError('Failed to get current location');
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

