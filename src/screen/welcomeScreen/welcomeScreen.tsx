import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { colors } from "../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import GoogleIcon from "../../assets/svg/googleIcon";
import AppleIcon from "../../assets/svg/appleIcon";

import AppIconWelcome from "../../assets/svg/appIconWelcome";
import ProfileIcon from "../../assets/svg/profile";
import MicroPhoneIcon from "../../assets/svg/microPhone";

interface WelcomeScreenProps {
  navigation?: any;
}
import styles from "./styles";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleSignUp = () => {
    navigation?.navigate("signupScreen");
  };

  const handleSignIn = () => {
   // navigation?.navigate("SignInScreen");
    //navigation?.navigate("OTPVerificationScreen", { email: "test@test.com" });
    navigation?.navigate("SignInScreen");
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log("Google sign up");
  };

  const handleAppleSignUp = () => {
    // Handle Apple sign up
    console.log("Apple sign up");
  };

  const handleSkip = () => {
    // Handle skip - navigate to main app
    console.log("Skip welcome");
  };

  return (
    <View style={[styles.container]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { backgroundColor: colors.primary_blue }]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.statusBar}>
              <View style={styles.statusIcons}>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.welcomeText}>Welcome to Vibe Reserve</Text>
            <Text style={styles.tagline}>YOUR NIGHT YOUR WAY</Text>
            <Text style={styles.description}>
              Discover the best nightlife experiences around you. Find, reserve,
              and enjoy your night with zero hassle.
            </Text>
          </View>
          <View style={styles.logoSection}>
          <AppIconWelcome />
          </View>
          <Text style={styles.logoSubtext}>Let’s you in</Text>

          <View style={styles.socialSection}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignUp}
            >
              <View style={styles.socialButtonContent}>
                <View style={styles.appleIcons}>
                  <GoogleIcon />
                </View>
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignUp}
            >
              <View style={styles.socialButtonContent}>
                <View style={styles.appleIcons}>
                  <AppleIcon />
                </View>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          <View style={styles.buttonSection}>
            <Buttons
              title="Sign Up"
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;
