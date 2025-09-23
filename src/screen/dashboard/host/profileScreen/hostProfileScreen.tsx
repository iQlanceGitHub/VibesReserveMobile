import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import EditIcon from "../../../../assets/svg/editIcon";
import RightArrow from "../../../../assets/svg/rightArrow";
import LogoutConfirmationPopup from "../../../../components/LogoutConfirmationPopup";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import styles from "./hostProfileStyles";

interface HostProfileScreenProps {
  navigation?: any;
}

const HostProfileScreen: React.FC<HostProfileScreenProps> = ({
  navigation,
}) => {
  const [becomeHost, setBecomeHost] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

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
    console.log("Promotional Codes pressed");
  };

  const handleHelpSupport = () => {
    console.log("Help and Support pressed");
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    console.log("Logout confirmed");
    setShowLogoutPopup(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutPopup(false);
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
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
                      uri: "https://randomuser.me/api/portraits/men/32.jpg",
                    }}
                    style={styles.profileImage}
                    onError={(error) => console.log("Image load error:", error)}
                    onLoad={() => console.log("Image loaded successfully")}
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
                <Text style={styles.userInfoName}>John Carter</Text>
                <Text style={styles.userInfoValue}>john@vibelounge.com</Text>
                <Text style={styles.userInfoValue}>+62987 654 3210</Text>
                <Text style={styles.userInfoValue}>09/09/1990</Text>
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
