import { StyleSheet, Platform } from "react-native";
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
  statusBar: {
    height: verticalScale(44),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    flex: 1,
    lineHeight: fontScale(24),
  },
  placeholder: {
    width: horizontalScale(44),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  sectionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: fonts.medium,
    color: colors.whiteLight,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(16),
    lineHeight: fontScale(22),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(60),
  },
  emptyTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    marginBottom: verticalScale(12),
    lineHeight: fontScale(24),
  },
  emptyMessage: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.whiteLight,
    textAlign: "center",
    lineHeight: fontScale(20),
    opacity: 0.8,
  },
});

export default styles;
