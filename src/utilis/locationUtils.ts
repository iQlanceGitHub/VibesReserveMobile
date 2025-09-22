import Geolocation from 'react-native-geolocation-service';
import { Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';

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
    let permissionStatus;
    
    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return { granted: true };
    } else if (permissionStatus === RESULTS.DENIED) {
      // Request permission
      const requestResult = await requestLocationPermission();
      return requestResult;
    } else {
      return { 
        granted: false, 
        message: 'Location permission denied. Please enable location access in settings.' 
      };
    }
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
    let permissionStatus;
    
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    
    if (permissionStatus === RESULTS.GRANTED) {
      return { granted: true };
    } else {
      return { 
        granted: false, 
        message: 'Location permission denied. Please enable location access in settings.' 
      };
    }
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
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    // First attempt with high accuracy
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
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
          
          resolve(locationData);
        } catch (error) {
          console.log('Error processing location:', error);
          reject(error);
        }
      },
      (error) => {
        console.log('High accuracy location failed, trying fallback:', error);
        
        // Fallback with lower accuracy for Android 15 compatibility
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log("Fallback location obtained:", latitude, longitude);
              
              const addressData = await reverseGeocode(latitude, longitude);
              
              const locationData: LocationData = {
                latitude,
                longitude,
                city: addressData.city,
                country: addressData.country,
                state: addressData.state,
                fullAddress: addressData.fullAddress,
              };
              
              resolve(locationData);
            } catch (fallbackError) {
              console.log('Error processing fallback location:', fallbackError);
              reject(fallbackError);
            }
          },
          (fallbackError) => {
            console.log('Fallback location also failed:', fallbackError);
            reject(fallbackError);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000, // 5 minutes
            ...(Platform.OS === 'android' && {
              forceRequestLocation: false,
              forceLocationManager: true,
              showLocationDialog: false,
            }),
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Increased timeout for Android 15
        maximumAge: 10000,
        // Android 15+ specific options
        ...(Platform.OS === 'android' && {
          forceRequestLocation: true,
          forceLocationManager: false,
          showLocationDialog: true,
        }),
      }
    );
  });
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

