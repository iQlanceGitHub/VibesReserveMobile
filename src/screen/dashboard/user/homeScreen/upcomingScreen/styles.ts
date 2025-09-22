import { StyleSheet } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../../../../utilis/appConstant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(20),
    backgroundColor: colors.backgroundColor,
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
  },
  placeholder: {
    width: horizontalScale(24), // Same width as back button for centering
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  iconContainer: {
    marginBottom: verticalScale(30),
  },
  iconCircle: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: horizontalScale(60),
    backgroundColor: colors.primary_blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary_blue,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconText: {
    fontSize: fontScale(48),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  mainTitle: {
    fontSize: fontScale(28),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  subTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Medium,
    color: colors.violate,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: verticalScale(40),
  },
  description: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: fontScale(24),
    opacity: 0.8,
  },
  dotsContainer: {
    marginBottom: verticalScale(50),
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: horizontalScale(12),
    height: horizontalScale(12),
    borderRadius: horizontalScale(6),
    backgroundColor: colors.primary_blue,
    marginHorizontal: horizontalScale(6),
  },
  buttonContainer: {
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.primary_blue,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(32),
    borderRadius: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary_blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
});
