import { StyleSheet } from "react-native";
import * as appConstant from "../../../utilis/appConstant";
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
    backgroundColor: colors.gradient_dark_purple,
  },
  gradientContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  scrollViewContentKeyboardVisible: {
    paddingBottom: verticalScale(10),
  },
  header: {
    paddingHorizontal: horizontalScale(20),
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  timeText: {
    color: colors.white,
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    fontWeight: 500,
    lineHeight: appConstant.fontScale(24),
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontFamily: fonts.semiBold,
  },
  backButton: {
    marginBottom: verticalScale(20),
  },
  backArrow: {
    color: colors.white,
    fontSize: fontScale(24),
    fontFamily: fonts.Medium,
  },
  titleSection: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fonts.SemiBold,
    fontWeight: "600",
    color: colors.white,
    lineHeight: fontScale(24) * 1.6,
    letterSpacing: 0,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    lineHeight: 20,
    letterSpacing: 0,
    opacity: 0.8,
  },
  socialSection: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(15),
  },
  socialButton: {
    backgroundColor: colors.white,
    width: horizontalScale(333),
    height: verticalScale(49),
    borderRadius: verticalScale(30),
    marginBottom: verticalScale(15),
    paddingTop: verticalScale(12),
    paddingRight: horizontalScale(66),
    paddingBottom: verticalScale(12),
    paddingLeft: horizontalScale(66),
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignSelf: "center",
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcons: {
    fontSize: fontScale(20),
    marginRight: horizontalScale(10),
    color: colors.fontgary,
  },
  appleIcons: {
    fontSize: fontScale(20),
    marginRight: horizontalScale(10),
  },
  socialButtonText: {
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.darkGray,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(15),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.disableGray,
    opacity: 0.3,
  },
  dividerText: {
    fontWeight: "500",
    color: colors.white,
    fontSize: fontScale(18),
    fontFamily: fonts.medium,
    marginHorizontal: horizontalScale(15),
  },
  roleSection: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.white,
    marginBottom: verticalScale(5),
  },
  roleOptions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: horizontalScale(40),
  },
  roleOption: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: verticalScale(10),
  },
  selectedRole: {
    // No additional styling needed for selected role
  },
  roleContent: {
    alignItems: "center",
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  roleIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedIconContainer: {
    borderColor: colors.violate,
    backgroundColor: colors.violate,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.disableGray,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: colors.violate,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.violate,
  },
  roleIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  roleText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.white,
  },
  formSection: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(4),
  },
  inputContainer: {
    marginBottom: verticalScale(10),
  },
  customInput: {
    marginBottom: verticalScale(6),
  },
  inputLabel: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.white,
    marginBottom: verticalScale(8),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
  },
  inputIcon: {
    fontSize: fontScale(18),
    marginRight: horizontalScale(10),
  },
  textInput: {
    flex: 1,
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  phoneCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: horizontalScale(10),
  },
  flagIcon: {
    fontSize: fontScale(16),
    marginRight: horizontalScale(5),
  },
  phoneCode: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    marginRight: horizontalScale(5),
  },
  dropdownArrow: {
    fontSize: fontScale(12),
    color: colors.disableGray,
  },
  phoneInput: {
    marginLeft: horizontalScale(10),
  },
  eyeIcon: {
    fontSize: fontScale(18),
    color: colors.disableGray,
  },
  documentSection: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(30),
  },
  documentUpload: {
    width: 335,
    height: 138,
    borderWidth: 1,
    borderColor: colors.disableGray,
    borderStyle: "solid",
    borderRadius: 20,
    paddingTop: 14,
    paddingRight: 10,
    paddingBottom: 20,
    paddingLeft: 12,
    alignItems: "center",
    alignSelf: "center",
  },
  documentContent: {
    alignItems: "center",
    gap: 8,
  },
  documentText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    marginBottom: verticalScale(5),
  },
  documentSubtext: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.disableGray,
    marginBottom: verticalScale(15),
  },
  browseButton: {
    width: 98,
    height: 31,
    backgroundColor: colors.violate,
    borderRadius: 90,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 6,
    paddingLeft: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  browseButtonText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 12,
    lineHeight: 19.2, // 160% of 12px
    letterSpacing: 0,
    textAlign: "center",
    color: colors.white,
  },
  buttonSection: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  loginLinkSection: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(20),
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  handleSavePasswordButton: {
    marginBottom: verticalScale(20),
  },
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    opacity: 0.8,
  },
  loginLinkText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.violate,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
  },
  optionsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(0),
    marginBottom: verticalScale(20),
  },
  rememberMeContainer: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.disableGray,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(8),
  },
  checkedBox: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
  },
  checkmark: {
    color: colors.white,
    fontSize: fontScale(12),
    fontWeight: "600",
  },
  rememberMeText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.white,
  },
  forgotPasswordContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: colors.violate,
  },
  passwordRequirements: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.primary_blue, // Add appropriate color
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: colors.primary_pinkLight, // Add appropriate color
  },
  requirement: {
    fontSize: 12,
    color: colors.red, // Red for unmet requirements
    marginBottom: 2,
  },
  requirementMet: {
    color: colors.green, // Green for met requirements
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: colors.disableGray, // Make sure this color exists
  },
  passwordMismatchError: {
    color: colors.red, // Make sure you have error color defined
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
