import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: verticalScale(1),
    backgroundColor: colors.gradient_dark_purple,
  },
  safeArea: {
    flex: verticalScale(1),
  },
  header: {
    paddingTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(34),
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.SemiBold,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
  scrollView: {
    flex: verticalScale(1),
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  chatCard: {
    width: horizontalScale(335),
    height: verticalScale(76),
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(16),
    marginBottom: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
    shadowColor: colors.black,
    shadowOffset: {
      width: verticalScale(0),
      height: verticalScale(2),
    },
    shadowOpacity: verticalScale(0.1),
    shadowRadius: verticalScale(4),
    elevation: 3,
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: horizontalScale(12),
  },
  avatar: {
    width: verticalScale(49),
    height: verticalScale(49),
    borderRadius: verticalScale(90),
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameAndTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(3),
  },
  userName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    fontWeight: "700",
    color: colors.white,
    flex: 1,
  },
  timestamp: {
    fontSize: fontScale(10),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.textColor,
    marginLeft: horizontalScale(8),
  },
  messageAndBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.textColor,
    flex: 1,
    marginRight: horizontalScale(8),
  },
  unreadBadge: {
    backgroundColor: colors.violate,
    borderRadius: verticalScale(50),
    minWidth: verticalScale(21),
    height: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCount: {
    fontSize: fontScale(10),
    fontFamily: fonts.SemiBold,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
});
