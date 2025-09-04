import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";

import IntroScreen from "../screen/auth/IntroScreen/IntroScreen";

// import { BackButton } from "../components/BackButton";
import LinearGradient from "react-native-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import signupScreen from "../screen/signUpScreen/signUpScreen";
import signInScreen from "../screen/signInScreen/signInScreen";
import WelcomeScreen from "../screen/welcomeScreen/welcomeScreen";
import OTPVerificationScreen from "../screen/auth/OTPVerificationScreen/OTPVerificationScreen";
import VerificationSucessScreen from "../screen/auth/VerificationSucessScreen/VerificationSucessScreen";
import LocationScreen from "../screen/auth/LocationScreen/LocationScreen";
import LocationManuallyScreen from "../screen/auth/LocationManuallyScreen/LocationManuallyScreen";
import PasswordChangedSucessScreen from "../screen/auth/PasswordChangedSucessScreen/PasswordChangedSucessScreen";
import ForgotPasswordScreen from '../screen/auth/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from '../screen/auth/ResetPasswordScreen/ResetPasswordScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  IntroScreen: undefined;
  signupScreen: undefined;
  SignInScreen: undefined;
  EmailVerificationScreen: undefined;
  VerificationCodeScreen: undefined;
  VerifiedSuccessfully: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  ResetPasswordSuccessfully: undefined;
  NameScreen: undefined;
  AgeScreen: undefined;
  Sxual: undefined;
  GenderScreen: undefined;
  DistanceScreen: undefined;
  Intrested: undefined;
  SchoolScreen: undefined;
  LookingForScreen: undefined;
  IntoScreen: undefined;
  MakesScreen: undefined;
  AddPhotosScreen: undefined;
  LifestyleHabits: undefined;
  LocationScreen: undefined;
  AvoidSomeoneScreen: undefined;
  AllSetScreen: undefined;
  FeedQuestionScreen: undefined;
  CongratulationDiscovery: undefined;
  HomeTabs: undefined;
};

const NavigationStack: React.FC = () => {
  const theme = useColorScheme();
  return (
    <NavigationContainer>
      <LinearGradient
        colors={
          theme === "light" ? ["#8C50FD", "#8C50FD"] : ["#0A0735", "#04021C"]
        }
        style={{ flex: 1 }} // Takes full screen
      >
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="IntroScreen"
            component={IntroScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="WelcomeScreen"
            component={WelcomeScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="signupScreen"
            component={signupScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="SignInScreen"
            component={signInScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="OTPVerificationScreen"
            component={OTPVerificationScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="VerificationSucessScreen"
            component={VerificationSucessScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="LocationScreen"
            component={LocationScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="LocationManuallyScreen"
            component={LocationManuallyScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="PasswordChangedSucessScreen"
            component={PasswordChangedSucessScreen}
          />
           <Stack.Screen
            options={{ headerShown: false }}
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />
               <Stack.Screen
            options={{ headerShown: false }}
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />    
        </Stack.Navigator>
      </LinearGradient>
    </NavigationContainer>
  );
};
export default NavigationStack;
