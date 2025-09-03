import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { colors } from "../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import {
  CustomeTextInput,
  CustomePasswordTextInput,
} from "../../components/textinput";
import GoogleIcon from "../../assets/svg/googleIcon";
import AppleIcon from "../../assets/svg/appleIcon";
import { BackButton } from "../../components/BackButton";
import EmailIcon from "../../assets/svg/emailIcon";
import LockIcon from "../../assets/svg/lockIcon";

interface SignInScreenProps {
  navigation?: any;
}
import styles from "./styles";

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = () => {
    // Handle sign in logic
    console.log("Sign in data:", formData);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    console.log("Google sign in");
  };

  const handleAppleSignIn = () => {
    // Handle Apple sign in
    console.log("Apple sign in");
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleForgotPassword = () => {
    // Handle forgot password
    console.log("Forgot password");
  };

  return (
    <View
      style={[styles.container, { paddingTop: Platform.OS === "ios" ? 0 : 0 }]}
    >
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.header}>
              <View style={styles.statusBar}>
                <BackButton
                  navigation={navigation}
                  onBackPress={() => navigation?.goBack()}
                />
                <View style={styles.statusIcons}>
                  <Text style={styles.skipText}>Skip</Text>
                </View>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>Hello, Welcome! 👋</Text>
              <Text style={styles.subtitle}>
                Sign in to unlock your ultimate night out.
              </Text>
            </View>

            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
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
                onPress={handleAppleSignIn}
              >
                <View style={styles.socialButtonContent}>
                  <View style={styles.appleIcons}>
                    <AppleIcon />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Email *"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChangeText={(text) => handleInputChange("email", text)}
                  error={errors.email}
                  message={errorMessages.email}
                  leftImage={<EmailIcon />}
                  kType="email-address"
                  style={styles.customInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="Password *"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.password}
                  message={errorMessages.password}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>

              <View style={styles.optionsSection}>
                <View style={styles.rememberMeContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={handleRememberMe}
                  >
                    <View
                      style={[styles.checkbox, rememberMe && styles.checkedBox]}
                    >
                      {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.rememberMeText}>Remember me</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonSection}>
              <Buttons
                title="Sign In"
                onPress={handleSignIn}
                style={styles.signUpButton}
              />
            </View>
          </ScrollView>

          <View style={styles.loginLinkSection}>
            <View style={styles.loginLink}>
              <Text style={styles.loginText}>
                Don't have an account?{" "}
                <Text
                  style={styles.loginLinkText}
                  onPress={() => navigation?.navigate("signupScreen")}
                >
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignInScreen;
