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
});
