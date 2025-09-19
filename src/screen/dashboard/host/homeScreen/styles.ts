import { StyleSheet } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: verticalScale(1),
    backgroundColor: colors.hostGradientStart,
  },
  gradientContainer: {
    flex: verticalScale(1),
  },
  safeArea: {
    flex: verticalScale(1),
  },
  contentContainer: {
    flex: verticalScale(1),
  },
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: "800",
    fontFamily: fonts.ExtraBold,
    color: colors.white,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(15),
  },
  scrollView: {
    flex: verticalScale(1),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: verticalScale(1),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    textAlign: "center",
    lineHeight: fontScale(20),
  },
});

export default styles;
