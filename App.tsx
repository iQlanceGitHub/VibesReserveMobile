
import React, {useEffect} from 'react';
import {
  View,
  StatusBar
} from 'react-native';
import NavigationStack from './src/navigation/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {Provider} from 'react-redux';
import configureStore from './src/reduxSaga/configureStore';
import SplashScreen from 'react-native-splash-screen';

const initialState = {};
const store: any = configureStore(initialState);

function App(): React.JSX.Element {

  GoogleSignin.configure({
    webClientId: '233362513415-5ipa4s95r3ir23vgrh5f4t210tfpijrv.apps.googleusercontent.com',
    offlineAccess: true,
    iosClientId: '233362513415-dlq70usscn8n825h5njp9osp4l6im5c7.apps.googleusercontent.com', // From Google Console
    forceCodeForRefreshToken: true,
  })

  useEffect(() => {
    // Hide splash screen when app is ready
    SplashScreen.hide();
  }, []);


  return (
     <Provider store={store}>
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        <NavigationStack />
      </View>
    </SafeAreaProvider></Provider>
  );
}

export default App;
