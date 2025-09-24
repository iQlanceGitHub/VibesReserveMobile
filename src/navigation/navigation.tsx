import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  useColorScheme,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import IntroScreen from "../screen/auth/IntroScreen/IntroScreen";
import { useSelector } from "react-redux";
// import { BackButton } from "../components/BackButton";
import LinearGradient from "react-native-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignupScreen from "../screen/signUpScreen/signUpScreen";
import signInScreen from "../screen/signInScreen/signInScreen";
import WelcomeScreen from "../screen/welcomeScreen/welcomeScreen";
import OTPVerificationScreen from "../screen/auth/OTPVerificationScreen/OTPVerificationScreen";
import VerificationSucessScreen from "../screen/auth/VerificationSucessScreen/VerificationSucessScreen";
import LocationScreen from "../screen/auth/LocationScreen/LocationScreen";
import LocationManuallyScreen from "../screen/auth/LocationManuallyScreen/LocationManuallyScreen";
import PasswordChangedSucessScreen from "../screen/auth/PasswordChangedSucessScreen/PasswordChangedSucessScreen";
import ForgotPasswordScreen from "../screen/auth/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../screen/auth/ResetPasswordScreen/ResetPasswordScreen";
import LeaveReviewScreen from "../screen/leaveReviewScreen/leaveReviewScreen";
import ProfileScreen from "../screen/profileScreen/profileScreen";
import HomeBottomTabNavigator from "./bottomTabNavigator/homeBottomTabNavigator";
import HostBottomTabNavigator from "./bottomTabNavigator/hostBottomTabNavigator";
import favouriteScreen from "../screen/favouriteScreen/favouriteScreen";
import ExploreScreen from "../screen/dashboard/user/homeScreen/exploreScreen/exploreScreen";
import FilterListScreen from "../screen/dashboard/user/homeScreen/FIlterList/FIlterListScreen";
import ClubDetailScreen from "../screen/dashboard/user/homeScreen/clubBooking/clubDetails/clubDetailScreen";
import NearbyEventsSeeAllScreen from "../screen/dashboard/user/homeScreen/nearbyEventsSeeAll/nearbyEventsSeeAllScreen";
import UpcomingScreen from "../screen/dashboard/user/homeScreen/upcomingScreen/upcomingScreen";
import AddClubEventDetailScreen from "../screen/dashboard/host/homeScreen/addClubEventDetail";
import HostProfileScreen from "../screen/dashboard/host/profileScreen/hostProfileScreen";
import ManageAvailability from "../screen/dashboard/host/profileScreen/manageAvailability";
import PromotionalCode from "../screen/dashboard/host/profileScreen/promotionalCode";
import AddPromotionalCode from "../screen/dashboard/host/profileScreen/addPromotionalCode";
// import EnhancedDemoScreen from "../screen/dashboard/user/homeScreen/Demo/enhancedDemo";

import { colors } from "../utilis/colors";
import * as appConstant from "../utilis/appConstant";
import React, { useState } from "react";
import homeScreen from "../screen/dashboard/user/homeScreen/homeScreen";
import HostHomeScreen from "../screen/dashboard/host/homeScreen/homeScreen";
import AddClubDetailScreen from "../screen/dashboard/host/homeScreen/addClubEventDetail";
import HostBookingScreen from "../screen/dashboard/host/hostBooking/hostBookingScreen";
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
  LeaveReviewScreen: undefined;
  ProfileScreen: undefined;
  WelcomeScreen: undefined;
  SignupScreen: undefined;
  OTPVerificationScreen: undefined;
  VerificationSucessScreen: undefined;
  LocationManuallyScreen: undefined;
  PasswordChangedSucessScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
  HostTabs: undefined;
  ExploreScreen: undefined;
  FilterListScreen: { filteredData: any[] };
  ClubDetailScreen: undefined;
  NearbyEventsSeeAllScreen: { nearbyEvents: any[] };
  UpcomingScreen: undefined;
  AddClubEventDetailScreen: undefined;
  HostProfileScreen: undefined;
  ManageAvailability: undefined;
  PromotionalCode: undefined;
  AddPromotionalCode: undefined;
};

function MyTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <HomeBottomTabNavigator {...props} />}>
      <Tab.Screen
        name="Home"
        component={homeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={favouriteScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Match"
        component={UpcomingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={UpcomingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={UpcomingScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function HostTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <HostBottomTabNavigator {...props} />}>
      <Tab.Screen
        name="Home"
        component={HostHomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={HostBookingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Match"
        component={UpcomingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={HostProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const NavigationStack: React.FC = () => {
  const theme = useColorScheme();
  const loader = useSelector((state: any) => state.auth.loader);
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
            name="SignupScreen"
            component={SignupScreen}
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
          <Stack.Screen
            options={{ headerShown: false }}
            name="LeaveReviewScreen"
            component={LeaveReviewScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ProfileScreen"
            component={ProfileScreen}
          />

          <Stack.Screen
            name="HomeTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HostTabs"
            component={HostTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExploreScreen"
            component={ExploreScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FilterListScreen"
            component={FilterListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClubDetailScreen"
            component={ClubDetailScreen}
            options={{
              headerShown: false,
              gestureEnabled: false, // Disable swipe-back gesture on iOS
            }}
          />
          <Stack.Screen
            name="NearbyEventsSeeAllScreen"
            component={NearbyEventsSeeAllScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpcomingScreen"
            component={UpcomingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddClubEventDetailScreen"
            component={AddClubEventDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HostProfileScreen"
            component={HostProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageAvailability"
            component={ManageAvailability}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PromotionalCode"
            component={PromotionalCode}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPromotionalCode"
            component={AddPromotionalCode}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </LinearGradient>
      {loader && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.black,
              justifyContent: "center",
              alignItems: "center",
              width: appConstant.horizontalScale(70),
              height: appConstant.horizontalScale(70),
              borderRadius: 10,
              alignSelf: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        </View>
      )}
    </NavigationContainer>
  );
};
export default NavigationStack;
