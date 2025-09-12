import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { colors } from "../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import GoogleIcon from "../../assets/svg/googleIcon";
import AppleIcon from "../../assets/svg/appleIcon";

import AppIconWelcome from "../../assets/svg/appIconWelcome";
import ProfileIcon from "../../assets/svg/profile";
import MicroPhoneIcon from "../../assets/svg/microPhone";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { showToast } from "../../utilis/toastUtils.tsx";

//API
import {
  onSocialLogin,
  socialLoginData,
  socialLoginError,
  setUser,
} from '../../redux/auth/actions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';



interface WelcomeScreenProps {
  navigation?: any;
}
import styles from "./styles";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const dispatch = useDispatch();
  const socialLogin = useSelector((state: any) => state.auth.socialLogin);
  const socialLoginErr = useSelector((state: any) => state.auth.socialLoginErr);
  const [msg, setMsg] = useState('');
  const [socialData, setSocialData] = useState({
    email: '',
    name: '',
    socialID: '',
  });
  const handleSignUp = () => {
    navigation?.navigate("SignupScreen");

  };

  const handleSignIn = () => {
    // navigation?.navigate("SignInScreen");
    //navigation?.navigate("OTPVerificationScreen", { email: "test@test.com" });
    navigation?.navigate("SignInScreen");
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
      console.log('Failed to fetch the user token.', e);
    }
  };

  useEffect(() => {
    getUserToken();
  }, [])

  useEffect(() => {
    if (
      socialLogin?.status === true ||
      socialLogin?.status === 'true' ||
      socialLogin?.status === 1 ||
      socialLogin?.status === "1"
    ) {
      console.log("socialLogin:+>", socialLogin);
      //  setMsg(socialLogin?.message?.toString());
      showToast(
        "success",
        socialLogin?.message || "Something went wrong. Please try again."
      );
      dispatch(setUser(socialLogin))
      dispatch(socialLoginData(''));
    }

    if (socialLoginErr) {
      console.log("signinErr:+>", socialLoginErr);
      showToast(
        "error",
        socialLoginErr?.message || "Something went wrong. Please try again."
      );
      dispatch(socialLoginError(''));
    }
  }, [socialLogin, socialLoginErr]);


  
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
        "currentRole": "user",
      }

      if (userInfo?.data?.user?.email && userInfo?.data?.user?.id) {
        dispatch(onSocialLogin(obj));
      }
      console.log("socialData+>>>>", socialData);
      //Alert.alert('Success', 'You have successfully signed in with Google!');
      // navigation.navigate('NameScreen')
    } catch (error) {
      console.log('Google Sign-In error:', error);
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
        fullName: {givenName, familyName},
      } = appleAuthRequestResponse;
      const userId = appleAuthRequestResponse.user;

      // Handle the obtained data as per your requirements
    
      let obj = {
        "email": email == null ? '' : email,
        "socialId": userId,
        "loginType": 'apple',
        "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        "currentRole": "user",
      }

      if (userId) {
        dispatch(onSocialLogin(obj));
      }

    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('Apple Login: User cancelled the login flow.');
      } else {
        console.log('Apple Login: Error occurred:', error.message);
      }
    }
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
              isCap={false}
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
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;