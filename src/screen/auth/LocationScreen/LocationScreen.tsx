import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Location from "../../../assets/svg/location";
import styles from "./styles";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geocoder from 'react-native-geocoding';
import LocationPermissionManager from '../../../utilis/locationPermissionUtils';
import { useLocationPermission } from '../../../hooks/useLocationPermission';
//API
import {
  onUpdateLocation,
  updateLocationData,
  updateLocationError,
} from '../../../redux/auth/actions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from "../../../utilis/toastUtils.tsx";

// Initialize Geocoder
Geocoder.init('AIzaSyCfQjOzSoQsfX2h6m4jc2SaOzJB2pG0x7Y');

interface LocationScreenProps {
  navigation?: any;
  route?: {
    params?: {
      id?: string;
    };
  };
}

const LocationScreen: React.FC<LocationScreenProps> = ({
  navigation,
  route,
}) => {
  const [permissionMsg, setPermissionMsg] = useState('');
  const insets = useSafeAreaInsets();
  const [uid, setUid] = useState(route?.params?.id);
  
  // Use location permission hook
  const { hasPermission: hasLocationPermission, isLoading, error, getCurrentLocation } = useLocationPermission();

  const dispatch = useDispatch();
  const updateLocation = useSelector((state: any) => state.auth.updateLocation);
  const updateLocationErr = useSelector((state: any) => state.auth.updateLocationErr);
  const [formData, setFormData] = useState({
    id: "", // id as string
    longitude: "",
    latitude: "",
  });


  useEffect(() => {
    if (
      updateLocation?.status === true ||
      updateLocation?.status === 'true' ||
      updateLocation?.status === 1 ||
      updateLocation?.status === "1"
    ) {
      console.log("updateLocation:+>", updateLocation);
      navigation.navigate('VerificationSucessScreen',  { id: uid });
      //  setMsg(updateLocation?.message?.toString());
      showToast(
        "success",
        updateLocation?.message || "Something went wrong. Please try again."
      );
      dispatch(updateLocationData(''));
    }

    if (updateLocationErr) {
      console.log("updateLocationErr:+>", updateLocationErr);
      showToast(
        "error",
        updateLocationErr?.message || "Something went wrong. Please try again."
      );
      dispatch(updateLocationError(''));
    }
  }, [updateLocation, updateLocationErr]);

  // Auto-request permission on component mount
  useEffect(() => {
    const autoRequestPermission = async () => {
      try {
        const hasPermission = await LocationPermissionManager.checkLocationPermission();
        
        if (!hasPermission.granted) {
          // Automatically request permission when screen loads
          const permissionResult = await LocationPermissionManager.requestLocationPermission();
          
          if (permissionResult.granted) {
            // Permission granted, automatically get location
            handleGetCurrentLocation();
          }
        } else {
          // Permission already granted, automatically get location
          handleGetCurrentLocation();
        }
      } catch (error) {
        console.log('Error in auto-request permission:', error);
      }
    };

    autoRequestPermission();
  }, [uid]);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await Geocoder.from(latitude, longitude);

      if (response.results.length > 0) {
        const address = response.results[0].formatted_address;
        return address;
      }
      return null;
    } catch (error) {
      console.log('Geocoding error:', error);
      return null;
    }
  };


  const handleLocationObtained = (latitude: number, longitude: number, id?: string) => {
    console.log("Location obtained:", latitude, longitude);
    
    setFormData(prev => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      id: id || prev.id // Keep existing id or use new one
    }));
  };

  // Function to get current location with automatic permission handling
  const handleGetCurrentLocation = async () => {
    try {
      // First check if we already have permission
      const hasPermission = await LocationPermissionManager.checkLocationPermission();
      
      if (!hasPermission.granted) {
        // Request permission first
        const permissionResult = await LocationPermissionManager.requestLocationPermission();
        
        if (!permissionResult.granted) {
          // Permission denied, show alert to go to settings
          Alert.alert(
            'Location Permission Required',
            'Please enable location permission in settings to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => Linking.openSettings() 
              }
            ]
          );
          return;
        }
      }
      
      // Now get the location
      const locationResult = await LocationPermissionManager.getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });
      
      if (locationResult.success && locationResult.data) {
        const locationData = locationResult.data;
        console.log("Location obtained:", locationData.latitude, locationData.longitude);
        
        const fullAddress = await getAddressFromCoordinates(locationData.latitude, locationData.longitude);

        if (fullAddress) {
          handleLocationObtained(locationData.latitude, locationData.longitude, uid);
          setPermissionMsg(`Current detected location\n\n${fullAddress}`);
        } else {
          // Fallback if geocoding fails
          handleLocationObtained(locationData.latitude, locationData.longitude, uid);
          setPermissionMsg(`Current detected location\n\nLat: ${locationData.latitude.toFixed(6)}, Lng: ${locationData.longitude.toFixed(6)}`);
        }
      } else {
        showToast('error', locationResult.error || 'Failed to get location');
      }
    } catch (err) {
      console.log('Error in handleGetCurrentLocation:', err);
      showToast('error', 'An error occurred while getting your location');
    }
  };

  const handleConfirmLocation = () => {
    console.log('permisson', permissionMsg)
    const obj = {
      "userId": formData.id,        // uid from formData.id
      "longitude": formData.longitude, // longitude from formData.longitude
      "latitude": formData.latitude,   // latitude from formData.latitude
    };
    
    console.log("Dispatching location update:", obj);
    dispatch(onUpdateLocation(obj));
    setPermissionMsg('');
  };

  const handleChangeLocation = () => {
    setPermissionMsg('');
    navigation.navigate('LocationManuallyScreen', { id: uid });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.congratulationContainer}>
            <Location />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>What is Your Location?</Text>

            <Text style={styles.discriptionText}>
              To Find Nearby Events, Share Your Location with Us.
            </Text>

            <View style={styles.buttonSection}>
              <Buttons
                title={isLoading ? "Getting Location..." : (permissionMsg ? "Get Current Location" : "Allow Location Access")}
                onPress={handleGetCurrentLocation}
                style={styles.getStartedButton}
                isCap={false}
                disabled={isLoading}
              />
              
              {isLoading && (
                <ActivityIndicator 
                  size="small" 
                  color={colors.white} 
                  style={{ marginTop: 10 }}
                />
              )}
              
              <TouchableOpacity
                style={styles.manualContainer}
                onPress={() =>  navigation.navigate('LocationManuallyScreen', { id: uid })}
                disabled={isLoading}
              >
                <Text style={[styles.manualLink, isLoading && { opacity: 0.5 }]}>
                  Enter Location Manually
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
        
        {/* Custom Alert for location confirmation */}
        {permissionMsg !== '' && (
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>Confirm Your Location</Text>
              <Text style={styles.alertMessage}>{permissionMsg}</Text>
              <View style={styles.alertButtons}>
                <TouchableOpacity 
                  style={[styles.alertButton, styles.changeButton]}
                  onPress={handleChangeLocation}
                >
                  <Text style={styles.changeButtonText}>Change location</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.alertButton, styles.confirmButton]}
                  onPress={handleConfirmLocation}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.alertTooltip}>
                We use location to help you find events near you.
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default LocationScreen;