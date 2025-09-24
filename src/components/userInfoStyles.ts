import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

export const userInfoStyles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(12),
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: horizontalScale(45.46),
    height: verticalScale(45.46),
    borderRadius: verticalScale(25),
    marginRight: horizontalScale(12),
    borderWidth: 2,
    borderColor: colors.violate,
  },
  userName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: horizontalScale(6),
  },
  actionButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.addButtonBackground,
    alignItems: "center",
    justifyContent: "center",
  },
});
