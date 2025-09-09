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
  KeyboardAvoidingView
} from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import { BackButton } from "../../../components/BackButton";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import * as appConstant from "../../../utilis/appConstant";
import styles from "./styles";
import { CustomeSearchTextInput } from "../../../components/textinput";

import LocationIcon from "../../../assets/svg/locationIcon";
import SearchIcon from "../../../assets/svg/searchIcon";
import CloseIcon from "../../../assets/svg/closeIcon";
import CurrentLocationIcon from "../../../assets/svg/locationIcon";


interface LocationManuallyScreenProps {
  navigation?: any;
}

const LocationManuallyScreen: React.FC<LocationManuallyScreenProps> = ({
  navigation,
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
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "Golden Avenue",
      address: "8502 Preston Rd. Ingl..",
    }
  ]);
  const [showResults, setShowResults] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowResults(value.length > 0);
  };

  const handleClearInput = () => {
    setFormData({ location: "" });
    setShowResults(false);
  };

  const handleSelectLocation = (location: any) => {
    setFormData({ location: location.name });
    setShowResults(false);
  };

  const handleUseCurrentLocation = () => {
    // Implement current location functionality using Google Maps API
    Alert.alert("Current Location", "Using your current location");
  };

  const handleSubmit = async () => {
    if (!formData.location.trim()) {
      setErrors({ location: true });
      setErrorMessages({ location: "Please enter a location" });
      return;
    }
    
    // Navigate to next screen or process location
    navigation.navigate('NextScreen');
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
                  placeholder="Golden Avenue"
                  onChangeText={(text) => handleInputChange("location", text)}
                  error={errors.location}
                  message={errorMessages.location}
                  leftImage={<SearchIcon />}
                  rightIcon={formData.location ? <CloseIcon onPress={handleClearInput} /> : null}
                  style={styles.customInput}
                />
              </View>

              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={handleUseCurrentLocation}
              >
                <CurrentLocationIcon />
                <Text style={styles.currentLocationText}>Use my current location</Text>
              </TouchableOpacity>

              {showResults && searchResults.length > 0 && (
                <View style={styles.resultsContainer}>
                  <Text style={styles.resultsTitle}>SEARCH RESULT</Text>
                  {searchResults.map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.resultItem}
                      onPress={() => handleSelectLocation(result)}
                    >
                      <View style={{  flexDirection: 'row',}}>
                      <CurrentLocationIcon />
                      <Text style={styles.resultName}>{result.name}</Text>
                      </View>
                      <Text style={styles.resultAddress}>{result.address}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

          
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LocationManuallyScreen;