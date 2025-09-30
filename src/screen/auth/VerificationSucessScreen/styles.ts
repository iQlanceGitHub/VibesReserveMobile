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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    //paddingTop: verticalScale(50),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  congratulationContainer: {
    alignSelf: "center",
    marginBottom: verticalScale(40),
    width: horizontalScale(120),
    height: verticalScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    alignItems: "center",
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: fontScale(28),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(16),
    lineHeight: fontScale(36),
  },
  discriptionText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    fontWeight: "400",
    color: colors.white,
    textAlign: "center",
    marginBottom: verticalScale(60),
    lineHeight: fontScale(24),
    paddingHorizontal: horizontalScale(20),
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(40),
    position: 'absolute',
    bottom: 0,
  },
  getStartedButton: {
    width: '100%',
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
 
});
