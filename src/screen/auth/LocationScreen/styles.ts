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
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  alertTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  changeButton: {
    backgroundColor: colors.lightGray,
  },
  confirmButton: {
    backgroundColor: colors.gradient_light_purple,
  },
  changeButtonText: {
    color: colors.black,
    fontFamily: fonts.medium,
  },
  confirmButtonText: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  alertTooltip: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});