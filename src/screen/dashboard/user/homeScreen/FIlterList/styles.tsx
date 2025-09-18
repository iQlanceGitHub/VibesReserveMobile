import { StyleSheet } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../utilis/appConstant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.gradient_dark_purple,
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    flex: 1,
    fontWeight: '700'
  },
  headerSpacer: {
    width: horizontalScale(40), // Same width as back button to center the title
  },
  eventsList: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(150),
    paddingHorizontal: horizontalScale(40),
  },
  emptyIcon: {
    fontSize: fontScale(64),
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: fontScale(24),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  emptyMessage: {
    fontSize: fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: fontScale(24),
  },
});
