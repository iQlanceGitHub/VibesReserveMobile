import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  Share,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import EditIcon from "../../assets/svg/editIcon";
import RightArrow from "../../assets/svg/rightArrow";
import LogoutConfirmationPopup from "../../components/LogoutConfirmationPopup";
import { getUserStatus } from "../../utilis/userPermissionUtils";
import { onGetProfileDetail, onSwitchRole } from "../../redux/auth/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utilis/toastUtils";
// @ts-ignore
import PushNotification from "react-native-push-notification";
import styles from "./styles";

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { getProfileDetail, getProfileDetailErr, loader, switchRole, switchRoleErr } = useSelector(
    (state: any) => state.auth
  );

  const [exploreNightLife, setExploreNightLife] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userStatus, setUserStatus] = useState<
    "logged_in" | "skipped" | "guest" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkUserStatus();
      fetchProfileDetail();
    }, [])
  );

  useEffect(() => {
    if (userStatus === "logged_in") {
      fetchProfileDetail();
    }
  }, [userStatus]);

  useEffect(() => {
    if (getProfileDetail && getProfileDetail.status === 1) {
      setProfileData(getProfileDetail.data);
      setIsLoading(false);
    } else if (getProfileDetailErr) {
      setIsLoading(false);
    }
  }, [getProfileDetail, getProfileDetailErr]);

  // Load notification preference on component mount
  useEffect(() => {
    loadNotificationPreference();
  }, []);

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

  const checkUserStatus = async () => {
    try {
      const status = await getUserStatus();
      setUserStatus(status);
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileDetail = () => {
    setIsLoading(true);
    dispatch(onGetProfileDetail());
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "01/01/1990";
    }
  };

  const handleLogin = () => {
    navigation?.navigate("SignInScreen");
  };

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

  const handleExploreNightLifeToggle = async () => {
    if (isRoleSwitching) return; // Prevent multiple rapid toggles
    
    setIsRoleSwitching(true);
    
    try {
      // Determine the new role based on current state
      const newRole = exploreNightLife ? 'host' : 'user';
      
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

  const handleShareWithFriends = async () => {
    try {
      const shareMessage = `VibesReserve`;

      const shareOptions = {
        message: shareMessage,
        title: "VibesReserve",
        url: "",
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert(
        "Share Error",
        "Unable to share at this time. Please try again later.",
        [{ text: "OK" }]
      );
    }
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
    navigation?.navigate("EditProfileScreen");
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
                <RightArrow width={24} height={24} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          Platform.OS === "ios" ? "transparent" : colors.profileCardBackground
        }
        translucent={Platform.OS === "ios"}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.profileSection}>
              <View style={styles.header}>
                <View style={styles.statusBar}></View>
                <View style={styles.placeholder} />
                <Text style={styles.title}>Profile</Text>
                <View style={styles.placeholder} />
              </View>
              {isLoading && userStatus === "logged_in" ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 40,
                  }}
                >
                  <ActivityIndicator size="large" color={colors.white} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-Medium",
                      color: colors.white,
                      marginTop: 10,
                    }}
                  >
                    Loading profile...
                  </Text>
                </View>
              ) : getProfileDetailErr ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 40,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-Medium",
                      color: colors.red || "#FF6B6B",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    Failed to load profile
                  </Text>
                  <TouchableOpacity
                    onPress={fetchProfileDetail}
                    style={{
                      backgroundColor: colors.BtnBackground || "#6C5CE7",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins-Medium",
                        color: colors.white,
                      }}
                    >
                      Retry
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.profileContent}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{
                        uri: profileData?.profilePicture,
                      }}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      style={styles.editIconContainer}
                      onPress={handleEditProfile}
                    >
                      <EditIcon width={16} height={16} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfoName}>
                      {profileData?.fullName || "User Name"}
                    </Text>
                    <Text style={styles.userInfoValue}>
                      {profileData?.email || "user@example.com"}
                    </Text>
                    <Text style={styles.userInfoValue}>
                      {profileData?.countrycode && profileData?.phone
                        ? `${profileData.countrycode}${profileData.phone}`
                        : "+1234567890"}
                    </Text>
                    <Text style={styles.userInfoValue}>
                      {profileData?.dateOfBirth
                        ? formatDate(profileData.dateOfBirth)
                        : "01/01/1990"}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.licenseSection}>
              <View style={styles.licenseBorderContainer}>
                {profileData?.userDocument ? (
                  <Image
                    source={{ uri: profileData.userDocument }}
                    style={styles.documentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noDocumentContainer}>
                    <Text style={styles.noDocumentText}>
                      No Document Available
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.menuSection}>
              {userStatus === "skipped" ? (
                // Show Login option for skipped users
                renderMenuOption("Sign In", handleLogin, <RightArrow />, true)
              ) : (
                // Show normal menu for logged in users
                <>
                  {renderMenuOption(
                    "Become a Host",
                    handleExploreNightLifeToggle,
                    <TouchableOpacity
                      style={[
                        styles.switchButton,
                        {
                          backgroundColor: exploreNightLife
                            ? colors.BtnBackground
                            : colors.disableGray,
                          opacity: isRoleSwitching ? 0.6 : 1,
                        },
                      ]}
                      onPress={handleExploreNightLifeToggle}
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
                    "Share with Friends",
                    handleShareWithFriends,
                    <View />,
                    true
                  )}

                  {renderMenuOption("Logout", handleLogout, <View />, true)}
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <LogoutConfirmationPopup
        visible={showLogoutPopup}
        onCancel={handleLogoutCancel}
        onLogout={handleLogoutConfirm}
      />
    </View>
  );
};

export default ProfileScreen;
