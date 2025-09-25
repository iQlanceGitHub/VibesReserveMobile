import { Platform, StyleSheet } from "react-native";
import * as appConstant from "../../../../../../utilis/appConstant";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";

export default StyleSheet.create({
 
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    width: horizontalScale(334),
    height: Platform.OS === 'ios' ? verticalScale(130) : verticalScale(140),
    borderRadius: horizontalScale(16),
    alignSelf: 'center',
    marginBottom: verticalScale(12),
    padding: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.BtnBackground,
    shadowColor: colors.BtnBackground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    position: "relative",
    marginRight: horizontalScale(12),
    width: horizontalScale(120),
    height: verticalScale(88),
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: horizontalScale(12),
  },
  favoriteButton: {
    position: "absolute",
    top: verticalScale(8),
    left: horizontalScale(8),
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(4),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryTag: {
    position: "absolute",
    top: verticalScale(0),
    backgroundColor: colors.cardBackground,
    borderRadius: horizontalScale(12),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
    borderColor: colors.BtnBackground,
  },
  categoryText: {
    fontSize: fontScale(10),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  priceText: {
    position: "absolute",
    top: verticalScale(0),
    right: horizontalScale(0),
    fontSize: fontScale(16),
    fontWeight: "800",
    fontFamily: fonts.bold,
    color: colors.white,
  },
  eventName: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(8),
    marginTop: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(25), 
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
    flex: 1,
  },
  actionButton: {
    position: "absolute",
    bottom: verticalScale(0),
    right: verticalScale(0),
    width: horizontalScale(24),
    height: verticalScale(24),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.BtnBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.BtnBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});