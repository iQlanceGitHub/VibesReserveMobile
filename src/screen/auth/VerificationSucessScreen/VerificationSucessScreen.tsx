import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { colors } from "../../../utilis/colors";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Congratulation from "../../../assets/svg/congratulation";


interface VerificationSucessScreenProps {
  navigation?: any;
  route?: {
    params?: {
      id?: string;
    };
  };
}
import styles from "./styles";

const VerificationSucessScreen: React.FC<VerificationSucessScreenProps> = ({
  navigation,
  route,
}) => {


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
          <View style={styles.content}>
            <View style={styles.congratulationContainer}>
              <Congratulation />
            </View>

            <Text style={styles.title}>You're all set!</Text>

            <Text style={styles.discriptionText}>
              Thank you for registering your account
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <Buttons
              title="Get Started"
              onPress={() => navigation.replace('WelcomeScreen')}
              style={styles.getStartedButton}
              isCap={false}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default VerificationSucessScreen;
