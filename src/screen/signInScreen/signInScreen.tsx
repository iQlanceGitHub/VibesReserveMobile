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
  Alert,
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { showToast } from "../../utilis/toastUtils.tsx";
//API
import {
  onSignin,
  signinData,
  signinError,
  onSocialLogin,
  socialLoginData,
  socialLoginError,
  setUser,
} from "../../redux/auth/actions";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { CustomAlertSingleBtn } from "../../components/CustomeAlertDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import CustomAlert from "../../components/CustomAlert";
import { UserPermissions } from "../../utilis/userPermissionUtils";
interface SignInScreenProps {
  navigation?: any;
}
import styles from "./styles";

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const signin = useSelector((state: any) => state.auth.signin);
  const signinErr = useSelector((state: any) => state.auth.signinErr);
  const socialLogin = useSelector((state: any) => state.auth.socialLogin);
  const socialLoginErr = useSelector((state: any) => state.auth.socialLoginErr);
  const deviceToken = useSelector((state: any) => state.auth.deviceToken);
  
  // Debug logging for device token
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceToken: deviceToken || "abcd", // Use Redux state or fallback
  });
  const [socialData, setSocialData] = useState({
    email: "",
    name: "",
    socialID: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    terms: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });
  const [msg, setMsg] = useState("");
  const [uid, setUid] = useState("");
  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Password must contain:
    // 8-16 characters
    // At least one uppercase letter (A-Z)
    // At least one lowercase letter (a-z)
    // At least one number (0-9)
    // At least one special character (e.g., ! @ # $ % ^ & *)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,16}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);

    setIsFormValid(emailValid && passwordValid);
    return emailValid && passwordValid;
  };

  const handleInputChange = (field: string, value: string) => {
    // Convert email to lowercase
    const processedValue = field === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Validate field in real-time
    if (field === "email") {
      const isValid = validateEmail(processedValue);
      setErrors((prev) => ({ ...prev, email: !isValid }));
      setErrorMessages((prev) => ({
        ...prev,
        email: processedValue && !isValid ? "Please enter a valid email address" : "",
      }));
    }

    if (field === "password") {
      const isValid = validatePassword(processedValue);
      setErrors((prev) => ({ ...prev, password: !isValid }));
      setErrorMessages((prev) => ({
        ...prev,
        password:
          processedValue && !isValid ? "Password must meet all requirements" : "",
      }));
    }

    // Validate entire form
    validateForm();
  };

  const handleSignIn = () => {
    // Final validation before submission
    if (!validateForm()) {
      // Set errors for empty fields
      if (!formData.email) {
        setErrors((prev) => ({ ...prev, email: true }));
        setErrorMessages((prev) => ({ ...prev, email: "Email is required" }));
      }
      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: true }));
        setErrorMessages((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      }
      return;
    }

    // Handle successful sign in logic
    dispatch(onSignin(formData));
  };

  // Get token
  const storeUserToken = async (token: any) => {
    try {
      await AsyncStorage.setItem("user_token", token);
      getUserToken();
    } catch (e) {
      console.error("Failed to save the user token.", e);
    }
  };

    const storeUserStatus = async (status: 'logged_in' | 'skipped' | 'guest') => {
      try {
        // Clear all stored preferences first
        await AsyncStorage.multiRemove([
          'user_status',
          'user_permissions',
          'skip_timestamp',
        ]);
        
        await AsyncStorage.setItem("user_status", status);

        // Store additional metadata based on status
        if (status === 'skipped') {
          await AsyncStorage.setItem("skip_timestamp", Date.now().toString());
          await AsyncStorage.setItem("user_permissions", JSON.stringify({
            canLike: false,
            canDislike: false,
            canBookmark: false,
            canReview: false,
            canBook: false
          }));
        } else if (status === 'logged_in') {
          // Clear any skip-related data when user logs in
          await AsyncStorage.multiRemove(['skip_timestamp']);
          await AsyncStorage.setItem("user_permissions", JSON.stringify({
            canLike: true,
            canDislike: true,
            canBookmark: true,
            canReview: true,
            canBook: true
          }));
        }
      } catch (e) {
        console.error("Failed to save the user status.", e);
      }
    };

  const storeUser = async (user: any) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save the user.", e);
    }
  };

  // Store user ID
  const storeUserId = async (userId: any) => {
    try {
      await AsyncStorage.setItem("user_id", userId);
    } catch (e) {
      console.error("Failed to save the user ID.", e);
    }
  };

  // Get token
  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      if (token !== null) {
        return token;
      }
    } catch (e) {
      console.error("Failed to fetch the user token.", e);
    }
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user !== null) {
        const parsedUser = JSON.parse(user);
        return parsedUser;
      }
    } catch (e) {
      console.error("Failed to fetch the user.", e);
    }
  };

  useEffect(() => {
    getUserToken();
    getUser();
  }, []);

  // Update deviceToken when it changes in Redux state
  useEffect(() => {
    
    if (deviceToken) {
      setFormData(prev => ({
        ...prev,
        deviceToken: deviceToken
      }));
    } else {
    }
  }, [deviceToken]);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (
        signin?.status === true ||
        signin?.status === "true" ||
        signin?.status === 1 ||
        signin?.status === "1"
      ) {
        setFormData({
          email: "",
          password: "",
          deviceToken: deviceToken || "abcd",
        });
        setErrors({
          email: false,
          password: false,
          terms: false,
        });
        dispatch(setUser(signin));
        // setMsg(signin?.message?.toString())
        showToast(
          "success",
          signin?.message || "Something went wrong. Please try again."
        );
        
        if (signin?.token) {
          storeUserToken(signin?.token);
        }
        if (signin?.user) {
          storeUser(signin?.user); 
        }
        if (signin?.user?.id) {
          storeUserId(signin.user.id);
        }
        
        // Store user status as logged in
        await storeUserStatus('logged_in');
        
        // Role-based navigation
        if (signin?.user?.currentRole === 'user') {
          navigation.navigate('HomeTabs' as never);
        } else if (signin?.user?.currentRole === 'host') {
          navigation.navigate('HostTabs' as never);
        } else {
          // Default fallback to HomeTabs
          navigation.navigate('HomeTabs' as never);
        }
        
        dispatch(signinData(""));
      }
    };

    getUserToken().then((token) => {
      if (token) {
        getUser().then((user) => {
          if (user?.currentRole === "user") {
            navigation.navigate("HomeTabs" as never);
          } else if (user?.currentRole === "host") {
            navigation.navigate("HostTabs" as never);
          } else {
          }
        });
      }
    });
   
    handleLoginSuccess();

    if (signinErr) {
      showToast(
        "error",
        signinErr?.message || "Something went wrong. Please try again."
      );
      // if (signinErr?.message == 'Your account is inactive. Please contact support.') {

      // }
      if (
        signinErr?.message ==
        "Your email has not been verified. An OTP has been sent to your registered email address."
      ) {
        navigation.navigate("OTPVerificationScreen", {
          email: formData?.email,
          type: "signup",
          id: uid,
        });
        setFormData({
          email: "",
          password: "",
          deviceToken: deviceToken || "abcd",
        });
      } else {
      }
      setUid(signinErr?.user?._id);
      setErrors({
        email: false,
        password: false,
        terms: false,
      });
      dispatch(signinError(""));
    }

    const handleSocialLoginSuccess = async () => {
      if (
        socialLogin?.status === true ||
        socialLogin?.status === "true" ||
        socialLogin?.status === 1 ||
        socialLogin?.status === "1"
      ) {
        //  setMsg(socialLogin?.message?.toString());
        showToast(
          "success",
          socialLogin?.message || "Something went wrong. Please try again."
        );
        dispatch(setUser(socialLogin));
        if (socialLogin?.token) {
          storeUserToken(socialLogin?.token);
        }
        if (socialLogin?.user?.id) {
          storeUserId(socialLogin.user.id);
        }
        
        // Store user status as logged in
        await storeUserStatus('logged_in');
        
        // Role-based navigation
        if (socialLogin?.user?.currentRole === 'user') {
          navigation.navigate('HomeTabs' as never);
        } else if (socialLogin?.user?.currentRole === 'host') {
          navigation.navigate('HostTabs' as never);
        } else {
          // Default fallback to HomeTabs
          navigation.navigate('HomeTabs' as never);
        }
        
        dispatch(socialLoginData(""));
      }
    };

    handleSocialLoginSuccess();

    if (socialLoginErr) {
      showToast(
        "error",
        socialLoginErr?.message || "Something went wrong. Please try again."
      );
      dispatch(socialLoginError(""));
    }
  }, [signin, signinErr, socialLogin, socialLoginErr]);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      let obj = {
        email: userInfo?.data?.user?.email,
        socialId: userInfo?.data?.user?.id,
        loginType: "google",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currentRole: "user",
      };

      if (userInfo?.data?.user?.email && userInfo?.data?.user?.id) {
        dispatch(onSocialLogin(obj));
      }
    } catch (error) {
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        identityToken,
        email,
        fullName: { givenName, familyName },
      } = appleAuthRequestResponse;
      const userId = appleAuthRequestResponse.user;

      // Handle the obtained data as per your requirements

      let obj = {
        email: email == null ? "" : email,
        socialId: userId,
        loginType: "apple",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currentRole: "user",
      };

      if (userId) {
        dispatch(onSocialLogin(obj));

        // Show success message
        // Alert.alert(
        //   "Success",
        //   "Apple Sign-In successful!",
        //   [{ text: "OK" }]
        // );
      } else {
        console.error("No identity token received from Apple");
        throw new Error("Apple Sign-In failed - no identity token returned");
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
      } else {
      }
    }
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleForgotPassword = () => {
    navigation?.navigate("ForgotPasswordScreen");
  };

  const handleSkip = async () => {
    try {
      // Store skip status
      await storeUserStatus('skipped');
      
      // Navigate to HomeTabs
      navigation?.navigate("HomeTabs" as never);
      
      // Show toast message
      showToast("info", "You can explore the app. Sign in to access all features!");
    } catch (error) {
      console.error("Error handling skip:", error);
      showToast("error", "Something went wrong. Please try again.");
    }
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
          
            <View style={styles.header}>
              <View style={styles.statusBar}>
                <BackButton
                  navigation={navigation}
                  onBackPress={() => navigation?.navigate("WelcomeScreen")}
                />
                <TouchableOpacity
                  onPress={handleSkip}
                  style={styles.statusIcons}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>Hello, Welcome! 👋</Text>
              <Text style={styles.subtitle}>
                Sign in to unlock your ultimate night out.
              </Text>
              
            </View>
            <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
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
              {Platform.OS === "ios" && (
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
              )}
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
                  placeholder="Enter your email or phone number"
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

                {/* Password requirements hint */}
                {formData.password && errors.password && (
                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>
                      Password must contain:
                    </Text>
                    <Text
                      style={[
                        styles.requirement,
                        formData.password.length >= 8 &&
                          formData.password.length <= 16 &&
                          styles.requirementMet,
                      ]}
                    >
                      • 8-16 characters
                    </Text>
                    <Text
                      style={[
                        styles.requirement,
                        /[A-Z]/.test(formData.password) &&
                          styles.requirementMet,
                      ]}
                    >
                      • At least one uppercase letter (A-Z)
                    </Text>
                    <Text
                      style={[
                        styles.requirement,
                        /[a-z]/.test(formData.password) &&
                          styles.requirementMet,
                      ]}
                    >
                      • At least one lowercase letter (a-z)
                    </Text>
                    <Text
                      style={[
                        styles.requirement,
                        /\d/.test(formData.password) && styles.requirementMet,
                      ]}
                    >
                      • At least one number (0-9)
                    </Text>
                    <Text
                      style={[
                        styles.requirement,
                        /[!@#$%^&*]/.test(formData.password) &&
                          styles.requirementMet,
                      ]}
                    >
                      • At least one special character (!@#$%^&*)
                    </Text>
                  </View>
                )}
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
                isCap={false}
                style={[
                  styles.signUpButton,
                  !isFormValid && styles.disabledButton,
                ]}
                disabled={!isFormValid}
              />
            </View>
          </ScrollView>

          <View style={styles.loginLinkSection}>
            <View style={styles.loginLink}>
              <Text style={styles.loginText}>
                Don't have an account?{" "}
                <Text
                  style={styles.loginLinkText}
                  onPress={() => navigation?.navigate("SignupScreen")}
                >
                  Register
                </Text>
              </Text>
            </View>
          </View>
          <CustomAlertSingleBtn
            btn1Style={{ backgroundColor: colors.violate }}
            isVisible={msg != ""}
            message={msg}
            button2Text={"Ok"}
            onButton2Press={() => {
              setMsg("");
              if (
                msg ==
                "Your email has not been verified. An OTP has been sent to your registered email address."
              ) {
                navigation.navigate("OTPVerificationScreen", {
                  email: formData?.email,
                  type: "signup",
                  id: uid,
                });
                setFormData({
                  email: "",
                  password: "",
                  deviceToken: deviceToken || "abcd",
                });
              } else {
              }
            }}
            title={"Curiouzz"}
          />
          
          <CustomAlert
            visible={showCustomAlert}
            title={alertConfig.title}
            message={alertConfig.message}
            primaryButtonText={alertConfig.primaryButtonText}
            secondaryButtonText={alertConfig.secondaryButtonText}
            onPrimaryPress={alertConfig.onPrimaryPress}
            onSecondaryPress={alertConfig.onSecondaryPress}
            onClose={() => setShowCustomAlert(false)}
          />
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignInScreen;
