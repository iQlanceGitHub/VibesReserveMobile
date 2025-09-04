import { StyleSheet } from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    //paddingTop: verticalScale(50),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  congratulationContainer: {
    alignSelf: "center",
    marginBottom: verticalScale(30),
    marginTop: verticalScale(160),
    width: horizontalScale(164),
    height: verticalScale(164),
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
    alignSelf: 'center',
    marginBottom: verticalScale(20),
    lineHeight: fontScale(38),
  },
  discriptionText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    lineHeight: fontScale(20),
    textAlign: "center",
    marginBottom: verticalScale(40),
    height: fontScale(40),
    width: horizontalScale(271),
  },
  buttonSection: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  getStartedButton: {
    marginBottom: verticalScale(20),
  },
  submitButton: {
    backgroundColor: colors.violate,
    width: horizontalScale(335),
    height: verticalScale(50),
    borderRadius: verticalScale(30),
    marginBottom: verticalScale(20),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: verticalScale(12),
    paddingVertical: verticalScale(12),
  },
  manualLink: {
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.violate,
    lineHeight: fontScale(24),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  manualContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
