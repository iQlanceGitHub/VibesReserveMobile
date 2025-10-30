import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import EditIcon from "../../../../assets/svg/editIcon";
import RightArrow from "../../../../assets/svg/rightArrow";
import LogoutConfirmationPopup from "../../../../components/LogoutConfirmationPopup";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { onGetProfileDetail, onSwitchRole, onDeleteAccount, onGetCmsContent, onResendEmail, resendEmailError, resendEmailData } from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
// @ts-ignore
import PushNotification from "react-native-push-notification";
import { PermissionsAndroid } from "react-native";
import styles from "./hostProfileStyles";
import { verticalScale } from "../../../../utilis/appConstant";

interface HostProfileScreenProps {
  navigation?: any;
}

const HostProfileScreen: React.FC<HostProfileScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { getProfileDetail, getProfileDetailErr, loader, switchRole, switchRoleErr, deleteAccount, deleteAccountErr, cmsContent, cmsContentErr, resendEmail, resendEmailErr } = useSelector(
    (state: any) => state.auth
  );

  const profileData = useMemo(() => {
    const data = getProfileDetail?.data || {};
    return data;
  }, [getProfileDetail]);

  const isLoading = loader;

  const [localProfileData, setLocalProfileData] = useState(profileData);

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setLocalProfileData(profileData);
    }
  }, [profileData]);

  const displayData =
    Object.keys(localProfileData).length > 0 ? localProfileData : profileData;

  const [becomeHost, setBecomeHost] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const [pendingCmsNavigation, setPendingCmsNavigation] = useState<{identifier: string, title: string} | null>(null);

  useEffect(() => {
    dispatch(onGetProfileDetail());
    loadNotificationPreference();
  }, [dispatch]);

  useEffect(() => {
    if (displayData.currentRole) {
      setBecomeHost(displayData.currentRole === "host");
    }
  }, [displayData.currentRole]);

  // Handle switch role response
  useEffect(() => {
    if (switchRole?.status === 1 || switchRole?.status === "1" || switchRole?.status === true) {
      console.log('Role switch successful:', switchRole);
      showToast('success', `Role switched successfully to ${switchRole.currentRole}`);
      
      // Update user data in AsyncStorage
      updateUserRoleInStorage(switchRole.currentRole);
      
      // Navigate to appropriate tab based on new role
      if (switchRole.currentRole === 'host') {
        navigation?.navigate('HostTabs' as never);
      } else if (switchRole.currentRole === 'user') {
        navigation?.navigate('HomeTabs' as never);
      }
      
      // Reset loading state
      setIsRoleSwitching(false);
      
      // Clear the switch role state
      dispatch({ type: 'SWITCH_ROLE_DATA', payload: "" });
    }
  }, [switchRole]);

  // Handle switch role error
  useEffect(() => {
    if (switchRoleErr) {
      console.log('Role switch error:', switchRoleErr);
      showToast('error', 'Failed to switch role. Please try again.');
      
      // Reset loading state
      setIsRoleSwitching(false);
      
      // Clear the switch role error state
      dispatch({ type: 'SWITCH_ROLE_ERROR', payload: "" });
    }
  }, [switchRoleErr]);

  // Handle delete account response
  useEffect(() => {
    if (deleteAccount) {
      console.log('Account deleted successfully:', deleteAccount);
      showToast('success', 'Account deleted successfully');
      
      // Clear user data and navigate to login
      AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'WelcomeScreen' }],
      });
    }
  }, [deleteAccount]);

  useEffect(() => {
    if (deleteAccountErr) {
      console.log('Delete account error:', deleteAccountErr);
      showToast('error', 'Failed to delete account. Please try again.');
    }
  }, [deleteAccountErr]);

  // Handle CMS content response and navigate with content
  useEffect(() => {
    if (cmsContent && cmsContent.data && pendingCmsNavigation) {
      console.log('📄 CMS Content received, navigating with content:', cmsContent.data);
      navigation.navigate('CmsContentScreen', { 
        identifier: pendingCmsNavigation.identifier, 
        title: pendingCmsNavigation.title,
        content: cmsContent.data.content
      });
      setPendingCmsNavigation(null);
    }
  }, [cmsContent, pendingCmsNavigation]);

  // Handle CMS content error
  useEffect(() => {
    if (cmsContentErr && pendingCmsNavigation) {
      console.log('CMS content error:', cmsContentErr);
      showToast('error', 'Failed to load content. Please try again.');
      setPendingCmsNavigation(null);
    }
  }, [cmsContentErr, pendingCmsNavigation]);

  // Handle resend email response
  useEffect(() => {
    if (resendEmail) {
      console.log('📧 Resend email success:', resendEmail);
      showToast('success', 'Please check your email for stripe verification link. Please click on the link & create your stripe account.');
      dispatch(resendEmailData(''));
    }
  }, [resendEmail]);

  // Handle resend email error
  useEffect(() => {
    if (resendEmailErr) {
      console.log('📧 Resend email error:', resendEmailErr);
      // showToast('error', 'We can\'t request to stripe verification email. Please contact administrator.');
       dispatch(resendEmailError(''));
    }
  }, [resendEmailErr]);

  // Stop auto-resend of Stripe email on settings/profile screen

  // Delete account function
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(onDeleteAccount({}));
          },
        },
      ]
    );
  };

  // CMS Content functions
  const handlePrivacyPolicy = () => {
    console.log('🔍 Requesting privacy policy content');
    setPendingCmsNavigation({ identifier: 'privacy_policy', title: 'Privacy Policy' });
    dispatch(onGetCmsContent({ identifier: 'privacy_policy' }));
  };

  const handleTermsConditions = () => {
    console.log('🔍 Requesting terms & conditions content');
    setPendingCmsNavigation({ identifier: 'terms_condition', title: 'Terms & Conditions' });
    dispatch(onGetCmsContent({ identifier: 'terms_condition' }));
  };

  const handleAboutUs = () => {
    console.log('🔍 Requesting about us content');
    setPendingCmsNavigation({ identifier: 'about_us', title: 'About Us' });
    dispatch(onGetCmsContent({ identifier: 'about_us' }));
  };

  // Request notification permissions
  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs notification permission to send you updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.log('Error requesting notification permission:', error);
        return false;
      }
    }
    return true; // iOS permissions are handled differently
  };

  // Configure push notifications
  const configurePushNotifications = () => {
    PushNotification.configure({
      onRegister: function (token: any) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification: any) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  // Load notification preference from AsyncStorage
  const loadNotificationPreference = async () => {
    try {
      const savedNotification = await AsyncStorage.getItem('notification_preference');
      if (savedNotification !== null) {
        const isEnabled = JSON.parse(savedNotification);
        setNotifications(isEnabled);
        
        // Configure notifications based on preference
        if (isEnabled) {
          configurePushNotifications();
        }
      } else {
        // Default to true if no preference is saved
        setNotifications(true);
        configurePushNotifications();
      }
    } catch (error) {
      console.log('Error loading notification preference:', error);
      setNotifications(true); // Default to true on error
      configurePushNotifications();
    }
  };

  // Save notification preference to AsyncStorage
  const saveNotificationPreference = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('notification_preference', JSON.stringify(value));
      console.log('Notification preference saved:', value);
    } catch (error) {
      console.log('Error saving notification preference:', error);
    }
  };

  // Check if notifications are enabled
  const checkNotificationStatus = () => {
    PushNotification.checkPermissions((permissions: any) => {
      console.log('Notification permissions:', permissions);
      if (permissions.alert && notifications) {
        console.log('Notifications are enabled and permitted');
      } else {
        console.log('Notifications are disabled or not permitted');
      }
    });
  };

  // Send a test notification (for testing purposes)
  const sendTestNotification = () => {
    if (notifications) {
      PushNotification.localNotification({
        title: "Test Notification",
        message: "This is a test notification from VibesReserve",
        playSound: true,
        soundName: 'default',
        vibrate: true,
        vibration: 300,
      });
    }
  };

  useEffect(() => {
    if (getProfileDetailErr) {
      console.log("Profile Detail API Error:", getProfileDetailErr);
    }
  }, [getProfileDetailErr]);

  // Update user role in AsyncStorage
  const updateUserRoleInStorage = async (newRole: string) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.currentRole = newRole;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('User role updated in storage:', newRole);
      }
    } catch (error) {
      console.log('Error updating user role in storage:', error);
    }
  };

  const handleBecomeHostToggle = async () => {
    if (isRoleSwitching) return; // Prevent multiple rapid toggles
    
    setIsRoleSwitching(true);
    
    try {
      // Determine the new role based on current state
      const newRole = becomeHost ? 'user' : 'host';
      
      console.log('Switching role to:', newRole);
      
      // Dispatch the switch role action
      dispatch(onSwitchRole({ role: newRole }));
      
    } catch (error) {
      console.log('Error switching role:', error);
      showToast('error', 'Failed to switch role. Please try again.');
      setIsRoleSwitching(false);
    }
  };

  const handleNotificationsToggle = async () => {
    if (isNotificationLoading) return; // Prevent multiple rapid toggles
    
    setIsNotificationLoading(true);
    const newValue = !notifications;
    
    try {
      if (newValue) {
        // User wants to enable notifications
        const hasPermission = await requestNotificationPermissions();
        
        if (!hasPermission) {
          showToast('error', 'Notification permission denied. Please enable in settings.');
          setIsNotificationLoading(false);
          return;
        }
        
        // Configure push notifications
        configurePushNotifications();
        
        // Update local state
        setNotifications(true);
        
        // Save to storage
        await saveNotificationPreference(true);
        
        showToast('success', 'Notifications enabled successfully!');
        console.log('Notifications enabled');
      } else {
        // User wants to disable notifications
        // Cancel all scheduled notifications
        PushNotification.cancelAllLocalNotifications();
        
        // Update local state
        setNotifications(false);
        
        // Save to storage
        await saveNotificationPreference(false);
        
        showToast('success', 'Notifications disabled successfully!');
        console.log('Notifications disabled');
      }
    } catch (error) {
      // Revert state on error
      setNotifications(!newValue);
      showToast('error', 'Failed to update notification preference');
      console.log('Error updating notification preference:', error);
    } finally {
      setIsNotificationLoading(false);
    }
  };

  const handleManageAvailability = () => {
    navigation?.navigate("ManageAvailability");
  };

  const handlePromotionalCodes = () => {
    navigation?.navigate("PromotionalCode");
  };

  const handleHelpSupport = () => {
    navigation?.navigate("HelpSupport");
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const performLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user_status",
        "user_permissions",
        "user_token",
        "user",
        "user_id",
        "skip_timestamp",
      ]);

      navigation?.navigate("SignInScreen");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutPopup(false);
    performLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutPopup(false);
  };

  const handleEditProfile = () => {
    navigation?.navigate("HostEditProfileScreen");
  };

  const renderMenuOption = (
    title: string,
    onPress: () => void,
    rightComponent: React.ReactNode,
    showArrow: boolean = false
  ) => {
    return (
      <LinearGradient
        colors={["#1F0045", "#120128"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.menuOption}
      >
        <TouchableOpacity style={styles.menuOptionTouchable} onPress={onPress}>
          <Text style={styles.menuOptionText}>{title}</Text>
          <View style={styles.menuRightContainer}>
            {rightComponent}
            {showArrow && (
              <View style={styles.arrowContainer}>
                <RightArrow />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.profileCardBackground}
      statusBarStyle="light-content"
      statusBarBackgroundColor={colors.profileCardBackground}
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        
          <View style={styles.profileSection}>
            <View style={styles.header}>
              <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.profileContent}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImagePlaceholder}>
                  <Image
                    source={{
                      uri: displayData.profilePicture,
                    }}
                    style={styles.profileImage}
                    onError={(error) => console.log("Image load error:", error)}
                    onLoad={() => {}}
                  />
                </View>
                <TouchableOpacity
                  style={styles.editIconContainer}
                  onPress={handleEditProfile}
                >
                  <EditIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoName}>{displayData?.fullName}</Text>
                <Text style={styles.userInfoValue}>{displayData?.email}</Text>
                <Text style={styles.userInfoValue}>
                  {displayData?.countrycode && displayData?.phone
                    ? `${displayData.countrycode} ${displayData.phone}`
                    : ""}
                </Text>
                <Text style={styles.userInfoValue}>
                  {displayData?.dateOfBirth
                    ? new Date(displayData.dateOfBirth).toLocaleDateString()
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.menuSection}>
            {renderMenuOption(
              "Become a User",
              handleBecomeHostToggle,
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  {
                    backgroundColor: becomeHost
                      ? colors.BtnBackground
                      : colors.disableGray,
                    opacity: isRoleSwitching ? 0.6 : 1,
                  },
                ]}
                onPress={handleBecomeHostToggle}
                disabled={isRoleSwitching}
              >
                <Text style={styles.switchButtonText}>
                  {isRoleSwitching ? 'Switching...' : 'Switch'}
                </Text>
              </TouchableOpacity>
            )}

            {renderMenuOption(
              "Notifications",
              handleNotificationsToggle,
              <Switch
                value={notifications}
                onValueChange={handleNotificationsToggle}
                disabled={isNotificationLoading}
                trackColor={{
                  false: colors.disableGray,
                  true: colors.BtnBackground,
                }}
                thumbColor={isNotificationLoading ? colors.gray : colors.white}
              />
            )}

            {renderMenuOption(
              "Manage Availability",
              handleManageAvailability,
              <View />,
              true
            )}

            {renderMenuOption(
              "Promotional Codes",
              handlePromotionalCodes,
              <View />,
              true
            )}

            {renderMenuOption(
              "Help and Support",
              handleHelpSupport,
              <View />,
              true
            )}

{renderMenuOption("About Us", handleAboutUs, <View />, true)}

            {renderMenuOption("Privacy Policy", handlePrivacyPolicy, <View />, true)}

            {renderMenuOption("Terms & Conditions", handleTermsConditions, <View />, true)}


            {renderMenuOption("Delete Account", handleDeleteAccount, <View />, true)}

            {renderMenuOption("Logout", handleLogout, <View />, true)}
          </View>
          <View style={{marginBottom: verticalScale(80)}}></View>
        </ScrollView>
      </LinearGradient>

      <LogoutConfirmationPopup
        visible={showLogoutPopup}
        onCancel={handleLogoutCancel}
        onLogout={handleLogoutConfirm}
      />
    </SafeAreaWrapper>
  );
};

export default HostProfileScreen;
