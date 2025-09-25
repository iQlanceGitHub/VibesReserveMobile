import { StyleSheet } from "react-native";
import * as appConstant from "../../../../utilis/appConstant";
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
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(40),
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  locationText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: fontScale(16),
    marginLeft: horizontalScale(8),
    flex: 1,
  },
  mapIcon: {
    marginLeft: "auto",
    backgroundColor: colors.cardBackground,
    borderRadius: horizontalScale(22),
    height: horizontalScale(44),
    width: horizontalScale(44),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: colors.BtnBackground,
    shadowColor: colors.BtnBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D014D",
    borderRadius: 16,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
  },
  searchInput: {
    color: "#fff",
    fontFamily: fonts.regular,
    fontSize: fontScale(14),
    marginLeft: horizontalScale(8),
    flex: 1,
  },

  categoryChip: {
    backgroundColor: "#2D014D",
    borderRadius: 20,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(6),
    marginRight: horizontalScale(8),
    borderWidth: 0.5,
    borderColor: "transparent",
  },
  categoryChipActive: {
    backgroundColor: "#B983FF",
    borderColor: "#fff",
  },
  categoryText: {
    color: "#B983FF",
    fontFamily: fonts.medium,
    fontSize: fontScale(13),
  },
  categoryTextActive: {
    color: "#2D014D",
  },
  sectionTitle: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: fontScale(18),
    marginVertical: verticalScale(8),
  },
  featuredCard: {
    backgroundColor: "#2D014D",
    borderRadius: 20,
    padding: horizontalScale(16),
    marginBottom: verticalScale(18),
    shadowColor: "#B983FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: "100%",
    height: verticalScale(140),
    borderRadius: 16,
    marginBottom: verticalScale(8),
  },
  featuredTag: {
    position: "absolute",
    top: verticalScale(18),
    left: horizontalScale(18),
    backgroundColor: "#B983FF",
    borderRadius: 10,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
  },
  featuredTagText: {
    color: "#2D014D",
    fontFamily: fonts.bold,
    fontSize: fontScale(11),
  },
  featuredTitle: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: fontScale(16),
    marginTop: verticalScale(4),
  },
  featuredInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  featuredLocation: {
    color: "#B983FF",
    fontFamily: fonts.regular,
    fontSize: fontScale(12),
    marginLeft: horizontalScale(4),
  },
  featuredRating: {
    color: "#FFD700",
    fontFamily: fonts.medium,
    fontSize: fontScale(12),
    marginLeft: horizontalScale(2),
  },
  featuredDate: {
    color: "#B983FF",
    fontFamily: fonts.regular,
    fontSize: fontScale(12),
    marginLeft: horizontalScale(4),
  },
  featuredBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
  },
  featuredPrice: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: fontScale(18),
  },
  bookNowBtn: {
    backgroundColor: "#B983FF",
    borderRadius: 16,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
  },
  bookNowText: {
    color: "#2D014D",
    fontFamily: fonts.bold,
    fontSize: fontScale(14),
  },
  nearbyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(4),
  },
  seeAllText: {
    color: "#B983FF",
    fontFamily: fonts.medium,
    fontSize: fontScale(13),
  },
  nearbyEventsContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(100), // Add space for bottom tab
  },

  categoriesSection: {
    marginBottom: verticalScale(20),
  },
  categoriesTitle: {
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.primary_lighter,
    marginBottom: verticalScale(12),
  },
  categoriesContainer: {
    paddingRight: horizontalScale(20),
  },
  eventsContainer: {
    flex: 1,
  },
  eventsContent: {
    paddingBottom: verticalScale(120), // Add space for bottom tab
  },
  FeatureEventContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(20),
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: verticalScale(10),
    zIndex: 10,
    pointerEvents: "auto", // Allow touches on search bar
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  testButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  emptyStateContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: fontScale(16),
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  comingSoonDialog: {
    backgroundColor: colors.white,
    borderRadius: verticalScale(16),
    padding: verticalScale(24),
    width: '100%',
    maxWidth: horizontalScale(320),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dialogHeader: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  dialogTitle: {
    fontSize: fontScale(24),
    fontFamily: fonts.bold,
    color: colors.violate,
    textAlign: 'center',
  },
  dialogContent: {
    marginBottom: verticalScale(24),
  },
  dialogMessage: {
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
    color: colors.black,
    textAlign: 'center',
    lineHeight: fontScale(22),
  },
  dialogActions: {
    alignItems: 'center',
  },
  dialogButton: {
    backgroundColor: colors.violate,
    paddingHorizontal: horizontalScale(32),
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(32),
    minWidth: horizontalScale(120),
  },
  dialogButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: 'center',

  },
});
