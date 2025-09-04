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
} from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import { BackButton } from "../../../components/BackButton";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../utilis/appConstant";
import Location from "../../../assets/svg/location";


interface LocationScreenProps {
  navigation?: any;
}
import styles from "./styles";

const LocationScreen: React.FC<LocationScreenProps> = ({
  navigation,
}) => {
 

  const handleSubmit = async () => {
   
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
            <Text style={styles.title}>What is Your Locations?</Text>
            
            <Text style={styles.discriptionText}>
            To Find Nearby Events, Share Your Locations with Us. </Text>
            
  <View style={styles.buttonSection}>
              <Buttons
                title="Allow Location Access"
                onPress={() => console.log('')}
                style={styles.getStartedButton}
                isCap={false}
              />
               <TouchableOpacity
              style={styles.manualContainer}
              onPress={()=> console.log('')}
            >
              <Text
                  style={[
                    styles.manualLink,
                  ]}
                >
                  Enter Location Manually
                </Text></TouchableOpacity>
            </View>
            
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LocationScreen;
