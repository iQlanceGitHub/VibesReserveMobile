import React, { useEffect, useState } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    appleAuth,
    AppleButton,
} from '@invertase/react-native-apple-authentication';

//API
import {
  onSignin,
  signinData,
  signinError,

  onSocialLogin,
  socialLoginData,
  socialLoginError,
  setUser,
} from '../../redux/auth/actions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SignInScreenProps {
  navigation?: any;
}
import styles from "./styles";

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceToken: "abcd",
  });
  const [socialData, setSocialData] = useState({
    email: '',
    name: '',
    socialID: '',
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

  const dispatch = useDispatch();
  const signin = useSelector((state: any) => state.auth.signin);
  const signinErr = useSelector((state: any) => state.auth.signinErr);
  const socialLogin = useSelector((state: any) => state.auth.socialLogin);
  const socialLoginErr = useSelector((state: any) => state.auth.socialLoginErr);
  const [msg, setMsg] = useState('');

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    
    setIsFormValid(emailValid && passwordValid);
    return emailValid && passwordValid;
  };

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
    
    if (field === "password") {
      const isValid = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: !isValid }));
      setErrorMessages((prev) => ({ 
        ...prev, 
        password: value && !isValid ? "Password must meet all requirements" : "" 
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
        setErrorMessages((prev) => ({ ...prev, password: "Password is required" }));
      }
      return;
    }
    
    // Handle successful sign in logic
    console.log("Sign in data:", formData);
    dispatch(onSignin(formData));
  };

   // Get token
   const getUserToken = async () => {
    try {
        const token = await AsyncStorage.getItem('user_token');
        if (token !== null) {
            console.log('User token retrieved:', token);
            return token;
        }
    } catch (e) {
        console.error('Failed to fetch the user token.', e);
    }
};

useEffect(() => {
  getUserToken();
},[])

useEffect(() => {
    if (
        signin?.status === true ||
        signin?.status === 'true' || 
        signin?.status === 1 ||
        signin?.status === "1"
    ) {
        console.log("signin:+>", signin);
        setFormData({
            email: '',
            password: '',
        });
        setErrors({
            email: false,
            password: false,
            terms: false,
        })
        dispatch(setUser(signin));
        setMsg(signin?.message?.toString())
       // navigation.navigate('NameScreen')
        dispatch(signinData(''));
    }

    if (signinErr) {
        console.log("signinErr:+>", signinErr);
        setMsg(signinErr?.message?.toString())
        setFormData({
            email: '',
            password: '',
        });
        setErrors({
            email: false,
            password: false,
            terms: false,
        });
        if (signinErr?.message == "Email is not verified. OTP has been sent to your email.") {
            setFormData({
                email: '',
                password: '',
            });
            navigation.navigate('VerificationCodeScreen', { email: formData.email.toString() })

        } else {
            // Alert.alert(signinErr.message);
        }
        dispatch(signinError(''));
    }

    if (
        socialLogin?.status === true ||
        socialLogin?.status === 'true' ||
        socialLogin?.status === 1 ||
        socialLogin?.status === "1"
    ) {
        console.log("socialLogin:+>", socialLogin);
        setMsg(socialLogin?.message?.toString());
        dispatch(setUser(socialLogin))
        dispatch(socialLoginData(''));
    }

    if (socialLoginErr) {
        console.log("signinErr:+>", socialLoginErr);
        setMsg(socialLoginErr.message.toString())
        dispatch(socialLoginError(''));
    }
}, [signin, signinErr, socialLogin, socialLoginErr]);


  const handleGoogleSignIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log('User Info:', userInfo?.data?.user?.email);
        console.log('User Info:', userInfo);

        let obj = {
            "email": userInfo?.data?.user?.email,
            "socialId": userInfo?.data?.user?.id,
            "loginType": "google",
            "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "currentRole":"user",
        }
       
        if (userInfo?.data?.user?.email && userInfo?.data?.user?.id) {
            dispatch(onSocialLogin(obj));
        }
        console.log("socialData+>>>>", socialData);
        //Alert.alert('Success', 'You have successfully signed in with Google!');
        // navigation.navigate('NameScreen')
    } catch (error) {
        console.error('Google Sign-In error:', error);
    }
};

