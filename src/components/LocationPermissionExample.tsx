import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocationPermission } from '../hooks/useLocationPermission';
import { showToast } from '../utilis/toastUtils';

/**
 * Example component showing how to use location permissions in any screen
 * This can be copied and adapted for other screens that need location access
 */
const LocationPermissionExample: React.FC = () => {
  const { hasPermission, isLoading, error, getCurrentLocation, requestPermission } = useLocationPermission();

  const handleGetLocation = async () => {
    try {
      const locationData = await getCurrentLocation();
      
      if (locationData) {
        showToast('success', `Location: ${locationData.latitude}, ${locationData.longitude}`);
      } else {
        showToast('error', 'Failed to get location');
      }
    } catch (error) {
      showToast('error', 'Failed to get location');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();
      
      if (granted) {
        showToast('success', 'Location permission granted');
      } else {
        showToast('error', 'Location permission denied');
      }
    } catch (error) {
      showToast('error', 'Failed to request permission');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Location Permission Status: {hasPermission ? 'Granted' : 'Denied'}
      </Text>
      
      {error && (
        <Text style={{ color: 'red', marginBottom: 20 }}>
          Error: {error}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handleRequestPermission}
        disabled={isLoading}
        style={{
          backgroundColor: hasPermission ? '#4CAF50' : '#FF9800',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
          opacity: isLoading ? 0.6 : 1
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Requesting...' : hasPermission ? 'Permission Granted' : 'Request Permission'}
        </Text>
      </TouchableOpacity>
      
      {hasPermission && (
        <TouchableOpacity
          onPress={handleGetLocation}
          disabled={isLoading}
          style={{
            backgroundColor: '#2196F3',
            padding: 15,
            borderRadius: 8,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isLoading ? 'Getting Location...' : 'Get Current Location'}
          </Text>
        </TouchableOpacity>
      )}
      
      {isLoading && (
        <ActivityIndicator 
          size="small" 
          color="#2196F3" 
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

export default LocationPermissionExample;

