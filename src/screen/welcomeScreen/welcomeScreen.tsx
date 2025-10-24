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
    //navigation?.navigate("HomeTabs");
   
  };

  // Get token
  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token !== null) {
        return token;
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    getUserToken();
  }, [])

  // Get token
  const storeUserToken = async (token: any) => {
    try {
      await AsyncStorage.setItem("user_token", token);
      getUserToken();
    } catch (e) {
      console.error("Failed to save the user token.", e);
    }
  };

  // Store user data
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
    getUserToken().then((token) => {
      if(token){
        getUser().then((user) => {
          if(user?.currentRole === 'user'){
            navigation.navigate('HomeTabs' as never);
          }else if(user?.currentRole === 'host'){
            navigation.navigate('HostTabs' as never);
          }else{
          }
        });
      }
    });
    if (
      socialLogin?.status === true ||
      socialLogin?.status === 'true' ||
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
      if (socialLogin?.user) {
        storeUser(socialLogin?.user); 
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
          if (socialLogin?.user) {
            storeUser(socialLogin?.user); 
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

    if (socialLoginErr) {
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
      //Alert.alert('Success', 'You have successfully signed in with Google!');
      // navigation.navigate('NameScreen')
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
      } else {
      }
    }
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
{Platform.OS === 'ios' && (
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
)}
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