import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { colors } from "../../../utilis/colors";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Location from "../../../assets/svg/location";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Geocoder from "react-native-geocoding";
import LocationPermissionManager from "../../../utilis/locationPermissionUtils";
import { useLocationPermission } from "../../../hooks/useLocationPermission";
//API
import {
  onUpdateLocation,
  updateLocationData,
  updateLocationError,
} from "../../../redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../utilis/toastUtils.tsx";

// Initialize Geocoder
Geocoder.init("AIzaSyANTuJKviWz3jnUFMiqr_1FgghfAAek0q8");

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
  const [permissionMsg, setPermissionMsg] = useState("");
  const insets = useSafeAreaInsets();
  const [uid, setUid] = useState(route?.params?.id);

  // Use location permission hook
  const {
    hasPermission: hasLocationPermission,
    isLoading,
    error,
    getCurrentLocation,
  } = useLocationPermission();

  const dispatch = useDispatch();
  const updateLocation = useSelector((state: any) => state.auth.updateLocation);
  const updateLocationErr = useSelector(
    (state: any) => state.auth.updateLocationErr
  );
  const [formData, setFormData] = useState({
    id: "", // id as string
    longitude: "",
    latitude: "",
    address: "",
  });

  useEffect(() => {
    if (
      updateLocation?.status === true ||
      updateLocation?.status === "true" ||
      updateLocation?.status === 1 ||
      updateLocation?.status === "1"
    ) {
      navigation.navigate("VerificationSucessScreen", { id: uid });
      //  setMsg(updateLocation?.message?.toString());
      showToast(
        "success",
        updateLocation?.message || "Something went wrong. Please try again."
      );
      dispatch(updateLocationData(""));
    }

    if (updateLocationErr) {
      showToast(
        "error",
        updateLocationErr?.message || "Something went wrong. Please try again."
      );
      dispatch(updateLocationError(""));
    }
  }, [updateLocation, updateLocationErr]);

  // Removed auto-request permission - now only triggered by user button tap

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      console.log('Geocoding response:', JSON.stringify(response, null, 2));

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const addressComponents = result.address_components;
        
        // Extract city, state, and country
        let city = '';
        let state = '';
        let country = '';
        
        if (addressComponents && Array.isArray(addressComponents)) {
          addressComponents.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          });
        }
        
        // Format address as "City, State, Country"
        const formattedAddress = [city, state, country].filter(Boolean).join(', ');
        console.log('Formatted address:', formattedAddress);
        
        // Return formatted address or fallback to full formatted address
        return formattedAddress || result.formatted_address || 'Address not available';
      }
      return null;
    } catch (error) {
      console.log('Geocoding error:', error);
      return null;
    }
  };

  const handleLocationObtained = async (
    latitude: number,
    longitude: number,
    id?: string
  ) => {

    try {
      // Get address using reverse geocoding
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0]?.formatted_address || "";
      

      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: address,
        id: id || prev.id, // Keep existing id or use new one
      }));
    } catch (error) {
      // Set location without address if geocoding fails
      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: "",
        id: id || prev.id,
      }));
    }
  };

  // Function to get current location with automatic permission handling
  const handleGetCurrentLocation = async () => {
    try {
      // First check if we already have permission
      const hasPermission =
        await LocationPermissionManager.checkLocationPermission();

      if (!hasPermission.granted) {
        // Request permission first
        const permissionResult =
          await LocationPermissionManager.requestLocationPermission();

        if (!permissionResult.granted) {
          // Permission denied, show alert to go to settings
          Alert.alert(
            "Location Permission Required",
            "Please enable location permission in settings to continue.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return;
        }
      }

      // Now get the location
      const locationResult = await LocationPermissionManager.getCurrentLocation(
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );

      if (locationResult.success && locationResult.data) {
        const locationData = locationResult.data;

        // Always try to get address first
        let fullAddress = await getAddressFromCoordinates(
          locationData.latitude,
          locationData.longitude
        );
        console.log('First attempt address:', fullAddress);

        // If geocoding fails, try again with a different approach
        if (!fullAddress) {
          try {
            const response = await Geocoder.from(locationData.latitude, locationData.longitude);
            console.log('Retry geocoding response:', JSON.stringify(response, null, 2));
            if (response.results && response.results.length > 0) {
              fullAddress = response.results[0].formatted_address;
              console.log('Retry address:', fullAddress);
            }
          } catch (retryError) {
            console.log('Retry geocoding failed:', retryError);
          }
        }

        // If still no address, show a generic message instead of coordinates
        if (!fullAddress) {
          fullAddress = "Location detected (Address unavailable)";
        }

        console.log('Final address to display:', fullAddress);

        await handleLocationObtained(
          locationData.latitude,
          locationData.longitude,
          uid
        );
        setPermissionMsg(`Current detected location\n\n${fullAddress}`);
      } else {
        showToast("error", locationResult.error || "Failed to get location");
      }
    } catch (err) {
      showToast("error", "An error occurred while getting your location");
    }
  };

  const handleConfirmLocation = () => {
    const obj = {
      userId: formData.id, // uid from formData.id
      longitude: formData.longitude, // longitude from formData.longitude
      latitude: formData.latitude, // latitude from formData.latitude
      address: formData.address, // address from formData.address
    };

    dispatch(onUpdateLocation(obj));
    setPermissionMsg("");
  };

  const handleChangeLocation = () => {
    setPermissionMsg("");
    navigation.navigate("LocationManuallyScreen", { id: uid });
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
                title={
                  isLoading
                    ? "Getting Location..."
                    : permissionMsg
                    ? "Get Current Location"
                    : "Allow Location Access"
                }
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
                onPress={() =>
                  navigation.navigate("LocationManuallyScreen", { id: uid })
                }
                disabled={isLoading}
              >
                <Text
                  style={[styles.manualLink, isLoading && { opacity: 0.5 }]}
                >
                  Enter Location Manually
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Custom Alert for location confirmation */}
        {permissionMsg !== "" && (
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
