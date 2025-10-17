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
import AppWrapper from "./src/utilis/AppWrapper";
import NotificationDebug from "./src/components/NotificationDebug";
import {StripeProvider} from '@stripe/stripe-react-native';
import {stripeTestKey} from './src/utilis/appConstant';
import { longPollingService } from './src/services/longPollingService';
import globalUnreadCountService from './src/services/globalUnreadCountService';
import { LocationProvider } from './src/contexts/LocationContext';


const initialState = {};
const store: any = configureStore(initialState);

function App(): React.JSX.Element {
  GoogleSignin.configure({
    webClientId: "581614872749-mb9dgfo6cl0fhmqds46t3m3anru2pd5m.apps.googleusercontent.com", // From GoogleService-Info.plist
    offlineAccess: true,
    iosClientId: "581614872749-mb9dgfo6cl0fhmqds46t3m3anru2pd5m.apps.googleusercontent.com", // From GoogleService-Info.plist
    forceCodeForRefreshToken: true,
  });

  useEffect(() => {
    // Hide splash screen when app is ready
    SplashScreen.hide();

    // Start long polling service for background chat updates after a small delay
    setTimeout(() => {
      longPollingService.startPolling();
    }, 2000); // 2 second delay to ensure store is ready

    // Start global unread count service
    setTimeout(() => {
      globalUnreadCountService.startService();
    }, 3000); // 3 second delay to ensure store is ready

    // Handle app state changes for chat polling
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App came to foreground, ensure long polling is active
        if (longPollingService.isPollingActive()) {
          // The long polling service will handle the immediate poll
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      // Stop long polling when app unmounts
      longPollingService.stopPolling();
      // Stop global unread count service when app unmounts
      globalUnreadCountService.stopService();
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
          <AppWrapper />
          <LocationProvider>
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
          </LocationProvider>
        </AppInitializer>
      </SafeAreaProvider>
    </Provider>
    </StripeProvider>
  );
}

export default App;
