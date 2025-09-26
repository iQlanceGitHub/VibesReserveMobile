import { StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import {
  verticalScale,
  horizontalScale,
  fontScale,
} from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";

export const styles = StyleSheet.create({
  container: {
    height: verticalScale(336),
    borderRadius: horizontalScale(20),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.violate,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
    width: "91%",
    paddingTop: verticalScale(25),
  },
  monthYearText: {
    fontSize: fontScale(24),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: horizontalScale(8),
  },
  navButton: {
    width: horizontalScale(28),
    height: verticalScale(28),
    justifyContent: "center",
    alignItems: "center",
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(8),
    width: "100%",
  },
  dayOfWeekText: {
    fontSize: fontScale(10.39),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: "center",
  },
  calendarContainer: {
    flexDirection: "column",
    width: "100%",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    height: verticalScale(41.55038833618164),
    width: horizontalScale(42.910667419433594),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayText: {
    fontSize: fontScale(13.85),
    color: colors.white,
    fontWeight: "500",
    fontFamily: fonts.Medium,
  },
  rangeDay: {
    backgroundColor: colors.white,
    borderRadius: 0,
    marginHorizontal: 0,
  },
  rangeDayText: {
    color: colors.cardBackground,
    fontWeight: "500",
    fontFamily: fonts.Medium,
    fontSize: fontScale(13.85),
  },
  selectedDay: {
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(16),
    width: horizontalScale(42.910667419433594),
    height: verticalScale(41.55038833618164),
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: "500",
    fontFamily: fonts.Medium,
    fontSize: fontScale(13.85),
  },
  // Capsule styling for date range
  startDateCapsule: {
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(16),
    width: horizontalScale(42.910667419433594),
    height: verticalScale(41.55038833618164),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 0,
  },
  endDateCapsule: {
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(16),
    width: horizontalScale(42.910667419433594),
    height: verticalScale(41.55038833618164),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: 0,
  },
  middleDateCapsule: {
    backgroundColor: colors.white,
    borderRadius: 0,
    width: horizontalScale(42.910667419433594),
    height: verticalScale(41.55038833618164),
    marginVertical: 0,
    marginHorizontal: 0,
  },
  todayDay: {
    // No special background for today
  },
  todayDayText: {
    color: colors.white,
    fontWeight: "500",
    fontFamily: fonts.Medium,
    fontSize: fontScale(13.85),
  },
  // Disabled date styling
  disabledDayText: {
    color: colors.disabledDayText,
    textDecorationLine: "line-through",
    fontWeight: "500",
    fontFamily: fonts.Medium,
    fontSize: fontScale(13.85),
  },
  // Booked date styling
  bookedDay: {
    backgroundColor: colors.red || "#FF6B6B",
    borderRadius: horizontalScale(16),
    opacity: 0.6,
  },
  bookedDayText: {
    color: colors.white,
    fontWeight: "500",
    fontFamily: fonts.Medium,
    fontSize: fontScale(13.85),
  },
});
