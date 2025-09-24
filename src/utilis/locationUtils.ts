import Geolocation from 'react-native-geolocation-service';
import { Platform, Alert } from 'react-native';
import Geocoder from 'react-native-geocoding';
import LocationPermissionManager from './locationPermissionUtils';

// Initialize Geocoder with API key
Geocoder.init('AIzaSyCfQjOzSoQsfX2h6m4jc2SaOzJB2pG0x7Y');

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  state?: string;
  fullAddress: string;
}

export interface LocationPermissionResult {
  granted: boolean;
  message?: string;
}

/**
 * Check and request location permission
 */
export const checkLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const result = await LocationPermissionManager.checkLocationPermission();
    return {
      granted: result.granted,
      message: result.error
    };
  } catch (error) {
    console.log('Error checking location permission:', error);
    return { 
      granted: false, 
      message: 'Error checking location permission' 
    };
  }
};

/**
 * Request location permission
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const result = await LocationPermissionManager.requestLocationPermission();
    return {
      granted: result.granted,
      message: result.error
    };
  } catch (error) {
    console.log('Error requesting location permission:', error);
    return { 
      granted: false, 
      message: 'Error requesting location permission' 
    };
  }
};

/**
 * Get current location with reverse geocoding
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  try {
    // Use the new permission manager
    const result = await LocationPermissionManager.getCurrentLocation({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 10000
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get location');
    }

    const { latitude, longitude } = result.data;
    console.log("Location obtained:", latitude, longitude);
    
    // Reverse geocode to get address
    const addressData = await reverseGeocode(latitude, longitude);
    
    const locationData: LocationData = {
      latitude,
      longitude,
      city: addressData.city,
      country: addressData.country,
      state: addressData.state,
      fullAddress: addressData.fullAddress,
    };
    
    return locationData;
  } catch (error) {
    console.log('Error getting current location:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get address
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<{
  city: string;
  country: string;
  state?: string;
  fullAddress: string;
}> => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    const result = response.results[0];
    
    if (!result) {
      throw new Error('No address found for coordinates');
    }
    
    const addressComponents = result.address_components;
    let city = '';
    let country = '';
    let state = '';
    
    // Extract city, state, and country from address components
    addressComponents.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
    });
    
    // Fallback for city if not found
    if (!city) {
      city = result.formatted_address.split(',')[0];
    }
    
    return {
      city: city || 'Unknown City',
      country: country || 'Unknown Country',
      state: state || undefined,
      fullAddress: result.formatted_address,
    };
  } catch (error) {
    console.log('Error reverse geocoding:', error);
    // Return fallback data
    return {
      city: 'Unknown City',
      country: 'Unknown Country',
      fullAddress: `${latitude}, ${longitude}`,
    };
  }
};

/**
 * Get location display text (e.g., "Toronto, Canada" or "Toronto, ON, Canada")
 */
export const getLocationDisplayText = (locationData: LocationData): string => {
  if (locationData.state) {
    return `${locationData.city}, ${locationData.state}, ${locationData.country}`;
  } else {
    return `${locationData.city}, ${locationData.country}`;
  }
};

/**
 * Get short location display text (e.g., "Toronto, Canada")
 */
export const getShortLocationDisplayText = (locationData: LocationData): string => {
  return `${locationData.city}, ${locationData.country}`;
};

