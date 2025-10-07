import { StyleSheet } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(10),
  },
  backButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.addButtonBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: fontScale(20),
    lineHeight: verticalScale(24),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.white,
    flex: 1,
    textAlign: "center",
    marginLeft: horizontalScale(-20),
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  divider: {
    width: horizontalScale(337),
    height: verticalScale(0),
    opacity: verticalScale(0.2),
    borderWidth: verticalScale(1),
    borderColor: colors.whiteLight,
    marginVertical: verticalScale(20),
  },
  reviewsSection: {
    marginBottom: verticalScale(15),
  },
  reviewsTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(15),
  },
  reviewsContainer: {
    gap: verticalScale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  loadingText: {
    fontSize: fontScale(16),
    color: colors.white,
    marginTop: verticalScale(16),
    textAlign: "center",
  },
  bookingDetailsSection: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(20),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
    paddingHorizontal: horizontalScale(4),
  },
  detailLabel: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: fonts.medium,
    color: colors.whiteLight,
    flex: 1,
  },
  detailValue: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "right",
    flex: 1,
  },
  statusText: {
    color: colors.green,
    fontWeight: "700",
  },
  errorSubText: {
    fontSize: fontScale(14),
    color: colors.whiteLight,
    marginTop: verticalScale(8),
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
  retryButton: {
    backgroundColor: colors.addButtonBackground,
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(8),
    marginTop: verticalScale(20),
  },
  retryButtonText: {
    fontSize: fontScale(16),
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: horizontalScale(24),
  },
  emptyText: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: colors.whiteLight,
    marginBottom: verticalScale(8),
  },
  emptySubText: {
    fontSize: fontScale(14),
    color: colors.whiteLight,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
});
