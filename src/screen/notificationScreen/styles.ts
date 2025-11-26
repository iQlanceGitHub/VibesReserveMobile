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
    marginTop: verticalScale(20),
  },
  statusBar: {
    height: Platform.OS === 'ios' ? verticalScale(44) : verticalScale(24),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
    minHeight: verticalScale(60),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fonts.Bold,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    flex: 1,
    lineHeight: fontScale(28),
  },
  placeholder: {
    width: horizontalScale(44),
    height: horizontalScale(44),
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
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(16),
    lineHeight: fontScale(22),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(80),
  },
  emptyTitle: {
    fontSize: fontScale(24),
    fontFamily: fonts.Bold,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    marginBottom: verticalScale(16),
    lineHeight: fontScale(28),
  },
  emptyMessage: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    textAlign: "center",
    lineHeight: fontScale(22),
    opacity: 0.8,
    maxWidth: horizontalScale(280),
  },
});

export default styles;
