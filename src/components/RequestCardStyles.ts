import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    width: horizontalScale(334),
    height: verticalScale(200),
    borderRadius: verticalScale(16),
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(15),
    padding: verticalScale(16),
    borderWidth: verticalScale(1),
    borderColor: colors.purpleBorder,
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: verticalScale(0),
      height: verticalScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: verticalScale(8),
    elevation: verticalScale(4),
  },
  lastCardContainer: {
    marginBottom: verticalScale(55),
  },
  profileContainer: {
    marginRight: horizontalScale(12),
  },
  profileImageContainer: {
    width: horizontalScale(74),
    height: verticalScale(74),
    borderRadius: verticalScale(90),
    borderWidth: verticalScale(2),
    borderColor: colors.profileImageBorder,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: verticalScale(1),
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryTag: {
    backgroundColor: colors.categoryBackground,
    height: verticalScale(20),
    borderRadius: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(12),
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: fontScale(8),
    fontWeight: "400",
    lineHeight: fontScale(16),
    fontFamily: fonts.regular,
    color: colors.white,
  },
  nameText: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(5),
  },
  detailsContainer: {
    marginBottom: verticalScale(10),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },
  peoplePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  peopleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: fontScale(10),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteLight,
    marginLeft: horizontalScale(5),
  },
  priceText: {
    fontSize: fontScale(14),
    fontWeight: "800",
    fontFamily: fonts.ExtraBold,
    color: colors.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  acceptButton: {
    backgroundColor: colors.BtnBackground,
    height: verticalScale(26),
    borderRadius: verticalScale(90),
    alignItems: "center",
    justifyContent: "center",
    width: horizontalScale(82),
  },
  acceptButtonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.SemiBold,
    color: colors.white,
    lineHeight: fontScale(14),
    fontWeight: "500",
    marginHorizontal: horizontalScale(10),
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: colors.red,
    height: verticalScale(26),
    borderRadius: verticalScale(90),
    alignItems: "center",
    justifyContent: "center",
    width: horizontalScale(82),
  },
  rejectButtonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.SemiBold,
    color: colors.red,
    lineHeight: fontScale(14),
    fontWeight: "500",
    marginHorizontal: horizontalScale(10),
  },
});

export default styles;
