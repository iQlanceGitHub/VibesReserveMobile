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
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import EditIcon from "../../assets/svg/editIcon";
import RightArrow from "../../assets/svg/rightArrow";
import LogoutConfirmationPopup from "../../components/LogoutConfirmationPopup";
import { getUserStatus } from "../../utilis/userPermissionUtils";
import styles from "./styles";

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [exploreNightLife, setExploreNightLife] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userStatus, setUserStatus] = useState<'logged_in' | 'skipped' | 'guest' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogin = () => {
    navigation?.navigate('SignInScreen');
  };

  const handleExploreNightLifeToggle = () => {
    setExploreNightLife(!exploreNightLife);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  const handleShareWithFriends = () => {
    console.log("Share with friends pressed");
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    console.log("Logout confirmed");
    setShowLogoutPopup(false);
    // Add your logout logic here
    // For example: navigation.navigate('SignInScreen');
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
              <View style={styles.profileContent}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
                  <Text style={styles.userInfoName}>Mike Hussey</Text>
                  <Text style={styles.userInfoValue}>
                    mike.hussey@gmail.com
                  </Text>
                  <Text style={styles.userInfoValue}>+62703-701-9964</Text>
                  <Text style={styles.userInfoValue}>09/09/1990</Text>
                </View>
              </View>
            </View>

            <View style={styles.licenseSection}>
              <View style={styles.licenseBorderContainer}>
                <View style={styles.licenseContainer}></View>
              </View>
            </View>
            <View style={styles.menuSection}>
              {userStatus === 'skipped' ? (
                // Show Login option for skipped users
                renderMenuOption("Sign In", handleLogin, <RightArrow />, true)
              ) : (
                // Show normal menu for logged in users
                <>
                  {renderMenuOption(
                    "Explore Night Life",
                    handleExploreNightLifeToggle,
                    <TouchableOpacity
                      style={[
                        styles.switchButton,
                        {
                          backgroundColor: exploreNightLife
                            ? colors.BtnBackground
                            : colors.disableGray,
                        },
                      ]}
                      onPress={handleExploreNightLifeToggle}
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
                    "Share with Friends",
                    handleShareWithFriends,
                    <View style={styles.shareIconsContainer}></View>,
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