const handleAppleSignIn = async () => {
    try {
        console.log("Starting Apple Sign-In...");
        
        // Check if Apple Sign-In is available
        const isAvailable = await appleAuth.isAvailable;
        if (!isAvailable) {
            Alert.alert("Error", "Apple Sign-In is not available on this device");
            return;
        }

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        console.log("Apple Auth Response:", JSON.stringify(appleAuthRequestResponse, null, 2));

        const {
            identityToken,
            email,
            fullName,
        } = appleAuthRequestResponse;
        
        const userId = appleAuthRequestResponse.user;
        console.log("Apple User ID:", userId);
        console.log("Apple Email:", email);
        console.log("Apple Full Name:", fullName);

        // Handle successful sign-in
        if (identityToken) {
            const fullNameStr = fullName ? 
                `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : 
                'Apple User';

            let obj = {
                "email": email || `apple_${userId}@privaterelay.appleid.com`,
                "socialId": identityToken,
                "loginType": "apple",
                "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "currentRole": "user",
                "name": fullNameStr,
                "userId": userId
            };

            console.log("Apple Sign-In Object:", obj);
            
            // Dispatch the social login action
            dispatch(onSocialLogin(obj));
            
            // Show success message
            Alert.alert(
                "Success", 
                "Apple Sign-In successful!",
                [{ text: "OK" }]
            );
            
        } else {
            console.error("No identity token received from Apple");
            throw new Error("Apple Sign-In failed - no identity token returned");
        }
    } catch (error) {
        console.error("Apple Sign-In Error:", error);
        
        // Handle specific Apple Sign-In errors
        if (error.code === appleAuth.Error.CANCELED) {
            console.log("Apple Sign-In was cancelled by user");
            // Don't show alert for user cancellation - this is normal behavior
            return;
        } else if (error.code === appleAuth.Error.FAILED) {
            console.error("Apple Sign-In failed");
            Alert.alert("Error", "Apple Sign-In failed. Please try again.");
        } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
            console.error("Invalid response from Apple");
            Alert.alert("Error", "Invalid response from Apple. Please try again.");
        } else if (error.code === appleAuth.Error.NOT_HANDLED) {
            console.error("Apple Sign-In not handled");
            Alert.alert("Error", "Apple Sign-In not handled. Please try again.");
        } else if (error.code === appleAuth.Error.UNKNOWN) {
            console.error("Unknown Apple Sign-In error");
            Alert.alert("Error", "Unknown error occurred during Apple Sign-In.");
        } else {
            console.error("Apple Sign-In error:", error.message);
            Alert.alert("Error", `Apple Sign-In failed: ${error.message || 'Unknown error'}`);
        }
    }
};


  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleForgotPassword = () => {
    navigation?.navigate("ForgotPasswordScreen");
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "ios" ? 0 : 0 }]}>
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
                    <Text style={styles.requirementsTitle}>Password must contain:</Text>
                    <Text style={[styles.requirement, formData.password.length >= 8 && formData.password.length <= 16 && styles.requirementMet]}>
                      • 8-16 characters
                    </Text>
                    <Text style={[styles.requirement, /[A-Z]/.test(formData.password) && styles.requirementMet]}>
                      • At least one uppercase letter (A-Z)
                    </Text>
                    <Text style={[styles.requirement, /[a-z]/.test(formData.password) && styles.requirementMet]}>
                      • At least one lowercase letter (a-z)
                    </Text>
                    <Text style={[styles.requirement, /\d/.test(formData.password) && styles.requirementMet]}>
                      • At least one number (0-9)
                    </Text>
                    <Text style={[styles.requirement, /[!@#$%^&*]/.test(formData.password) && styles.requirementMet]}>
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
                  !isFormValid && styles.disabledButton
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
                            isVisible={msg != ''}
                            message={msg}
                            button2Text={'Ok'}
                            onButton2Press={() => {
                                setMsg('');
                            }}
                            title={'Curiouzz'}
                        />
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignInScreen;