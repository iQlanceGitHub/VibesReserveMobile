import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../utilis/appConstant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    // Remove default padding as we're handling it with useSafeAreaInsets
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20), // Reduced since we're adding paddingTop to container
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
  listContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(100),
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
