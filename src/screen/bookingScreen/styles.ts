import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: verticalScale(5),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(2),
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(2),
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.primary_lighter,
    textAlign: "center",
    marginTop: verticalScale(0),
    marginBottom: verticalScale(23),
  },
  tabsSection: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  tabsTitle: {
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.primary_lighter,
    marginBottom: verticalScale(12),
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: horizontalScale(20),
    gap: horizontalScale(10),
  },
  tab: {
    width: horizontalScale(103),
    height: verticalScale(34),
    borderRadius: verticalScale(90),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTab: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
  },
  unselectedTab: {
    backgroundColor: colors.unselectedBackground,
    borderColor: colors.purpleBorder,
  },
  tabText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    textAlign: "center",
  },
  selectedTabText: {
    color: colors.white,
  },
  unselectedTabText: {
    color: colors.white,
  },
  bookingsContainer: {
    flex: 1,
  },
  bookingsContent: {
    paddingBottom: verticalScale(20),
  },
  bookingCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(16),
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(16),
    paddingTop: verticalScale(12),
    paddingHorizontal: verticalScale(10),
    paddingBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: verticalScale(0.1),
    shadowRadius: verticalScale(8),
    elevation: verticalScale(4),
  },
  cardTopSection: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
  },
  separatorLine: {
    width: horizontalScale(314),
    opacity: verticalScale(0.15),
    borderWidth: verticalScale(1),
    borderColor: colors.white,
    marginBottom: verticalScale(12),
    alignSelf: "center",
  },
  bookingImage: {
    width: horizontalScale(120),
    height: verticalScale(90),
    borderRadius: verticalScale(14),
    marginRight: horizontalScale(8),
  },
  bookingContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(5),
  },
  categoryTag: {
    backgroundColor: colors.categoryBackground,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(4),
    borderRadius: verticalScale(12),
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: fontScale(8),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.white,
  },
  priceText: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    fontWeight: "800",
    lineHeight: fontScale(20),
  },
  eventName: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(5),
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  detailText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
    lineHeight: fontScale(16),
  },
  cancelButton: {
    width: horizontalScale(180),
    height: verticalScale(38),
    gap: horizontalScale(10),
    borderRadius: verticalScale(99),
    borderWidth: verticalScale(1),
    borderColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  cancelButtonText: {
    fontSize: fontScale(14),
    fontWeight: "600",
    lineHeight: fontScale(24),
    fontFamily: fonts.semiBold,
    color: colors.violate,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
  emptyText: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.whiteLight,
    textAlign: "center",
  },
});

export default styles;
