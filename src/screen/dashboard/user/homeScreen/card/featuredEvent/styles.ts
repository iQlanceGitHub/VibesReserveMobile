import { StyleSheet } from "react-native";
import * as appConstant from "../../../../../../utilis/appConstant";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";
import StarRating from "../../../../../../components/StarRating";

export default StyleSheet.create({
      card: {
        backgroundColor: colors.cardBackground,
        borderRadius: horizontalScale(20),
        overflow: 'hidden',
        marginRight: verticalScale(10),
        marginVertical: verticalScale(8),
        shadowColor: colors.BtnBackground,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: colors.BtnBackground,
        width: horizontalScale(280),
      },
      imageContainer: {
        position: 'relative',
        width: '100%',
        padding: horizontalScale(8), 
      },
      eventImage: {
        width: '100%',
        height: verticalScale(180),
        borderRadius: horizontalScale(16),
      },
      favoriteButton: {
        position: 'absolute',
        top: verticalScale(16),
        left: horizontalScale(16),
        zIndex: 1,
      },
      heartIconContainer: {
        backgroundColor: colors.BtnBackground,
        borderRadius: horizontalScale(20),
        width: horizontalScale(40),
        height: horizontalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
      },
      tagContainer: {
        position: 'absolute',
        top: verticalScale(16),
        right: horizontalScale(16),
        backgroundColor: colors.BtnBackground,
        borderRadius: horizontalScale(12),
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
      },
      tagText: {
        fontSize: fontScale(12),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.white,
      },
      content: {
        paddingHorizontal: horizontalScale(16),
        paddingBottom: verticalScale(12),
      },
      title: {
        fontSize: fontScale(16),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.primary_lighter,
        marginBottom: verticalScale(6),
        lineHeight: fontScale(24),
      },
      StarRating: {
        fontSize: fontScale(10),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.primary_lighter,
        marginBottom: verticalScale(6),
        lineHeight: fontScale(24),
      },
      detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(8),
      },
      locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: horizontalScale(8),
      },
      dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      detailText: {
        fontSize: fontScale(10),
        fontWeight: '400',
        fontFamily: fonts.regular,
        color: colors.primary_lighter,
        marginLeft: horizontalScale(8),
        lineHeight: fontScale(14),
        //flex: 1,
      },
      ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: horizontalScale(16),
      },
      rating: {
        fontSize: fontScale(14),
        fontWeight: '600',
        fontFamily: fonts.semiBold,
        color: colors.white,
        marginLeft: horizontalScale(4),
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: verticalScale(12),
        marginTop: verticalScale(8),
      },
      price: {
        fontSize: fontScale(20),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.primary_lighter,
        marginBottom: horizontalScale(10)
      },
      bookButton: {
        backgroundColor: colors.BtnBackground,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        borderRadius: horizontalScale(20),
        shadowColor: colors.BtnBackground,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        width: horizontalScale(180),
        height: verticalScale(40),
        marginBottom: horizontalScale(8)
      },
      bookButtonText: {
        fontSize: fontScale(14),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.white,
      },
});