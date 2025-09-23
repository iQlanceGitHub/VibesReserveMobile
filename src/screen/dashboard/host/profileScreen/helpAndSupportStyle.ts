import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../../utilis/appConstant";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(15),
    backgroundColor: "transparent",
  },
  backButtonCircle: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.addButtonBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  formContainer: {
    flex: 1,
    paddingTop: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(10),
    backgroundColor: "transparent",
  },
  submitButton: {
    backgroundColor: colors.violate,
    borderRadius: verticalScale(25),
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.violate,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default styles;
