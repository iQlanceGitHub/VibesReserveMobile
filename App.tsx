import React, { useEffect } from "react";
import { View, StatusBar, Platform, AppState } from "react-native";
import NavigationStack from "./src/navigation/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Provider } from "react-redux";
import configureStore from "./src/reduxSaga/configureStore";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/utilis/toastUtils.tsx";
import AppInitializer from "./src/components/AppInitializer";
import {StripeProvider} from '@stripe/stripe-react-native';
import {stripeTestKey} from './src/utilis/appConstant';
import { longPollingService } from './src/services/longPollingService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';


const initialState = {};
const store: any = configureStore(initialState);

// Token generation function for simulator testing
const generateTestToken = async () => {
  try {
    // Generate a test token (you can modify this based on your needs)
    const testToken = `test_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the token in AsyncStorage for testing
    await AsyncStorage.setItem("user_token", testToken);
    
    // Also store mock signin data
    const mockSigninData = {
      token: {
        token: testToken
      },
      user: {
        id: "test_user_123",
        email: "test@example.com",
        fullName: "Test User"
      },
      status: 1
    };
    
    await AsyncStorage.setItem("signin", JSON.stringify(mockSigninData));
    await AsyncStorage.setItem("user", JSON.stringify(mockSigninData.user));
    await AsyncStorage.setItem("user_status", "logged_in");
    
    console.log("🔑 TEST TOKEN GENERATED FOR SIMULATOR:");
    console.log("Token:", testToken);
    console.log("Mock User Data:", mockSigninData);
    console.log("=====================================");
    
    return testToken;
  } catch (error) {
    console.error("Error generating test token:", error);
    return null;
  }
};

// Function to generate a new token manually (for testing)
const generateNewToken = async () => {
  const newToken = await generateTestToken();
  if (newToken) {
    console.log("✅ New token generated successfully!");
    console.log("You can now use this token for API calls in the simulator");
    
    // Also generate device token for push notifications
    try {
      const deviceToken = await generateDeviceToken();
      if (deviceToken) {
        console.log("✅ Device token also generated for push notifications!");
      }
    } catch (error) {
      console.log("⚠️ Could not generate device token:", error);
    }
  }
  return newToken;
};

// Initialize Firebase
const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      console.log('🔥 Initializing Firebase...');
      // Firebase should auto-initialize with google-services.json and GoogleService-Info.plist
      // But we can check if it's working
      const app = firebase.app();
      console.log('✅ Firebase initialized successfully:', app.name);
    } else {
      console.log('✅ Firebase already initialized');
    }
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
};

// Device token generation for push notifications
const generateDeviceToken = async () => {
  try {
    // First initialize Firebase
    const firebaseInitialized = await initializeFirebase();
    if (!firebaseInitialized) {
      console.log('❌ Firebase not initialized, cannot generate device token');
      return null;
    }

    // Request permission for push notifications
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('❌ Push notification permission denied');
      Alert.alert(
        'Permission Required',
        'Push notification permission is required for device token generation.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Get the device token
    const deviceToken = await messaging().getToken();
    
    if (deviceToken) {
      // Store device token in AsyncStorage
      await AsyncStorage.setItem("device_token", deviceToken);
      
      console.log("📱 DEVICE TOKEN GENERATED FOR PUSH NOTIFICATIONS:");
      console.log("Device Token:", deviceToken);
      console.log("Token Length:", deviceToken.length);
      console.log("=====================================");
      
      return deviceToken;
    } else {
      console.log('❌ Failed to get device token');
      return null;
    }
  } catch (error) {
    console.error("Error generating device token:", error);
    return null;
  }
};

// Function to generate device token manually (for testing)
const generateNewDeviceToken = async () => {
  const newDeviceToken = await generateDeviceToken();
  if (newDeviceToken) {
    console.log("✅ New device token generated successfully!");
    console.log("You can now use this token for push notification testing");
  }
  return newDeviceToken;
};

// Function to get stored device token
const getStoredDeviceToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("device_token");
    console.log("📱 STORED DEVICE TOKEN:", storedToken);
    return storedToken;
  } catch (error) {
    console.error("Error getting stored device token:", error);
    return null;
  }
};

// Test push notification function
const testPushNotification = async () => {
  try {
    const deviceToken = await getStoredDeviceToken();
    if (!deviceToken) {
      console.log('❌ No device token found. Generate one first using generateNewToken()');
      return;
    }
    
    console.log('📱 Device Token for testing:', deviceToken);
    console.log('🔔 You can use this token to send test notifications from Firebase Console');
    console.log('📋 Go to Firebase Console > Cloud Messaging > Send test message');
    console.log('📋 Paste this token in the "FCM registration token" field');
    
    return deviceToken;
  } catch (error) {
    console.error('Error testing push notification:', error);
  }
};

// Make the functions available globally for console access
if (__DEV__) {
  (global as any).generateNewToken = generateNewToken;
  (global as any).generateTestToken = generateTestToken;
  (global as any).generateDeviceToken = generateDeviceToken;
  (global as any).generateNewDeviceToken = generateNewDeviceToken;
  (global as any).getStoredDeviceToken = getStoredDeviceToken;
  (global as any).testPushNotification = testPushNotification;
  (global as any).initializeFirebase = initializeFirebase;
}

function App(): React.JSX.Element {
  GoogleSignin.configure({
    webClientId:
    Platform.OS === "ios" ? "233362513415-5ipa4s95r3ir23vgrh5f4t210tfpijrv.apps.googleusercontent.com" : "581614872749-kjh1qf6gi879cuheh0gc0dkslekvrmu8.apps.googleusercontent.com",
    offlineAccess: true,
    iosClientId:
      "233362513415-dlq70usscn8n825h5njp9osp4l6im5c7.apps.googleusercontent.com", // From Google Console
    forceCodeForRefreshToken: true,
  });

  useEffect(() => {
    // Hide splash screen when app is ready
    SplashScreen.hide();

    // Generate test token for simulator (only in development/simulator)
    if (__DEV__ && Platform.OS === 'ios') {
      generateTestToken();
    }

    // Generate device token for push notifications
    const initializePushNotifications = async () => {
      try {
        // First initialize Firebase
        const firebaseInitialized = await initializeFirebase();
        if (!firebaseInitialized) {
          console.log('❌ Firebase not initialized, skipping push notifications');
          return;
        }

        // Check if we already have a device token
        const existingToken = await AsyncStorage.getItem("device_token");
        
        if (!existingToken) {
          console.log("🔔 Initializing push notifications...");
          await generateDeviceToken();
        } else {
          console.log("📱 Using existing device token:", existingToken);
        }

        // Set up push notification listeners
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('📨 Push notification received in foreground:', remoteMessage);
          // You can show a local notification or update UI here
        });

        // Handle notification when app is opened from background
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('📨 Notification caused app to open from background state:', remoteMessage);
        });

        // Check if app was opened from a notification
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('📨 Notification caused app to open from quit state:', remoteMessage);
            }
          });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    // Initialize push notifications
    initializePushNotifications();

    // Handle app state changes for chat polling
    const handleAppStateChange = (nextAppState: string) => {
      console.log('App state changed to:', nextAppState);
      if (nextAppState === 'active') {
        // App came to foreground, ensure long polling is active
        if (longPollingService.isPollingActive()) {
          console.log('App became active, triggering immediate poll...');
          // The long polling service will handle the immediate poll
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <StripeProvider merchantIdentifier="merchant.org.iqlance.iqlanc.shoppywhere" publishableKey={stripeTestKey.publishKey}> 
    <Provider store={store}>
      <SafeAreaProvider
        // Enhanced configuration for Android 15 edge-to-edge support
        initialMetrics={{
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
          frame: { x: 0, y: 0, width: 0, height: 0 },
        }}
      >
        <AppInitializer>
          <View style={{ flex: 1 }}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="dark-content"
              // Enhanced StatusBar configuration for Android 15
              {...(Platform.OS === 'android' && {
                // Ensure proper edge-to-edge handling on Android 15
                statusBarTranslucent: true,
                statusBarBackgroundColor: 'transparent',
              })}
            />

            <NavigationStack />
            <Toast config={toastConfig} />
          </View>
        </AppInitializer>
      </SafeAreaProvider>
    </Provider>
    </StripeProvider>
  );
}

export default App;
