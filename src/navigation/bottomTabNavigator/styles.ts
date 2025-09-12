import { StyleSheet } from "react-native";
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
    shadowColor: colors.primary_pinkLight,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  selectedIconWrapper: {
    // backgroundColor: colors.violate,
    borderRadius: 20,
  },
  selectedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.violate,
    marginTop: 2,
  },
});
