import { StyleSheet } from "react-native";
import { colors } from "../../../../../utilis/colors";
import { fonts } from "../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(40),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.bold,
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: horizontalScale(40),
  },
  locationContainer: {
    marginBottom: verticalScale(20),
  },
  locationText: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: verticalScale(100),
  },
  cardContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: verticalScale(12),
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: horizontalScale(12),
  },
  clubImage: {
    width: horizontalScale(100),
    height: verticalScale(80),
    borderRadius: verticalScale(12),
  },
  favoriteButton: {
    position: "absolute",
    top: verticalScale(6),
    left: horizontalScale(6),
    width: horizontalScale(28),
    height: verticalScale(28),
    borderRadius: verticalScale(14),
    backgroundColor: colors.whiteTransparentMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  priceText: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  clubName: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(6),
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(3),
  },
  detailText: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: verticalScale(16),
    backgroundColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedContent: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(16),
  },
  expandedDivider: {
    height: 1,
    backgroundColor: colors.purpleBorder,
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(12),
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.unselectedBackground,
    borderRadius: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: fontScale(14),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDateTime: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
  },
  eventPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventPrice: {
    fontSize: fontScale(14),
    fontFamily: fonts.bold,
    color: colors.violate,
    marginRight: horizontalScale(8),
  },
});
