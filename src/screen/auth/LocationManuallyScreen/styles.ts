import { StyleSheet } from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import * as appConstant from "../../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: appConstant.verticalScale(20),
  },
  customInput: {
    marginBottom: appConstant.verticalScale(12),
  },
  header: {
    paddingHorizontal: appConstant.horizontalScale(20),
    paddingBottom: appConstant.verticalScale(20),
  },
  content: {
    flex: 1,
    paddingHorizontal: appConstant.horizontalScale(20),
  },
  title: {
    fontSize: appConstant.fontScale(32),
    fontFamily: fonts.BlackerBold,
    fontWeight: "700",
    color: colors.white,
    marginBottom: appConstant.verticalScale(30),
    lineHeight: appConstant.fontScale(38),
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appConstant.verticalScale(30),
    paddingVertical: appConstant.verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.disableGray,
    
  },
  currentLocationText: {
    fontSize: appConstant.fontScale(16),
    fontFamily: fonts.Regular,
    color: colors.white,
    marginLeft: appConstant.horizontalScale(12),
  },
  resultsContainer: {
    marginBottom: appConstant.verticalScale(20),
  },
  resultsTitle: {
    fontSize: appConstant.fontScale(14),
    fontFamily: fonts.Bold,
    color: colors.lightGray,
    marginBottom: appConstant.verticalScale(12),
    letterSpacing: appConstant.horizontalScale(1),
  },
  resultItem: {
    paddingVertical: appConstant.verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.disableGray,
  },
  resultName: {
    fontSize: appConstant.fontScale(16),
    fontFamily: fonts.semiBold,
    color: colors.white,
    marginBottom: appConstant.verticalScale(4),
    marginTop: appConstant.verticalScale(6),
  },
  resultAddress: {
    fontSize: appConstant.fontScale(14),
    fontFamily: fonts.Regular,
    color: colors.lightGray,
  },
  keyboardContainer: {
    backgroundColor: colors.keyboardBackground,
    padding: appConstant.horizontalScale(10),
    borderTopLeftRadius: appConstant.horizontalScale(16),
    borderTopRightRadius: appConstant.horizontalScale(16),
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: appConstant.verticalScale(8),
  },
  keyButton: {
    backgroundColor: colors.white,
    borderRadius: appConstant.horizontalScale(6),
    padding: appConstant.horizontalScale(10),
    margin: appConstant.horizontalScale(3),
    minWidth: appConstant.horizontalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: appConstant.fontScale(16),
    fontFamily: fonts.semiBold,
    color: colors.violate,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: appConstant.verticalScale(8),
  },
  specialKey: {
    backgroundColor: colors.lightGray,
    borderRadius: appConstant.horizontalScale(6),
    padding: appConstant.horizontalScale(12),
    minWidth: appConstant.horizontalScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceKey: {
    backgroundColor: colors.white,
    borderRadius: appConstant.horizontalScale(6),
    padding: appConstant.horizontalScale(12),
    flex: 1,
    marginHorizontal: appConstant.horizontalScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});