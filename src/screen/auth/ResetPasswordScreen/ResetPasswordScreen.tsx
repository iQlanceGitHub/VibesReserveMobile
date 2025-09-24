import React, { useState, useEffect } from "react";
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
  Keyboard,
} from "react-native";
import { colors } from "../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../../components/buttons";
import {
  CustomePasswordTextInput,
} from "../../../components/textinput";
import { BackButton } from "../../../components/BackButton";
import LockIcon from "../../../assets/svg/lockIcon";
import styles from "./styles";
import { verticalScale } from "../../../utilis/appConstant";

//API
import {
  onResetPassword,
  resetPasswordData,
  resetPasswordError,
} from '../../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ResetPasswordScreenProps {
  navigation?: any;
  route?: {
    params?: {
      email?: string;
      type?: string;
      id?: string;
    };
  };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const userId = route?.params?.id || "";
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
   
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    
    newPassword: false,
    confirmPassword: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const resetPassword = useSelector((state: any) => state.auth.resetPassword);
  const resetPasswordErr = useSelector((state: any) => state.auth.resetPasswordErr);
  const [msg, setMsg] = useState('');

  // Validate form in real-time
  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  useEffect(() => {
    if (
      resetPassword?.status === true ||
      resetPassword?.status === 'true' ||
      resetPassword?.status === 1 ||
      resetPassword?.status === "1"
    ) {
      console.log("resetPassword:+>", resetPassword);
      if(resetPassword?.message?.toString() == "Password has been reset successfully.") {
        navigation.navigate('PasswordChangedSucessScreen')
      } else {
        setMsg(resetPassword?.message?.toString());
      }
      dispatch(resetPasswordData(''));
    }

    if (resetPasswordErr) {
      console.log("resetPasswordErr:+>", resetPasswordErr);
      setMsg(resetPasswordErr?.message?.toString())
      dispatch(resetPasswordError(''));
    }
  }, [resetPassword, resetPasswordErr]);

  const validateForm = () => {
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    // Validate new password (only if touched)
    if (touched.newPassword) {
      if (!formData.newPassword.trim()) {
        newErrors.newPassword = true;
        newErrorMessages.newPassword = "New password is required";
      } else if (!isPasswordValid(formData.newPassword)) {
        newErrors.newPassword = true;
        newErrorMessages.newPassword = "Password does not meet requirements";
      } else {
        newErrors.newPassword = false;
        newErrorMessages.newPassword = "";
      }
    }

    // Validate confirm password (only if touched)
    if (touched.confirmPassword) {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = true;
        newErrorMessages.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.newPassword) {
        newErrors.confirmPassword = true;
        newErrorMessages.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = false;
        newErrorMessages.confirmPassword = "";
      }
    }

    // Check for overall form validity
    const isOverallValid = 
      formData.newPassword.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      isPasswordValid(formData.newPassword) &&
      formData.confirmPassword === formData.newPassword;

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    setIsFormValid(isOverallValid);
  };

  const isPasswordValid = (password: string): boolean => {
    if (!password) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasValidLength = password.length >= 8 && password.length <= 16;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasValidLength;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Mark field as touched when user starts typing
    if (!touched[field as keyof typeof touched]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleInputBlur = (field: string) => {
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate the specific field immediately
    validateField(field);
  };

  const handleInputFocus = (field: string) => {
    // Show errors immediately when user focuses on a field that has been touched before
    if (touched[field as keyof typeof touched]) {
      validateField(field);
    }
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    switch (field) {

      case "newPassword":
        if (!formData.newPassword.trim()) {
          newErrors.newPassword = true;
          newErrorMessages.newPassword = "New password is required";
        } else if (!isPasswordValid(formData.newPassword)) {
          newErrors.newPassword = true;
          newErrorMessages.newPassword = "Password does not meet requirements";
        } else {
          newErrors.newPassword = false;
          newErrorMessages.newPassword = "";
        }
        break;

      case "confirmPassword":
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = true;
          newErrorMessages.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.newPassword) {
          newErrors.confirmPassword = true;
          newErrorMessages.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = false;
          newErrorMessages.confirmPassword = "";
        }
        break;
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
  };

  // Validate confirm password whenever newPassword or confirmPassword changes
  useEffect(() => {
    if (touched.confirmPassword && formData.newPassword && formData.confirmPassword) {
      validateField("confirmPassword");
    }
  }, [formData.newPassword, formData.confirmPassword, touched.confirmPassword]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSavePassword = () => {
    // Mark all fields as touched when user tries to submit
    const allTouched = {
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    // Validate all fields
    validateForm();

    if (!isFormValid) return;

    const requestData = {
      userId: userId,
      newpassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      type: "resetpassword"
    };

    console.log("Saving password with data:", requestData);
    dispatch(onResetPassword(requestData));
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  // Helper function to check individual password requirements
  const getPasswordRequirements = () => {
    const password = formData.newPassword;
    return {
      hasValidLength: password.length >= 8 && password.length <= 16,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const requirements = getPasswordRequirements();

  const renderScrollView = () => (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scrollViewContent,
        isKeyboardVisible && styles.scrollViewContentKeyboardVisible
      ]}
      bounces={false}
      overScrollMode="never"
      scrollEventThrottle={16}
      removeClippedSubviews={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(20) }]}>
        <View style={styles.statusBar}>
          <BackButton
            navigation={navigation}
            onBackPress={() => 
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "SignInScreen" }],
                })
              )
            }
          />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          The password must be different than before
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputContainer}>
          <CustomePasswordTextInput
            label="New Password *"
            value={formData.newPassword}
            placeholder="Enter your new password"
            onChangeText={(text) => handleInputChange("newPassword", text)}
            error={touched.newPassword && errors.newPassword}
            message={touched.newPassword ? errorMessages.newPassword : ""}
            leftImage={<LockIcon />}
            style={styles.customInput}
          />
          
          {/* Password requirements hint - always show when user starts typing */}
          {formData.newPassword && (
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <Text style={[styles.requirement, requirements.hasValidLength && styles.requirementMet]}>
                • 8-16 characters
              </Text>
              <Text style={[styles.requirement, requirements.hasUpperCase && styles.requirementMet]}>
                • At least one uppercase letter (A-Z)
              </Text>
              <Text style={[styles.requirement, requirements.hasLowerCase && styles.requirementMet]}>
                • At least one lowercase letter (a-z)
              </Text>
              <Text style={[styles.requirement, requirements.hasNumber && styles.requirementMet]}>
                • At least one number (0-9)
              </Text>
              <Text style={[styles.requirement, requirements.hasSpecialChar && styles.requirementMet]}>
                • At least one special character (!@#$%^&*)
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <CustomePasswordTextInput
            label="Confirm Password *"
            value={formData.confirmPassword}
            placeholder="Confirm your new password"
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
            error={touched.confirmPassword && errors.confirmPassword}
            message={touched.confirmPassword ? errorMessages.confirmPassword : ""}
            leftImage={<LockIcon />}
            style={styles.customInput}
          />
        </View>
        
        {formData.confirmPassword !== formData.newPassword && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password not match:</Text>
            <Text style={[styles.requirement]}>
              • New password & confirm password does not metch.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonSection}>
        <Buttons
          title="Save Password"
          onPress={handleSavePassword}
          style={[styles.handleSavePasswordButton, !isFormValid && styles.disabledButton]}
          isCap={false}
          disabled={!isFormValid}
        />
      </View>
      
      <CustomAlertSingleBtn
        isVisible={msg != ''}
        message={msg}
        button2Text={'Ok'}
        onButton2Press={() => {
          setMsg('');
          if (msg == 'OTP request limit reached for today. Try again tomorrow.') {
            // Handle specific case
          } else {
            // navigation.navigate('VerificationSucessScreen')
          }
        }}
        title={'Vibes'}
        name={''}
        button1Text={''}
        onButton1Press={() => {}}
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={0}
            enabled={true}
          >
            {renderScrollView()}
          </KeyboardAvoidingView>
        ) : (
          renderScrollView()
        )}
      </LinearGradient>
    </View>
  );
};

export default ResetPasswordScreen;