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
import Congratulation from "../../../assets/svg/congratulation";


interface VerificationSucessScreenProps {
  navigation?: any;
}
import styles from "./styles";

const PasswordChangedSucessScreen: React.FC<VerificationSucessScreenProps> = ({
  navigation,
}) => {
 
  const handleSubmit = async () => {
    navigation?.replace("SignInScreen");
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
            <View style={styles.congratulationContainer}>
          <Congratulation />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Password Changed</Text>
            
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.discriptionText}>
            Your password has been changed successfully.</Text>
            
  <View style={styles.buttonSection}>
              <Buttons
                title="Back to Sign In"
                onPress={() => handleSubmit()}
                style={styles.getStartedButton}
                isCap={false}
              />
            </View>
    

        
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default PasswordChangedSucessScreen;
