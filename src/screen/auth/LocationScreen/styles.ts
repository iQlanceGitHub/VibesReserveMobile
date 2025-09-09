import { StyleSheet } from 'react-native';
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  congratulationContainer: {
    alignItems: 'center',
    marginTop: verticalScale(80),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  discriptionText: {
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(40),
    opacity: 0.8,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: verticalScale(20),
  },
  manualContainer: {
    marginTop: verticalScale(10),
  },
  manualLink: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});