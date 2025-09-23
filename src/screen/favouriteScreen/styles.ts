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
    flex: 1,
  },
  safeArea: {
    flex: 1,
    // Remove default padding as we're handling it with useSafeAreaInsets
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
  timeText: {
    color: colors.white,
    fontSize: fontScale(10),
    fontFamily: fonts.Medium,
    lineHeight: fontScale(16),
    fontWeight: "400",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.primary_lighter,
    textAlign: "center",
    marginTop: verticalScale(0),
  },
  categoriesSection: {
    paddingHorizontal: horizontalScale(20),
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
  nearbyEventsContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  eventsContent: {
    paddingBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
    paddingHorizontal: horizontalScale(40),
  },
  emptyTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: fontScale(20),
  },
});
