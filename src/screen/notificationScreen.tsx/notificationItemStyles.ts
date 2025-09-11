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
    width: horizontalScale(336),
    height: verticalScale(111),
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(16),
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(17),
    padding: verticalScale(16),
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: verticalScale(0.1),
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: horizontalScale(36),
    borderRadius: verticalScale(18),
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: fontScale(18),
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(6),
  },
  notificationTitle: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: fonts.medium,
    color: colors.whiteLight,
    flex: 1,
  },
  unreadDot: {
    width: horizontalScale(10),
    height: verticalScale(10),
    borderRadius: verticalScale(10),
    backgroundColor: colors.violate,
    marginLeft: horizontalScale(8),
  },
  notificationMessage: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.textColor,
    lineHeight: fontScale(16),
    marginBottom: verticalScale(6),
  },
  notificationTime: {
    fontSize: fontScale(11),
    fontFamily: fonts.regular,
    color: colors.textColor,
    lineHeight: fontScale(14),
    alignSelf: "flex-start",
  },
});

export default styles;
