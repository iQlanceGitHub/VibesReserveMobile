import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
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

  useEffect(() => {
    dispatch(onGetProfileDetail());
  }, [dispatch]);

  useEffect(() => {
    if (displayData.currentRole) {
      setBecomeHost(displayData.currentRole === "host");
    }
  }, [displayData.currentRole]);

  useEffect(() => {
    if (getProfileDetailErr) {
      console.log("Profile Detail API Error:", getProfileDetailErr);
    }
  }, [getProfileDetailErr]);

  const handleBecomeHostToggle = () => {
    setBecomeHost(!becomeHost);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
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

          <View style={styles.menuSection}>
            {renderMenuOption(
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
            )}

            {renderMenuOption(
              "Notifications",
              handleNotificationsToggle,
              <Switch
                value={notifications}
                onValueChange={handleNotificationsToggle}
                trackColor={{
                  false: colors.disableGray,
                  true: colors.BtnBackground,
                }}
                thumbColor={colors.white}
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
