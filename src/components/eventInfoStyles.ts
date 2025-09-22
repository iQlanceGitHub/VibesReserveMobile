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
    marginBottom: verticalScale(20),
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(12),
  },
  eventDetails: {
    flex: 1,
  },
  eventNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(31),
    marginBottom: verticalScale(8),
  },
  eventName: {
    fontSize: fontScale(20),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    lineHeight: fontScale(24),
    flexShrink: 1,
    flex: 1,
    marginRight: horizontalScale(8),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: horizontalScale(6),
  },
  ratingValue: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.whiteLight,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(8),
  },
  priceContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.textcolor,
    marginBottom: verticalScale(4),
  },
  priceValue: {
    fontSize: fontScale(24),
    fontWeight: "800",
    fontFamily: fonts.ExtraBold,
    color: colors.white,
  },
  detailsContainer: {
    gap: verticalScale(15),
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  detailText: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteLight,
  },
});
