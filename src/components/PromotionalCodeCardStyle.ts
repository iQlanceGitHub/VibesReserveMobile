import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

export const styles = StyleSheet.create({
  cardContainer: {
    width: horizontalScale(336),
    height: verticalScale(108),
    marginBottom: verticalScale(15),
    borderRadius: horizontalScale(16),
    overflow: "hidden",
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    width: horizontalScale(335),
    height: verticalScale(108),
    borderRadius: horizontalScale(16),
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
  },
  cardContent: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(14),
    paddingTop: verticalScale(19),
    paddingBottom: verticalScale(19),
    height: verticalScale(90),
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: horizontalScale(10),
  },
  codeText: {
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  descriptionText: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    fontWeight: "400",
    color: colors.textcolor,
    lineHeight: fontScale(18),
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: horizontalScale(4),
    marginLeft: horizontalScale(8),
  },
});
