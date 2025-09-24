import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../../utilis/colors";
import { fonts } from "../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../utilis/appConstant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(Platform.OS === "ios" ? 10 : 20),
    paddingBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: "center",
    flex: 1,
  },
  addButton: {
    width: horizontalScale(44),
    height: verticalScale(44),
    borderRadius: horizontalScale(22),
    backgroundColor: colors.addButtonBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
  },
  firstCardContainer: {
    marginTop: verticalScale(20),
  },
});

export default styles;
