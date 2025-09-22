import { StyleSheet } from "react-native";
import * as appConstant from "../../../utilis/appConstant";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";

export default StyleSheet.create({
    container: {
        flex: 1,
        width: appConstant.horizontalScale(375),
        height: appConstant.verticalScale(812),
      },
      contentContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      title: {
        fontSize: appConstant.fontScale(28),
        fontWeight: '700',
        color: colors.violate,
        marginBottom: appConstant.verticalScale(16),
        textAlign: 'center',
      },
      carouselContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      carouselItem: {
        alignItems: 'center',
        top: appConstant.horizontalScale(50),
    
      },
      
      titleText: {
        fontSize: appConstant.fontScale(26),
      //  marginBottom: appConstant.verticalScale(9),
        fontFamily: fonts.BlackerBold,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop:  appConstant.verticalScale(60),
        fontWeight: 500,
        lineHeight: appConstant.fontScale(24),
        width: appConstant.fontScale(335),
        height: appConstant.fontScale(68),
      },
      discriptionText: {
        fontSize: appConstant.fontScale(16),
        //marginBottom: appConstant.verticalScale(28),
        fontFamily: fonts.Bold,
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        color: colors.fontgary,
        fontWeight: 400,
        lineHeight: appConstant.fontScale(24),
        width: appConstant.fontScale(281),
       // height: appConstant.fontScale(72),
    
      },
      buttonsContainer: {
        width: appConstant.verticalScale(375),
        marginBottom: appConstant.fontScale(28),
        alignSelf: 'center',
      },
    
      signUpBtn: {
        backgroundColor: colors.violate,
      },
      loginBtn: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.violate,
      },
      btn: {
        backgroundColor: colors.violate,
        width: appConstant.verticalScale(315),
        height: appConstant.horizontalScale(52),
        marginBottom: appConstant.verticalScale(15),
      },
      btnText: {
        color: colors.white,
        fontSize: appConstant.fontScale(16),
        lineHeight: appConstant.fontScale(22),
      },
      loginText: {
        color: colors.violate,
      },
      
      paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      paginationDot: {
        width: appConstant.horizontalScale(8),
        height: appConstant.horizontalScale(10),
        borderRadius: 12,
        marginLeft: appConstant.horizontalScale(8),
        marginBottom: appConstant.verticalScale(16),
        marginTop:appConstant.verticalScale(16),
      },
});
