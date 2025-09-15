import { Platform, StyleSheet } from "react-native";
import * as appConstant from "../../utilis/appConstant";
import { colors } from "../../utilis/colors";

export default StyleSheet.create({
  mainContainerTab: {
    width: appConstant.horizontalScale(375),
    height: appConstant.verticalScale(94),
    position: "absolute",
    bottom: appConstant.verticalScale(5),
   // backgroundColor: colors.primary_blue
  },
  mainContainer: {
    width: appConstant.horizontalScale(334),
    height: appConstant.verticalScale(58),
    backgroundColor: colors.bottomTabBackground,
    borderRadius: appConstant.verticalScale(90),
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: appConstant.verticalScale(30),
    shadowColor: Platform.OS === "ios" ? colors.primary_pinkLight: '',
    shadowOffset: {
      width: appConstant.horizontalScale(2),
      height: appConstant.verticalScale(1),
    },
    shadowOpacity: 0.25,
    shadowRadius: 7.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.gray20,
    opacity: 1,
  },
  bottomTabContainer: {
    width: appConstant.horizontalScale(310),
    height: appConstant.verticalScale(48),
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: appConstant.horizontalScale(8),
  },
  tabIconContainer: {
    width: appConstant.horizontalScale(62),
    height: appConstant.verticalScale(48),
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: appConstant.horizontalScale(40),
    height: appConstant.verticalScale(40),
    borderRadius: appConstant.horizontalScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: appConstant.horizontalScale(4),
  },
  selectedIconWrapper: {
    // backgroundColor: colors.violate,
    //borderRadius: appConstant.horizontalScale(20),
  },
  selectedIndicator: {
    width: appConstant.horizontalScale(6),
    height: appConstant.verticalScale(6),
    borderRadius: appConstant.horizontalScale(3),
    backgroundColor: colors.violate,
    marginTop: appConstant.horizontalScale(2),
  },
});
