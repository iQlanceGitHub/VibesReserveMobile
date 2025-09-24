import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../utilis/appConstant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(60),
  },
  title: {
    fontSize: fontScale(28),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: fontScale(22),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  loginButton: {
    backgroundColor: colors.white,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(40),
    borderRadius: horizontalScale(25),
    width: '80%',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.violate,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(40),
    borderRadius: horizontalScale(25),
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    marginTop: verticalScale(-20),
  },
  skipButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  logoutButton: {
    backgroundColor: colors.red || '#FF4444',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(40),
    borderRadius: horizontalScale(25),
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: horizontalScale(20),
  },
  infoText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: fontScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
  },
});
