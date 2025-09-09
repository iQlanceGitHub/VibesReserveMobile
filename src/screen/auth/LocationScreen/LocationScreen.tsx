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
import { BackButton } from "../../../components/BackButton";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Location from "../../../assets/svg/location";
import styles from "./styles";

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

  console.log("route?.params?.id", route?.params?.id);

  // Check if location permission is already granted
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // For web browsers
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          setHasLocationPermission(permissionStatus.state === 'granted');
          permissionStatus.onchange = () => {
            setHasLocationPermission(permissionStatus.state === 'granted');
          };
        } catch (error) {
          console.error('Error checking location permission:', error);
        }
      }
    } else {
      // For React Native, you would use a permissions library
      // For now, we'll assume permission is not granted
      setHasLocationPermission(false);
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      Alert.alert("Error", "Geolocation is not supported by your device/browser");
      setIsLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    };

    const geoSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log("Location obtained:", latitude, longitude);
      
      // For demo purposes, we'll just navigate with the coordinates
      // In a real app, you would reverse geocode to get an address
      navigation.navigate('NextScreen', {
        locationData: {
          latitude,
          longitude,
          address: "Current Location",
          isCurrentLocation: true
        }
      });
      
      setIsLoading(false);
    };

    const geoError = (error: GeolocationPositionError) => {
      setIsLoading(false);
      console.error('Location error:', error);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          Alert.alert(
            "Location Access Denied",
            "Please enable location permissions in your device settings to use this feature",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
                // For web, we can't open browser settings
              }}
            ]
          );
          break;
        case error.POSITION_UNAVAILABLE:
          Alert.alert("Location Unavailable", "Your location could not be determined. Please try again.");
          break;
        case error.TIMEOUT:
          Alert.alert("Location Timeout", "The request to get your location timed out. Please try again.");
          break;
        default:
          Alert.alert("Location Error", "An error occurred while getting your location.");
          break;
      }
    };

    // Request location
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  };

  // Function to request location permission
  const requestLocationPermission = () => {
    if (Platform.OS === 'web') {
      // For web browsers, we need to call getCurrentPosition to trigger the permission prompt
      getCurrentLocation();
    } else {
      // For React Native, you would use a permissions library
      // For now, we'll just try to get the location
      getCurrentLocation();
    }
  };

  // Function to handle the button press
  const handleLocationAccess = () => {
    if (hasLocationPermission) {
      getCurrentLocation();
    } else {
      requestLocationPermission();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
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
                onPress={handleLocationAccess}
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
                onPress={() => navigation.navigate('LocationManuallyScreen')}
                disabled={isLoading}
              >
                <Text style={[styles.manualLink, isLoading && { opacity: 0.5 }]}>
                  Enter Location Manually
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LocationScreen;