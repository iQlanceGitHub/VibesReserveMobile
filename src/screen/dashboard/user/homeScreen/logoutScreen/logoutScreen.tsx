import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../../../../utilis/appConstant';
import { getUserStatus } from '../../../../../utilis/userPermissionUtils';
import CustomAlert from '../../../../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface LogoutScreenProps {
  navigation?: any;
}

const LogoutScreen: React.FC<LogoutScreenProps> = ({ navigation }) => {
  const [userStatus, setUserStatus] = useState<'logged_in' | 'skipped' | 'guest' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  useEffect(() => {
    checkUserStatus();
  }, []);

  // Refresh user status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkUserStatus();
    }, [])
  );

  const checkUserStatus = async () => {
    try {
      const status = await getUserStatus();
      setUserStatus(status);
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAlertConfig({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout? You will need to sign in again to access your account.',
      primaryButtonText: 'Logout',
      secondaryButtonText: 'Cancel',
      onPrimaryPress: () => {
        setShowCustomAlert(false);
        performLogout();
      },
      onSecondaryPress: () => {
        setShowCustomAlert(false);
      },
    });
    setShowCustomAlert(true);
  };

  const performLogout = async () => {
    try {
      // Clear all stored preferences and user data
      await AsyncStorage.multiRemove([
        'user_status',
        'user_permissions',
        'user_token',
        'user',
        'user_id',
        'skip_timestamp',
      ]);
      
      // Navigate to SignInScreen
      navigation?.navigate('SignInScreen');
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleLogin = () => {
    navigation?.navigate('SignInScreen');
  };

  const handleSkip = () => {
    setAlertConfig({
      title: 'Skip Confirmation',
      message: 'Are you sure you want to skip? You can explore the app without an account, but some features require login.',
      primaryButtonText: 'Skip',
      secondaryButtonText: 'Cancel',
      onPrimaryPress: () => {
        setShowCustomAlert(false);
        performSkip();
      },
      onSecondaryPress: () => {
        setShowCustomAlert(false);
        
      },
    });
    setShowCustomAlert(true);
  };


  const performSkip = async () => {
    try {
      // Store skip status
      await AsyncStorage.setItem('user_status', 'skipped');
      await AsyncStorage.setItem('user_permissions', JSON.stringify({
        canLike: false,
        canDislike: false,
        canBookmark: false,
        canReview: false,
        canBook: false
      }));
      
      // Navigate to HomeTabs
      navigation?.navigate('HomeTabs');
      
      console.log('User skipped successfully');
    } catch (error) {
      console.error('Error during skip:', error);
      Alert.alert('Error', 'Failed to skip. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.violate}
          translucent={Platform.OS === 'android'}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.violate}
        translucent={Platform.OS === 'android'}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Account</Text>
            <Text style={styles.subtitle}>
              {userStatus === 'logged_in' 
                ? 'Manage your account settings' 
                : 'Sign in to access all features'
              }
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {userStatus === 'logged_in' ? (
              // Show logout option for logged in users
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              // Show login and skip options for non-logged in users (skipped, guest, or null)
              <>
                {/* <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity> */}
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.skipButtonText}>Sign In</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
           
              {userStatus === 'logged_in' 
                ? 'You are currently signed in. You can logout to switch accounts or sign in as a different user.'
                : 'You can explore the app without signing in, but some features like liking events and booking will require you to create an account.'
              }
            </Text>
          </View>
        </View>

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
      </SafeAreaView>
    </View>
  );
};

export default LogoutScreen;
