import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.profileCardBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: verticalScale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: horizontalScale(40),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  contentTitle: {
    fontSize: fontScale(24),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  contentText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
    lineHeight: fontScale(24),
    textAlign: "justify",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    marginTop: verticalScale(10),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: "center",
  },
});

export default styles;
