import { StyleSheet } from "react-native";
import { colors } from "../../utilis/colors";
import { fonts } from "../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../utilis/appConstant";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fonts.bold,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  eventsContent: {
    paddingBottom: verticalScale(20),
  },
  eventCard: {
    backgroundColor: colors.backgroundColor,
    borderRadius: horizontalScale(16),
    marginBottom: verticalScale(16),
    padding: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImageContainer: {
    position: 'relative',
    marginRight: horizontalScale(16),
  },
  eventImage: {
    width: horizontalScale(80),
    height: verticalScale(80),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.violate20,
  },
  favoriteButton: {
    position: 'absolute',
    top: -verticalScale(4),
    left: -horizontalScale(4),
    zIndex: 1,
  },
  favoriteIcon: {
    width: horizontalScale(24),
    height: verticalScale(24),
    borderRadius: horizontalScale(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.violate,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIconText: {
    fontSize: fontScale(12),
    color: colors.violate,
    fontWeight: 'bold',
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventTypeContainer: {
    alignSelf: 'flex-start',
    marginBottom: verticalScale(4),
  },
  eventType: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: colors.violate,
    backgroundColor: colors.violate20,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
    overflow: 'hidden',
  },
  eventName: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(6),
    fontWeight: '600',
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  locationIcon: {
    fontSize: fontScale(12),
    marginRight: horizontalScale(6),
  },
  timeIcon: {
    fontSize: fontScale(12),
    marginRight: horizontalScale(6),
  },
  eventLocation: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.violate,
    flex: 1,
  },
  eventDateTime: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.violate,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  eventPrice: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    fontWeight: '600',
  },
  arrowButton: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: colors.violate,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: fontScale(16),
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
    paddingHorizontal: horizontalScale(40),
  },
  emptyScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(40),
  },
  emptyTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  subTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(10),
    paddingHorizontal: horizontalScale(30),
  },
  emptySubtitle: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: fontScale(20),
  },
});
