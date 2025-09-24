import React, { useEffect } from "react";
import { View, StatusBar, Platform } from "react-native";
import NavigationStack from "./src/navigation/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Provider } from "react-redux";
import configureStore from "./src/reduxSaga/configureStore";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/utilis/toastUtils.tsx";
import AppInitializer from "./src/components/AppInitializer";

const initialState = {};
const store: any = configureStore(initialState);

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
  }, []);

  return (
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
  );
}

export default App;
