import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(17),
  },
  greetingContainer: {
    flex: 1,
    paddingRight: horizontalScale(16),
  },
  greetingText: {
    fontSize: fontScale(24),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(7),
  },
  subtitleText: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    lineHeight: fontScale(20),
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.addButtonBackground,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.addButtonBackground,
    marginRight: horizontalScale(12),
  },
});

export default styles;
