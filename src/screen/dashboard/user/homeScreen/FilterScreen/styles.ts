import { StyleSheet } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../utilis/appConstant';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterContainer: {
    backgroundColor: colors.gradient_dark_purple,
    borderTopLeftRadius: verticalScale(20),
    borderTopRightRadius: verticalScale(20),
    maxHeight: '90%',
    minHeight: '80%',
  },
  dragHandle: {
    width: horizontalScale(40),
    height: verticalScale(4),
    backgroundColor: colors.violate,
    borderRadius: verticalScale(2),
    alignSelf: 'center',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  header: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.Bold,
    color: colors.white,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  section: {
    marginVertical: verticalScale(16),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(12),
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(8),
    borderWidth: 1,
    borderColor: colors.violate,
  },
  locationText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.white,
    opacity: 0.7,
  },
  categoriesContainer: {
    paddingRight: horizontalScale(20),
  },
  categoryButton: {
    marginRight: horizontalScale(12),
  },
  datesContainer: {
    paddingRight: horizontalScale(20),
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(30),
    gap: horizontalScale(12),
  },
  resetButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: verticalScale(90),
    borderWidth: 1,
    borderColor: colors.violate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.violate,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: verticalScale(90),
    backgroundColor: colors.violate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    fontWeight: '600',
  },
});
