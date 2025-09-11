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
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geocoder from 'react-native-geocoding';
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [permissionMsg, setPermissionMsg] = useState('');
  const insets = useSafeAreaInsets();
  const [uid, setUid] = useState(route?.params?.id);

  const dispatch = useDispatch();
  const updateLocation = useSelector((state: any) => state.auth.updateLocation);
  const updateLocationErr = useSelector((state: any) => state.auth.updateLocationErr);
  const [formData, setFormData] = useState({
    id: "", // id as string
    longitude: "",
    latitude: "",
  });

  // Check if location permission is already granted
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      let permissionStatus;
      
      if (Platform.OS === 'ios') {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else if (Platform.OS === 'android') {
        permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }
      
      setHasLocationPermission(permissionStatus === RESULTS.GRANTED);
    } catch (error) {
      console.log('Error checking location permission:', error);
      setHasLocationPermission(false);
    }
  };

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

  const getAddressFromCoordinates = async (latitude, longitude) => {
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

  const handleLocationDenied = () => {
    Alert.alert(
      'Permission Denied',
      'Please enable location access in Settings to use this feature.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ]
    );
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

  // Function to get current location
  const getCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      // ... existing permission code ...
  
      // Permission granted, get the current position
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location obtained:", latitude, longitude);
          
          const fullAddress = await getAddressFromCoordinates(latitude, longitude);
          setIsLoading(false);
  
          if (fullAddress) {
           
            handleLocationObtained(latitude, longitude, uid);
            setPermissionMsg(`Current detected location\n\n${fullAddress}`);
          } else {
            // navigation.navigate('NextScreen', {
            //   locationData: {
            //     latitude,
            //     longitude,
            //     address: "Current Location",
            //     isCurrentLocation: true
            //   }
            // });
          }
        },
        (error) => {
          setIsLoading(false);
          console.log('Location error:', error);
          
          // Enhanced error handling
          if (error.code === 1) {
            // Permission denied
            handleLocationDenied();
          } else if (error.code === 2) {
            // Network error - provide specific guidance
            Alert.alert(
              "Network Connection Required", 
              "Unable to retrieve your location due to network issues. Please check your internet connection and try again.",
              [
                { text: 'OK', style: 'cancel' },
                { 
                  text: 'Try Again', 
                  onPress: () => getCurrentLocation() 
                }
              ]
            );
          } else if (error.code === 3) {
            // Timeout
            Alert.alert(
              "Location Timeout", 
              "The request to get your location timed out. Please try again.",
              [
                { text: 'OK', style: 'cancel' },
                { 
                  text: 'Try Again', 
                  onPress: () => getCurrentLocation() 
                }
              ]
            );
          } else {
            // Generic error
            Alert.alert(
              "Location Error", 
              "An error occurred while getting your location. Please try again.",
              [
                { text: 'OK', style: 'cancel' },
                { 
                  text: 'Try Again', 
                  onPress: () => getCurrentLocation() 
                }
              ]
            );
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    } catch (err) {
      setIsLoading(false);
      console.log('Error in getCurrentLocation:', err);
      Alert.alert(
        'Error',
        'An error occurred while requesting location permission.',
        [{ text: 'OK' }]
      );
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
                title={isLoading ? "Getting Location..." : "Allow Location Access"}
                onPress={getCurrentLocation}
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