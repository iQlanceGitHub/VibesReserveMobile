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
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
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
    marginLeft: horizontalScale(-40),
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  divider: {
    width: 337,
    height: 0,
    opacity: 0.2,
    borderWidth: 1,
    borderColor: colors.whiteLight,
    marginVertical: verticalScale(20),
  },
  reviewsSection: {
    marginBottom: verticalScale(20),
  },
  reviewsTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(20),
  },
  reviewsContainer: {
    gap: verticalScale(16),
  },
});
