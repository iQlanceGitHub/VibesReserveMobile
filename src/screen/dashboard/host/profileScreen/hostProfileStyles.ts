import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(70),
  },
  profileSection: {
    backgroundColor: colors.profileCardBackground,
    width: horizontalScale(375),
    height: verticalScale(240),
    opacity: 1,
    borderTopLeftRadius: horizontalScale(30),
    borderTopRightRadius: horizontalScale(30),
    borderBottomRightRadius: horizontalScale(40),
    borderBottomLeftRadius: horizontalScale(40),
    borderBottomWidth: 1,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    borderColor: colors.purpleBorder,
    borderBottomColor: colors.purpleBorder,
    marginTop: verticalScale(Platform.OS === "ios" ? 0 : 20),
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    lineHeight: fontScale(24),
  },
  profileContent: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(45),
    marginTop: verticalScale(24),
  },
  profileImageContainer: {
    position: "relative",
    marginRight: horizontalScale(20),
  },
  profileImagePlaceholder: {
    width: horizontalScale(92),
    height: horizontalScale(92),
    borderRadius: horizontalScale(46),
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: colors.profileImageBorder,
    overflow: "hidden",
    shadowColor: colors.violate,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  profileImage: {
    width: horizontalScale(92),
    height: horizontalScale(92),
    resizeMode: "cover",
  },
  editIconContainer: {
    position: "absolute",
    bottom: verticalScale(20),
    right: horizontalScale(-5),
    width: horizontalScale(26),
    height: horizontalScale(26),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userInfoName: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.white,
    marginBottom: verticalScale(8),
    lineHeight: fontScale(22),
  },
  userInfoValue: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: verticalScale(4),
    lineHeight: fontScale(18),
  },
  menuSection: {
    width: horizontalScale(336),
    alignSelf: "center",
    marginTop: verticalScale(25),
  },
  menuOption: {
    borderRadius: horizontalScale(16),
    borderColor: colors.purpleBorder,
    borderWidth: 1,
    marginBottom: verticalScale(12),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuOptionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: horizontalScale(336),
    height: verticalScale(50),
    paddingHorizontal: horizontalScale(20),
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
    paddingVertical: verticalScale(8),
    borderRadius: horizontalScale(20),
    marginRight: horizontalScale(8),
    minWidth: horizontalScale(60),
    alignItems: "center",
    justifyContent: "center",
  },
  switchButtonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  arrowContainer: {
    marginLeft: horizontalScale(8),
  },
});

export default styles;
