import { StyleSheet } from "react-native";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";

const clubBookingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.vilate10,
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: horizontalScale(40),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: fontScale(16),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.white,
    marginLeft: horizontalScale(8),
    maxWidth: horizontalScale(200),
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: fontScale(18),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    color: colors.white,
    marginLeft: horizontalScale(4),
  },
  calendarContainer: {
    alignItems: "center",
    marginHorizontal: horizontalScale(20),
    marginVertical: verticalScale(16),
  },
  memberSection: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: "rgba(18, 1, 40, 1)",
  },
  memberTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: verticalScale(16),
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flex: 1,
  },
  memberLabel: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  memberAge: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
  },
  memberCounter: {
    flexDirection: "row",
    alignItems: "center",
    width: horizontalScale(120),
    height: verticalScale(32),
    borderRadius: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.violate,
    paddingHorizontal: horizontalScale(8),
    justifyContent: "space-between",
  },
  memberCount: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    textAlign: "center",
    minWidth: horizontalScale(20),
  },
  capacityText: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    marginTop: verticalScale(4),
  },
  // Price section styles
  priceSection: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: "rgba(18, 1, 40, 0.8)",
    marginHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    marginBottom: verticalScale(16),
  },
  priceTitle: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: verticalScale(12),
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  priceLabel: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
  },
  priceValue: {
    fontSize: fontScale(14),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  totalPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: colors.whiteTransparentMedium,
  },
  totalPriceLabel: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  totalPriceValue: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.violate,
  },
  nextButtonContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(40),
    backgroundColor: "rgba(18, 1, 40, 1)",
  },
  nextButton: {
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(99),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  nextButtonDisabled: {
    backgroundColor: colors.whiteTransparentMedium,
    opacity: 0.6,
  },
  // Date Availability styles
  dateAvailabilityContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: "rgba(18, 1, 40, 0.8)",
    marginHorizontal: horizontalScale(20),
    borderRadius: horizontalScale(12),
    marginBottom: verticalScale(16),
  },
  dateAvailabilityTitle: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: verticalScale(12),
    textAlign: "center",
  },
  dateAvailabilityRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: horizontalScale(8),
  },
  dateAvailabilityItem: {
    alignItems: "center",
    minWidth: horizontalScale(60),
    marginBottom: verticalScale(8),
  },
  availabilityBadge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
    marginTop: verticalScale(4),
    minWidth: horizontalScale(70),
    alignItems: "center",
  },
  availableBadge: {
    backgroundColor: colors.green + "20",
    borderWidth: 1,
    borderColor: colors.green,
  },
  soldOutBadge: {
    backgroundColor: colors.red + "20",
    borderWidth: 1,
    borderColor: colors.red,
  },
  availabilityText: {
    fontSize: fontScale(14),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    textAlign: "center",
  },
  availableText: {
    color: colors.green,
  },
  soldOutText: {
    color: colors.white,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  loadingText: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
  },
});

export default clubBookingStyles;
