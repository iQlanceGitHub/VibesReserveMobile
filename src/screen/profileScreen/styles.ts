import { StyleSheet, Platform } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  statusBar: {
    height: verticalScale(44),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    flex: 1,
    lineHeight: fontScale(24),
  },
  placeholder: {
    width: horizontalScale(44),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  profileSection: {
    backgroundColor: colors.profileCardBackground,
    width: horizontalScale(375),
    height: verticalScale(300),
    opacity: 1,
    borderTopLeftRadius: horizontalScale(30),
    borderTopRightRadius: horizontalScale(30),
    borderBottomRightRadius: horizontalScale(40),
    borderBottomLeftRadius: horizontalScale(40),
    borderBottomWidth: 1,
    borderBottomColor: colors.purpleBorder,
  },
  profileContent: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(45),
    marginTop: verticalScale(25),
  },
  profileImageContainer: {
    position: "relative",
    marginRight: horizontalScale(20),
  },
  profileImage: {
    width: horizontalScale(80),
    height: horizontalScale(80),
    borderRadius: horizontalScale(40),
    backgroundColor: colors.violate,
    borderWidth: 3,
    borderColor: colors.profileImageBorder,
  },
  editIconContainer: {
    bottom: verticalScale(20),
    right: horizontalScale(-50),
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.violate,
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfoLabel: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    color: colors.whiteLight,
    marginBottom: verticalScale(2),
    lineHeight: fontScale(18),
  },
  userInfoValue: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: verticalScale(5),
    lineHeight: fontScale(20),
  },
  userInfoName: {
    fontSize: fontScale(20),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.white,
    marginBottom: verticalScale(5),
    lineHeight: fontScale(20),
  },
  licenseSection: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(-80),
    marginBottom: verticalScale(30),
    alignItems: "center",
    position: "relative",
  },
  licenseBorderContainer: {
    width: horizontalScale(250),
    height: verticalScale(151),
    borderWidth: horizontalScale(0.84),
    borderColor: colors.purpleBorder,
    borderRadius: horizontalScale(13.41),
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  licenseContainer: {
    backgroundColor: colors.white,
    width: horizontalScale(224),
    height: verticalScale(131),
    borderRadius: horizontalScale(13.41),
    padding: horizontalScale(16),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuSection: {
    width: horizontalScale(336),
    alignSelf: "center",
  },
  menuOption: {
    borderRadius: horizontalScale(16),
    borderColor: colors.purpleBorder,
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  menuOptionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: horizontalScale(336),
    height: verticalScale(50),
    paddingHorizontal: horizontalScale(16),
  },
  menuOptionText: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    flex: 1,
    lineHeight: fontScale(20),
  },
  menuRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchButton: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: horizontalScale(20),
    marginRight: horizontalScale(8),
  },
  switchButtonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  shareIconsContainer: {
    flexDirection: "row",
    marginRight: horizontalScale(8),
  },
  shareIcon: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.whiteTransparentMedium,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: horizontalScale(4),
  },
  shareIconText: {
    fontSize: fontScale(12),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  arrowContainer: {
    marginLeft: horizontalScale(8),
  },
  arrowText: {
    fontSize: fontScale(20),
    color: colors.white,
    fontWeight: "bold",
  },
});

export default styles;
