import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

export default StyleSheet.create({
  container: {
    marginBottom: verticalScale(0),
  },
  divider: {
    width: horizontalScale(337),
    height: verticalScale(0),
    opacity: verticalScale(0.2),
    borderWidth: verticalScale(1),
    borderColor: colors.whiteLight,
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
  },
  reviewContent: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(2),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileImage: {
    width: horizontalScale(45.46),
    height: verticalScale(45.46),
    borderRadius: verticalScale(25),
    marginRight: horizontalScale(16),
    borderWidth: 2,
    borderColor: colors.violate,
    marginTop: verticalScale(8),
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: fontScale(14),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.whiteLight,
    marginRight: horizontalScale(6),
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: horizontalScale(6),
  },
  ratingValue: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.whiteLight,
  },
  reviewText: {
    fontSize: fontScale(12),
    fontWeight: "300",
    fontFamily: fonts.light,
    color: colors.whiteLight,
    lineHeight: verticalScale(16),
    marginLeft: horizontalScale(66),
    marginTop: verticalScale(-18),
  },
});
