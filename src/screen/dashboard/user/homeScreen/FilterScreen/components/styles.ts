import { StyleSheet } from 'react-native';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

export default StyleSheet.create({
  sliderContainer: {
    marginVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(10),
    backgroundColor: 'transparent',
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  slider: {
    flex: 1,
    height: verticalScale(40),
    marginHorizontal: horizontalScale(10),
  },
  thumb: {
    width: horizontalScale(20),
    height: verticalScale(20),
    backgroundColor: colors.white,
    borderRadius: verticalScale(10),
    borderWidth: 2,
    borderColor: colors.violate,
  },
  currentValue: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.white,
    minWidth: horizontalScale(60),
    textAlign: 'center',
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(5),
    marginTop: verticalScale(8),
  },
  priceLabel: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(5),
    marginTop: verticalScale(8),
  },
  distanceLabel: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  dateButton: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: verticalScale(90),
    backgroundColor: 'transparent',
    marginRight: horizontalScale(12),
    borderWidth: 1,
    borderColor: colors.violate,
  },
  dateButtonSelected: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
  },
  dateButtonDayText: {
    fontSize: fontScale(10),
    fontFamily: fonts.light,
    color: colors.white,
    fontWeight: '300',
    alignSelf: 'center',
  },
  dateButtonDateText: {
    fontSize: fontScale(14),
    fontFamily: fonts.light,
    color: colors.white,
    fontWeight: '500',
    alignSelf: 'center',
  },

  dateButtonTextSelected: {
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(12),
    maxHeight: verticalScale(300),
    width: horizontalScale(280),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  dropdownList: {
    maxHeight: verticalScale(300),
  },
  locationItem: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.purpleBorder,
  },
  locationItemSelected: {
    backgroundColor: colors.violate,
  },
  locationItemText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  locationItemTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  rangeSliderContainer: {
    marginVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(10),
  },
  rangeSliderTrack: {
    height: verticalScale(40),
    position: 'relative',
    justifyContent: 'center',
  },
  rangeSliderRail: {
    height: verticalScale(4),
    backgroundColor: colors.white,
    borderRadius: verticalScale(2),
    width: '100%',
  },
  rangeSliderActiveTrack: {
    position: 'absolute',
    height: verticalScale(4),
    backgroundColor: colors.violate,
    borderRadius: verticalScale(2),
    top: verticalScale(18),
  },
  rangeSliderThumb: {
    position: 'absolute',
    width: horizontalScale(24),
    height: verticalScale(24),
    backgroundColor: colors.white,
    borderRadius: verticalScale(12),
    borderWidth: 3,
    borderColor: colors.violate,
    top: verticalScale(8),
    shadowColor: colors.violate,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rangeSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(5),
    marginTop: verticalScale(8),
  },
  rangeSliderLabel: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    height: verticalScale(50),
    width: horizontalScale(335),
    borderRadius: verticalScale(90),
    borderWidth: 1,
    borderColor: colors.violate,
    justifyContent: 'space-between',
  },
  locationText: {
    color: colors.white,  
    fontSize: fontScale(14),
    fontWeight: '500',
    marginRight: horizontalScale(6),
  },
});
