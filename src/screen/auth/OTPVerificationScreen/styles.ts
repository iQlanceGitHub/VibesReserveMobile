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
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fonts.BlackerBold,
    fontWeight: "700",
    color: colors.white,
    alignSelf: 'flex-start',
    marginBottom: verticalScale(20),
    lineHeight: fontScale(38),
  },
  combinedText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    //textAlign: "center",
    marginBottom: verticalScale(40),
    lineHeight: fontScale(24),
    opacity: 0.9,
  },
  emailHighlight: {
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(30),
    gap: horizontalScale(12),
  },
  otpInput: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.disableGray,
    borderRadius: verticalScale(8),
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
    lineHeight: fontScale(24),
  },
  otpInputFilled: {
    borderColor: colors.violate,
    backgroundColor: "rgba(141, 52, 255, 0.1)",
  },
  timer: {
    fontSize: fontScale(18),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
    marginBottom: verticalScale(30),
    lineHeight: fontScale(24),
  },
  submitButton: {
    backgroundColor: colors.disableGray,
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
  submitButtonEnabled: {
    backgroundColor: colors.violate,
  },
  resendContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  resendText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    textAlign: "center",
    lineHeight: fontScale(24),
  },
  resendLink: {
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.violate,
    textDecorationLine: "underline",
    lineHeight: fontScale(24),
  },
  resendLinkDisabled: {
    color: colors.disableGray,
    textDecorationLine: "none",
  },
});
