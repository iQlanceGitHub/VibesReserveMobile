import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(10),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    fontWeight: "600",
  },
  headerSpacer: {
    width: horizontalScale(44),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(100),
  },
  formContainer: {
    marginTop: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(6),
  },
  labelText: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  DiscountText: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
  },
  requiredText: {
    color: colors.textColor,
  },
  discountHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountInputContainer: {
    marginTop: verticalScale(-12),
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: "transparent",
  },
  submitButton: {
    backgroundColor: colors.BtnBackground,
    borderRadius: 90,
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  // Date Picker Custom Style
  datePickerWrapper: {
    position: "relative",
  },
  datePickerRightIcon: {
    position: "absolute",
    right: horizontalScale(15),
    top: verticalScale(40),
    zIndex: 1,
    width: verticalScale(20),
    height: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? verticalScale(0) : verticalScale(10),
  },
});

export default styles;
