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
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 0.5,
        borderColor: colors.violate
      },
      imageContainer: {
        position: 'relative',
        width: '100%',
        padding: horizontalScale(10), 
      },
      eventImage: {
        width: horizontalScale(270),
        height: verticalScale(160),
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
        justifyContent: 'space-between'
      },
      detailText: {
        fontSize: fontScale(10),
        fontWeight: '400',
        fontFamily: fonts.regular,
        color: colors.primary_lighter,
        marginLeft: horizontalScale(8),
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
        paddingTop: verticalScale(16),
      },
      price: {
        fontSize: fontScale(20),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.primary_lighter,
        marginBottom: horizontalScale(10)
      },
      bookButton: {
        //270.35
        backgroundColor: colors.BtnBackground,
        textAlign:'center',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        borderRadius: horizontalScale(16),
        shadowColor: colors.BtnBackground,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        width: horizontalScale(170),
        height: verticalScale(35),
        marginBottom: horizontalScale(10)
      },
      bookButtonText: {
        fontSize: fontScale(14),
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.white,
      },
});