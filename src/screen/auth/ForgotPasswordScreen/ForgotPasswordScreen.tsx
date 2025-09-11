
import React, { useEffect, useState } from "react";
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
  Alert
} from "react-native";
import { colors } from "../../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../../components/buttons";
import {
  CustomeTextInput,
} from "../../../components/textinput";
import { BackButton } from "../../../components/BackButton";
import EmailIcon from "../../../assets/svg/emailIcon";
import { showToast } from "../../../utilis/toastUtils.tsx";

//API
import {
  onForgotPassword,
  forgotPasswordData,
  forgotPasswordError,
} from '../../../redux/auth/actions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ForgotPasswordScreenProps {
  navigation?: any;
}
import styles from "./styles";

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [uid, setUid] = useState('');

  // Validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const emailValid = validateEmail(formData.email);
    setIsFormValid(emailValid);
    return emailValid;
  };

  const dispatch = useDispatch();
  const forgotPassword = useSelector((state: any) => state.auth.forgotPassword);
  const forgotPasswordErr = useSelector((state: any) => state.auth.forgotPasswordErr);
  const [msg, setMsg] = useState('');


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate field in real-time
    if (field === "email") {
      const isValid = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: !isValid }));
      setErrorMessages((prev) => ({
        ...prev,
        email: value && !isValid ? "Please enter a valid email address" : ""
      }));
    }

    // Validate entire form
    validateForm();
  };

  useEffect(() => {

    if (
      forgotPassword?.status === true ||
      forgotPassword?.status === 'true' ||
      forgotPassword?.status === 1 ||
      forgotPassword?.status === "1"
    ) {
      console.log("forgotPassword:+>", forgotPassword);
      // setMsg(forgotPassword?.message?.toString());
      showToast(
        "success",
        forgotPassword?.message || "Something went wrong. Please try again."
      );
      setUid(forgotPassword?.data?._id);
      navigation.navigate('OTPVerificationScreen', { email: formData?.email, type: 'forgot_password', id: forgotPassword?.data?._id })
      dispatch(forgotPasswordData(''));
    }

    if (forgotPasswordErr) {
      console.log("forgotPasswordErr:+>", forgotPasswordErr);
      // setMsg(forgotPasswordErr?.message.toString())
      showToast(
        "error",
        forgotPasswordErr?.message || "Something went wrong. Please try again."
      );
      if (msg == 'OTP request limit reached for today. Try again tomorrow.') {

      } else {
        //

      }
      dispatch(forgotPasswordError(''));
    }
  }, [forgotPassword, forgotPasswordErr]);



  const handleContinue = () => {
    // Final validation before submission
    if (!validateForm()) {
      // Set errors for empty fields
      if (!formData.email) {
        setErrors((prev) => ({ ...prev, email: true }));
        setErrorMessages((prev) => ({ ...prev, email: "Email is required" }));
      }
      return;
    }

    setIsLoading(true);
    // Simulate API call to send reset password email
    setTimeout(() => {
      setIsLoading(false);
      dispatch(onForgotPassword(formData))
    }, 1500);
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.customInput}
                />
              </View>

              <View style={styles.optionsSection}>
                <View style={styles.rememberMeContainer}>
                  <Text style={styles.rememberMeText}>
                    We'll text you to confirm your email. Standard message and data rates apply.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonSection}>
              <Buttons
                title="Continue"
                isCap={false}
                onPress={handleContinue}
                style={[
                  styles.signUpButton,
                  !isFormValid && styles.disabledButton
                ]}
                disabled={!isFormValid || isLoading}
                loading={isLoading}
              />
            </View>
            <CustomAlertSingleBtn
              btn1Style={{ backgroundColor: colors.violate }}
              isVisible={msg != ''}
              message={msg}
              button2Text={'Ok'}
              onButton2Press={() => {
                setMsg('');
                if (msg == 'OTP request limit reached for today. Try again tomorrow.') {

                } else {
                  navigation.navigate('OTPVerificationScreen', { email: formData?.email, type: 'forgot_password', id: uid })

                }
              }}
              title={'Vibes'}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default ForgotPasswordScreen;