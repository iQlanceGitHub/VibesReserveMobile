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
import { colors } from "../../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../../components/buttons";
import {
  CustomeTextInput,
} from "../../../components/textinput";
import { BackButton } from "../../../components/BackButton";
import EmailIcon from "../../../assets/svg/emailIcon";

interface ForgotPasswordScreenProps {
  navigation?: any;
}
import styles from "./styles";
import OTPVerificationScreen from "../OTPVerificationScreen/OTPVerificationScreen";

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps > = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Handle sign in logic
    console.log("Sign in data:", formData);
    navigation?.navigate('OTPVerificationScreen');
  };


  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
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
               
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
              Enter your email to reset your password.
              </Text>
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

              <View style={styles.optionsSection}>
                <View style={styles.rememberMeContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={handleRememberMe}
                  >
                   
                    <Text style={styles.rememberMeText}>We'll  text you to confirm your email. Standard message
                    and data rates apply</Text>
                  </TouchableOpacity>
                </View>
              
              </View>
            </View>

            <View style={styles.buttonSection}>
              <Buttons
                title="Continue"
                isCap={false}
                onPress={handleContinue}
                style={styles.signUpButton}
              />
            </View>
          </ScrollView>

          
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default ForgotPasswordScreen;
