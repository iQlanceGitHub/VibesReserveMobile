import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { colors } from "../../../utilis/colors";
import { BackButton } from "../../../components/BackButton";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { CustomeSearchTextInput } from "../../../components/textinput";

import LocationIcon from "../../../assets/svg/locationIcon";
import SearchIcon from "../../../assets/svg/searchIcon";
import CloseIcon from "../../../assets/svg/closeIcon";
import CurrentLocationIcon from "../../../assets/svg/locationIcon";
import { Buttons } from "../../../components/buttons";

//API
import {
  onUpdateLocation,
  updateLocationData,
  updateLocationError,
} from "../../../redux/auth/actions";
import { showToast } from "../../../utilis/toastUtils.tsx";

import { useDispatch, useSelector } from "react-redux";
import { CustomAlertSingleBtn } from "../../../components/CustomeAlertDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocationPermission } from "../../../hooks/useLocationPermission";
import Geocoder from "react-native-geocoding";

// Initialize Geocoder
Geocoder.init("AIzaSyANTuJKviWz3jnUFMiqr_1FgghfAAek0q8");
// Define types for location data
interface LocationResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}

interface LocationManuallyScreenProps {
  navigation?: any;
  route?: {
    params?: {
      id?: string;
    };
  };
}

const LocationManuallyScreen: React.FC<LocationManuallyScreenProps> = ({
  navigation,
  route,
}) => {
  const [formData, setFormData] = useState({
    location: "",
  });
  const [errors, setErrors] = useState({
    location: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    location: "",
  });
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
    useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [uid, setUid] = useState(route?.params?.id);

  // Use location permission hook
  const {
    hasPermission,
    isLoading: isLocationLoading,
    getCurrentLocation,
  } = useLocationPermission();

  const dispatch = useDispatch();
  const updateLocation = useSelector((state: any) => state.auth.updateLocation);
  const updateLocationErr = useSelector(
    (state: any) => state.auth.updateLocationErr
  );

  // Google Maps API key (store this securely in your app configuration)
  const GOOGLE_MAPS_API_KEY = "AIzaSyANTuJKviWz3jnUFMiqr_1FgghfAAek0q8";

  // Function to search locations using Google Maps API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&types=geocode`
      );

      const data = await response.json();

      if (data.status === "OK") {
        const results: LocationResult[] = data.predictions.map(
          (prediction: any, index: number) => {
            return {
              id: prediction.place_id || String(index),
              name: prediction.structured_formatting.main_text,
              address: prediction.structured_formatting.secondary_text,
              fullAddress: prediction.description,
              latitude: 0, // Will be fetched when selected
              longitude: 0, // Will be fetched when selected
            };
          }
        );

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to search locations. Please check your connection."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Function to get place details including lat/lng
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.result.geometry.location;
        return {
          latitude: lat,
          longitude: lng,
          fullAddress: data.result.formatted_address,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Function to get current location using React Native geolocation
  const handleGetCurrentLocation = async () => {
    setIsLoadingCurrentLocation(true);

    try {
      const locationData = await getCurrentLocation();

      if (locationData) {
        const { latitude, longitude } = locationData;

        try {
          // Reverse geocode to get address using Geocoder
          const response = await Geocoder.from(latitude, longitude);

          if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            setFormData({ location: address });

            // Update location data
            const locationInfo = {
              address,
              latitude,
              longitude,
            };

            // Dispatch location update
            const obj = {
              userId: uid,
              longitude: longitude,
              latitude: latitude,
              address: address,
            };
            dispatch(onUpdateLocation(obj));

            showToast("success", "Location obtained successfully");
          } else {
            // Fallback if geocoding fails
            setFormData({
              location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(
                6
              )}`,
            });

            //   const obj = {
            //     userId: uid,
            //     longitude: longitude,
            //     latitude: latitude,
            //     address: address,
            //   };
            //   dispatch(onUpdateLocation(obj));

            // showToast("success", "Location obtained (coordinates only)");
          }
        } catch (geocodingError) {
          // Fallback with coordinates
          setFormData({
            location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(
              6
            )}`,
          });

          const obj = {
            userId: uid,
            longitude: longitude,
            latitude: latitude,
            address: address,
          };
          dispatch(onUpdateLocation(obj));

          showToast("success", "Location obtained (coordinates only)");
        }
      } else {
        showToast("error", "Failed to get current location");
      }
    } catch (error) {
      showToast("error", "Failed to get current location");
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    if (value.length > 2) {
      setShowResults(true);
      const timeout = setTimeout(() => {
        searchLocations(value);
      }, 500); // 500ms debounce

      setSearchTimeout(timeout);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleClearInput = () => {
    setFormData({ location: "" });
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSelectLocation = async (location: LocationResult) => {
    // If we don't have lat/lng, fetch place details
    if (location.latitude === 0 && location.longitude === 0) {
      const details = await getPlaceDetails(location.id);
      if (details) {
        location.latitude = details.latitude;
        location.longitude = details.longitude;
        location.fullAddress = details.fullAddress;
      }
    }

    setFormData({ location: location.fullAddress });
    setShowResults(false);

    // You can pass this data to the next screen or store it
    const locationData = {
      address: location.fullAddress,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const obj = {
      userId: uid,
      longitude: location.longitude,
      latitude: location.latitude,
      address: location.address || locationData.address,
    };
    dispatch(onUpdateLocation(obj));
  };

  const handleUseCurrentLocation = () => {
    handleGetCurrentLocation();
  };

  const handleSubmit = async () => {
    if (!formData.location.trim()) {
      setErrors({ location: true });
      setErrorMessages({ location: "Please enter a location" });
      return;
    }

    // If user typed manually without selecting from suggestions,
    // we need to geocode the address to get lat/lng
    if (
      searchResults.length === 0 ||
      !searchResults.some((result) => result.fullAddress === formData.location)
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            formData.location
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const address = data.results[0].formatted_address;

          const locationData = {
            address,
            latitude: lat,
            longitude: lng,
          };
          const obj = {
            userId: uid,
            longitude: lng,
            latitude: lat,
            address: locationData.address,
          };
          dispatch(onUpdateLocation(obj));
        } else {
          Alert.alert("Error", "Could not find the specified location");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to validate the location");
      } finally {
        setIsLoading(false);
      }
    } else {
      // If we already have the data from search results
      const selectedLocation = searchResults.find(
        (result) => result.fullAddress === formData.location
      );

      if (selectedLocation) {
        const locationData = {
          address: selectedLocation.fullAddress,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        };
      }
    }
  };

  const handleBack = () => {
    navigation?.goBack();
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
          <View style={styles.header}>
            <BackButton navigation={navigation} onBackPress={handleBack} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <ScrollView style={styles.scrollView}>
              <Text style={styles.title}>Enter Your Location</Text>

              <View style={styles.inputContainer}>
                <CustomeSearchTextInput
                  label=""
                  value={formData.location}
                  placeholder="Enter your current location"
                  onChangeText={(text) => handleInputChange("location", text)}
                  error={errors.location}
                  message={errorMessages.location}
                  leftImage={<SearchIcon />}
                  rightIcon={formData.location ? <CloseIcon /> : null} // Pass CloseIcon as rightIcon
                  style={styles.customInput}
                />
              </View>

              <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={handleUseCurrentLocation}
                disabled={isLoadingCurrentLocation || isLocationLoading}
              >
                {isLoadingCurrentLocation || isLocationLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <CurrentLocationIcon />
                )}
                <Text style={styles.currentLocationText}>
                  {isLoadingCurrentLocation || isLocationLoading
                    ? "Getting location..."
                    : "Use my current location"}
                </Text>
              </TouchableOpacity>

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.white} />
                  <Text style={styles.loadingText}>Searching locations...</Text>
                </View>
              )}

              {showResults && searchResults.length > 0 && (
                <View style={styles.resultsContainer}>
                  <Text style={styles.resultsTitle}>SEARCH RESULTS</Text>
                  {searchResults.map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.resultItem}
                      onPress={() => handleSelectLocation(result)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <LocationIcon />
                        <View style={styles.resultTextContainer}>
                          <Text style={styles.resultName}>{result.name}</Text>
                          <Text style={styles.resultAddress}>
                            {result.address}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {showResults && searchResults.length === 0 && !isLoading && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Buttons
                title={isLoading ? "Getting Location..." : "Next"}
                onPress={handleSubmit} // Remove the arrow function wrapper
                style={styles.getStartedButton}
                isCap={false}
                disabled={isLoading}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LocationManuallyScreen;
