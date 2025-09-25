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
  headerSpacer: {
    width: horizontalScale(44),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
    alignItems: "center",
  },
  eventCard: {
    width: "100%",
    minHeight: verticalScale(140),
    marginBottom: verticalScale(10),
    borderRadius: horizontalScale(16),
    overflow: "hidden",
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: Platform.OS === "ios" ? 2 : 4,
    },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 8 : 4,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  cardGradient: {
    width: "100%",
    minHeight: verticalScale(140),
    borderRadius: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  cardContent: {
    flexDirection: "row",
    paddingTop: verticalScale(16),
    paddingRight: horizontalScale(16),
    paddingBottom: verticalScale(16),
    paddingLeft: horizontalScale(10),
    width: "100%",
    minHeight: verticalScale(140),
  },
  imageContainer: {
    marginRight: horizontalScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    width: horizontalScale(120),
    height: verticalScale(115),
    borderRadius: horizontalScale(12),
    resizeMode: "cover",
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? verticalScale(2) : verticalScale(4),
    paddingBottom: Platform.OS === "ios" ? verticalScale(2) : verticalScale(4),
    paddingRight: horizontalScale(4),
    minHeight: Platform.OS === "ios" ? verticalScale(90) : verticalScale(100),
  },
  topContent: {
    flex: 1,
    justifyContent: "flex-start",
    minHeight: 0,
    flexShrink: 1,
  },
  categoryContainer: {
    paddingBottom: verticalScale(4),
  },
  categoryTag: {
    backgroundColor: colors.categoryBackground,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  eventName: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(1),
    lineHeight: fontScale(16),
  },
  eventDescription: {
    fontSize: fontScale(10),
    fontWeight: "300",
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: fontScale(13),
    marginBottom: Platform.OS === "ios" ? verticalScale(2) : verticalScale(4),
    flex: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: colors.white,
    marginLeft: horizontalScale(6),
  },
});

export default styles;
