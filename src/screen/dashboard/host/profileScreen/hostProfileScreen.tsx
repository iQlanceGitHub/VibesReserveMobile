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
import { onGetProfileDetail } from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
// @ts-ignore
import PushNotification from "react-native-push-notification";
import { PermissionsAndroid } from "react-native";
import styles from "./hostProfileStyles";

interface HostProfileScreenProps {
  navigation?: any;
}

const HostProfileScreen: React.FC<HostProfileScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { getProfileDetail, getProfileDetailErr, loader } = useSelector(
    (state: any) => state.auth
  );

  // Extract profile data from API response using useMemo for better performance
  const profileData = useMemo(() => {
    const data = getProfileDetail?.data || {};
    return data;
  }, [getProfileDetail]);

  const isLoading = loader;

  // Store profile data in local state to prevent it from being lost
  const [localProfileData, setLocalProfileData] = useState(profileData);

  // Update local state when profile data changes
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setLocalProfileData(profileData);
    }
  }, [profileData]);

  // Use local profile data if available, otherwise use the current profileData
  const displayData =
    Object.keys(localProfileData).length > 0 ? localProfileData : profileData;

  const [becomeHost, setBecomeHost] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  useEffect(() => {
    dispatch(onGetProfileDetail());
    loadNotificationPreference();
  }, [dispatch]);

  useEffect(() => {
    if (displayData.currentRole) {
      setBecomeHost(displayData.currentRole === "host");
    }
  }, [displayData.currentRole]);

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

  const handleBecomeHostToggle = () => {
    setBecomeHost(!becomeHost);
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
      // Clear all stored preferences and user data
      await AsyncStorage.multiRemove([
        "user_status",
        "user_permissions",
        "user_token",
        "user",
        "user_id",
        "skip_timestamp",
      ]);

      // Navigate to SignInScreen
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
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
                      uri:
                        displayData.profilePicture ||
                        "https://randomuser.me/api/portraits/men/32.jpg",
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
                <Text style={styles.userInfoName}>
                  {isLoading
                    ? "Loading..."
                    : displayData?.fullName || "No name available"}
                </Text>
                <Text style={styles.userInfoValue}>
                  {isLoading
                    ? "Loading..."
                    : displayData?.email || "No email available"}
                </Text>
                <Text style={styles.userInfoValue}>
                  {isLoading
                    ? "Loading..."
                    : displayData?.countrycode && displayData?.phone
                    ? `${displayData.countrycode} ${displayData.phone}`
                    : "No phone available"}
                </Text>
                <Text style={styles.userInfoValue}>
                  {isLoading
                    ? "Loading..."
                    : displayData?.dateOfBirth
                    ? new Date(displayData.dateOfBirth).toLocaleDateString()
                    : "No date available"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.menuSection}>
            {/* {renderMenuOption(
              "Become a Host",
              handleBecomeHostToggle,
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  {
                    backgroundColor: becomeHost
                      ? colors.BtnBackground
                      : colors.disableGray,
                  },
                ]}
                onPress={handleBecomeHostToggle}
              >
                <Text style={styles.switchButtonText}>Switch</Text>
              </TouchableOpacity>
            )} */}

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

            {renderMenuOption("Logout", handleLogout, <View />, true)}
          </View>
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
