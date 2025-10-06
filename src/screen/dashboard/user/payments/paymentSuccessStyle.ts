import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../../utilis/appConstant";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  statusBar: {
    height: Platform.OS === "ios" ? verticalScale(44) : verticalScale(24),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(40),
  },
  topContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(40),
    width: Platform.OS === "ios" ? 164 : horizontalScale(164),
    height: Platform.OS === "ios" ? 164 : horizontalScale(164),
    borderRadius: Platform.OS === "ios" ? 82 : horizontalScale(82),
    backgroundColor: colors.purpleTransparent10,
  },
  congratulationsText: {
    fontSize: fontScale(24),
    fontWeight: "600",
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: fontScale(38),
  },
  successMessage: {
    fontSize: fontScale(14),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.textColor,
    textAlign: "center",
    marginBottom: verticalScale(8),
    lineHeight: fontScale(24),
    opacity: 0.9,
  },
  buttonContainer: {
    width: Platform.OS === "ios" ? "100%" : horizontalScale(335),
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  secondaryButton: {
    width: horizontalScale(335),
    height: verticalScale(50),
    backgroundColor: "transparent",
    borderRadius: verticalScale(99),
    borderWidth: 1,
    borderColor: colors.violate,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.violate,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  secondaryButtonText: {
    fontSize: fontScale(18),
    fontFamily: fonts.SemiBold,
    color: colors.violate,
    textAlign: "center",
  },
});
