import { StyleSheet } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import { verticalScale } from "../../../../utilis/appConstant";
import { fontScale } from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: verticalScale(20),
    paddingVertical: verticalScale(16),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: verticalScale(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  formContainer: {
    flex: 1,
    paddingTop: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: verticalScale(8),
  },
  buttonContainer: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  submitButton: {
    backgroundColor: colors.BtnBackground,
    borderRadius: verticalScale(25),
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.BtnBackground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default styles;
