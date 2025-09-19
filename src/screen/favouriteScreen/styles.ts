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
  eventsContent: {
    paddingBottom: verticalScale(20),
  },
});
