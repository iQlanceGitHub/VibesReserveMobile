import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking
} from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
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
} from '../../../redux/auth/actions';
import { showToast } from "../../../utilis/toastUtils.tsx";

import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [uid, setUid] = useState(route?.params?.id);

  const dispatch = useDispatch();
  const updateLocation = useSelector((state: any) => state.auth.updateLocation);
  const updateLocationErr = useSelector((state: any) => state.auth.updateLocationErr);

  // Google Maps API key (store this securely in your app configuration)
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAuNmySs9bQau79bffjocK1CM-neMrXdaY';

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

      if (data.status === 'OK') {
        const results: LocationResult[] = data.predictions.map((prediction: any, index: number) => {
          return {
            id: prediction.place_id || String(index),
            name: prediction.structured_formatting.main_text,
            address: prediction.structured_formatting.secondary_text,
            fullAddress: prediction.description,
            latitude: 0, // Will be fetched when selected
            longitude: 0 // Will be fetched when selected
          };
        });

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      Alert.alert('Error', 'Failed to search locations. Please check your connection.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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

  // Function to get place details including lat/lng
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.result.geometry.location;
        return {
          latitude: lat,
          longitude: lng,
          fullAddress: data.result.formatted_address
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  };

  // Function to get current location using browser's geolocation API
  const getCurrentLocation = () => {
    setIsLoadingCurrentLocation(true);

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocode to get address from coordinates
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );

            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              setFormData({ location: address });

              // You can pass this data to the next screen
              const locationData = {
                address,
                latitude,
                longitude
              };

              // Navigate with the location data
              const obj = {
                "userId": uid,
                "longitude": latitude,
                "latitude": longitude,
              }
              dispatch(onUpdateLocation(obj))
            } else {
              Alert.alert("Error", "Could not get address for your location");
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            Alert.alert("Error", "Failed to get your location address");
          } finally {
            setIsLoadingCurrentLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert(
            "Location Access Required",
            "Please enable location services to use this feature",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
          );
          setIsLoadingCurrentLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      Alert.alert("Error", "Geolocation is not supported by this browser");
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
      longitude: location.longitude
    };

    console.log('Selected location:==', locationData);
    const obj = {
      "userId": uid,
      "longitude": location.latitude,
      "latitude": location.longitude,
    }
    dispatch(onUpdateLocation(obj))
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleSubmit = async () => {
    if (!formData.location.trim()) {
      setErrors({ location: true });
      setErrorMessages({ location: "Please enter a location" });
      return;
    }

    // If user typed manually without selecting from suggestions,
    // we need to geocode the address to get lat/lng
    if (searchResults.length === 0 || !searchResults.some(result =>
      result.fullAddress === formData.location)) {

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            formData.location
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const address = data.results[0].formatted_address;

          const locationData = {
            address,
            latitude: lat,
            longitude: lng
          };
          console.log("locationData:==>", locationData);
          const obj = {
            "userId": uid,
            "longitude": lat,
            "latitude": lng,
          }
          dispatch(onUpdateLocation(obj))
         
        } else {
          Alert.alert("Error", "Could not find the specified location");
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
        Alert.alert("Error", "Failed to validate the location");
      } finally {
        setIsLoading(false);
      }
    } else {
      // If we already have the data from search results
      const selectedLocation = searchResults.find(result =>
        result.fullAddress === formData.location);

      if (selectedLocation) {
        const locationData = {
          address: selectedLocation.fullAddress,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
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
                disabled={isLoadingCurrentLocation}
              >
                {isLoadingCurrentLocation ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <CurrentLocationIcon />
                )}
                <Text style={styles.currentLocationText}>
                  {isLoadingCurrentLocation ? "Getting location..." : "Use my current location"}
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
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LocationIcon />
                        <View style={styles.resultTextContainer}>
                          <Text style={styles.resultName}>{result.name}</Text>
                          <Text style={styles.resultAddress}>{result.address}</Text>
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