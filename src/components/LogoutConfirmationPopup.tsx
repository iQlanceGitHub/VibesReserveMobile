import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors } from "../utilis/colors";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";

interface LogoutConfirmationPopupProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

const LogoutConfirmationPopup: React.FC<LogoutConfirmationPopupProps> = ({
  visible,
  onCancel,
  onLogout,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.topLine} />
          <View style={styles.handle} />

          <Text style={styles.title}>
            Are you sure you want to{"\n"}log out?
          </Text>
          <Text style={styles.message}>
            You will need to log in again to access your account and bookings.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  popupContainer: {
    width: "100%",
    height: verticalScale(290),
    backgroundColor: colors.cardBackground,
    borderRadius: horizontalScale(30),
    borderWidth: verticalScale(1),
    borderColor: colors.BtnBackground,
    paddingHorizontal: horizontalScale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(34),
    position: "absolute",
    alignSelf: "center",
    marginHorizontal: horizontalScale(20),
  },
  handle: {
    width: horizontalScale(40),
    height: 4,
    backgroundColor: colors.gradient_light_purple,
    borderRadius: horizontalScale(2),
    alignSelf: "center",
    marginBottom: verticalScale(24),
  },
  topLine: {
    width: horizontalScale(70),
    height: verticalScale(3),
    backgroundColor: "rgba(141, 52, 255, 1)",
    borderRadius: horizontalScale(100),
    opacity: 0.4,
    alignSelf: "center",
    marginBottom: verticalScale(8),
  },
  title: {
    fontSize: fontScale(22),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.whiteLight,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
  message: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.textcolor,
    textAlign: "center",
    lineHeight: fontScale(22),
    marginBottom: verticalScale(32),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cancelButton: {
    width: horizontalScale(156),
    height: verticalScale(50),
    backgroundColor: "transparent",
    borderWidth: verticalScale(1),
    borderColor: colors.BtnBackground,
    borderRadius: horizontalScale(99),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: fontScale(16),
    lineHeight: fontScale(20),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
  },
  logoutButton: {
    width: horizontalScale(156),
    height: verticalScale(50),
    backgroundColor: colors.BtnBackground,
    borderRadius: horizontalScale(99),
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: colors.white,
    lineHeight: fontScale(24),
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
  },
});

export default LogoutConfirmationPopup;
