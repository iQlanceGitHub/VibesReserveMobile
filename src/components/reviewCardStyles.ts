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
    color: colors.textcolor,
    lineHeight: verticalScale(16),
    marginLeft: horizontalScale(60),
   // marginTop: verticalScale(-15),
  },
  flagButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
    borderWidth: 1,
    borderColor: '#FF4444',
    marginLeft: horizontalScale(8),
  },
  flagButtonText: {
    fontSize: fontScale(10),
    fontFamily: fonts.Medium,
    color: '#FF4444',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  blockedUserName: {
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  blockedIndicator: {
    backgroundColor: '#FF4444',
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
    borderRadius: horizontalScale(8),
    marginLeft: horizontalScale(8),
  },
  blockedText: {
    fontSize: fontScale(8),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  actionButtons: {
    marginLeft: horizontalScale(8),
  },
  unblockButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  unblockButtonText: {
    fontSize: fontScale(10),
    fontFamily: fonts.Medium,
    color: '#4CAF50',
  },
  blockedReviewText: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
