import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(16),
    padding: verticalScale(16),
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: verticalScale(0.1),
    shadowRadius: verticalScale(8),
    elevation: verticalScale(4),
    minHeight: verticalScale(100),
  },
  iconContainer: {
    width: horizontalScale(48),
    height: verticalScale(48),
    borderRadius: verticalScale(24),
    backgroundColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(16),
  },
  iconText: {
    fontSize: fontScale(20),
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: verticalScale(4),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  notificationTitle: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    flex: 1,
    lineHeight: fontScale(20),
  },
  unreadDot: {
    width: horizontalScale(8),
    height: verticalScale(8),
    borderRadius: verticalScale(4),
    backgroundColor: colors.violate,
    marginLeft: horizontalScale(8),
  },
  notificationMessage: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.textColor,
    lineHeight: fontScale(18),
    marginBottom: verticalScale(8),
    flex: 1,
  },
  notificationTime: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.textColor,
    lineHeight: fontScale(16),
    alignSelf: "flex-start",
    opacity: 0.8,
  },
});

export default styles;
