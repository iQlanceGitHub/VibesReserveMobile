import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../utilis/colors";
import ArrowLeft from "../assets/svg/ArrowLeft";
import ArrowRight from "../assets/svg/ArrowRight";
import { styles } from "./daterangepickerstyle";

interface DateRangePickerProps {
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  startDate?: string;
  endDate?: string;
  bookedDates?: string[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeSelect,
  initialStartDate,
  initialEndDate,
  startDate,
  endDate,
  bookedDates = [],
}) => {
  // Initialize calendar to show the month of the selected start date
  const [currentDate, setCurrentDate] = useState(() => {
    if (defaultStartDate) {
      return new Date(defaultStartDate.getFullYear(), defaultStartDate.getMonth(), 1);
    }
    return new Date(2025, 8, 1); // September 2025 as fallback
  });
  const defaultStartDate = initialStartDate || new Date(2025, 7, 3);
  const defaultEndDate = initialEndDate || new Date(2025, 7, 6);

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    defaultStartDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    defaultEndDate
  );

  const screenWidth = Dimensions.get("window").width;
  const calendarWidth = screenWidth - 40;
  const dayWidth = calendarWidth / 7;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStartDate && !selectedEndDate) return false;
    return (
      (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
      (selectedEndDate && date.getTime() === selectedEndDate.getTime())
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateInAllowedRange = (date: Date) => {
    if (!startDate || !endDate) return true;

    const allowedStartDate = new Date(startDate);
    const allowedEndDate = new Date(endDate);
    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const start = new Date(
      allowedStartDate.getFullYear(),
      allowedStartDate.getMonth(),
      allowedStartDate.getDate()
    );
    const end = new Date(
      allowedEndDate.getFullYear(),
      allowedEndDate.getMonth(),
      allowedEndDate.getDate()
    );

    return dateToCheck >= start && dateToCheck <= end;
  };

  // Check if date is booked
  const isDateBooked = (date: Date) => {
    if (!bookedDates || bookedDates.length === 0) return false;

    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    return bookedDates.some((bookedDateStr) => {
      const bookedDate = new Date(bookedDateStr);
      const bookedDateOnly = new Date(
        bookedDate.getFullYear(),
        bookedDate.getMonth(),
        bookedDate.getDate()
      );
      return dateToCheck.getTime() === bookedDateOnly.getTime();
    });
  };

  // Check if booked date is start of consecutive sequence
  const isBookedStart = (date: Date) => {
    if (!isDateBooked(date)) return false;
    
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return !isDateBooked(nextDay);
  };

  // Check if booked date is end of consecutive sequence
  const isBookedEnd = (date: Date) => {
    if (!isDateBooked(date)) return false;
    
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    return !isDateBooked(prevDay);
  };

  // Check if booked date is middle of consecutive sequence
  const isBookedMiddle = (date: Date) => {
    if (!isDateBooked(date)) return false;
    
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    return isDateBooked(prevDay) && isDateBooked(nextDay);
  };

  // Check if booked date is within selected range
  const isBookedInRange = (date: Date) => {
    if (!isDateBooked(date) || !isDateInRange(date)) return false;
    return true;
  };

  // Check if booked date in range is start of consecutive sequence
  const isBookedInRangeStart = (date: Date) => {
    if (!isBookedInRange(date)) return false;
    
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return !isBookedInRange(nextDay);
  };

  // Check if booked date in range is end of consecutive sequence
  const isBookedInRangeEnd = (date: Date) => {
    if (!isBookedInRange(date)) return false;
    
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    return !isBookedInRange(prevDay);
  };

  // Check if booked date in range is middle of consecutive sequence
  const isBookedInRangeMiddle = (date: Date) => {
    if (!isBookedInRange(date)) return false;
    
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    return isBookedInRange(prevDay) && isBookedInRange(nextDay);
  };

  const isDateDisabled = (date: Date) => {
    return !isDateInAllowedRange(date) || isDateBooked(date);
  };

  const handleDatePress = (date: Date) => {
    if (isDateDisabled(date)) {
      return;
    }

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }

      if (onDateRangeSelect) {
        if (date < selectedStartDate) {
          onDateRangeSelect(date, selectedStartDate);
        } else {
          onDateRangeSelect(selectedStartDate, date);
        }
      }
    }
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const rows = [];

    for (let i = 0; i < days.length; i += 7) {
      const weekDays = days.slice(i, i + 7);
      rows.push(weekDays);
    }

    return rows.map((week, weekIndex) => (
      <View key={weekIndex} style={styles.weekRow}>
        {week.map((day, dayIndex) => {
          if (!day) {
            return (
              <View
                key={dayIndex}
                style={[styles.dayCell, styles.emptyCell]}
              />
            );
          }

          const isInRange = isDateInRange(day);
          const isSelected = isDateSelected(day);
          const isTodayDate = isToday(day);
          const isStartDate =
            selectedStartDate && day.getTime() === selectedStartDate.getTime();
          const isEndDate =
            selectedEndDate && day.getTime() === selectedEndDate.getTime();
          const isDisabled = isDateDisabled(day);
          const isBooked = isDateBooked(day);
          const isBookedStartDate = isBookedStart(day);
          const isBookedEndDate = isBookedEnd(day);
          const isBookedMiddleDate = isBookedMiddle(day);
          const isBookedInRangeDate = isBookedInRange(day);
          const isBookedInRangeStartDate = isBookedInRangeStart(day);
          const isBookedInRangeEndDate = isBookedInRangeEnd(day);
          const isBookedInRangeMiddleDate = isBookedInRangeMiddle(day);

          return (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.dayCell,
                isInRange && !isSelected && !isDisabled && styles.rangeDay,
                isSelected && styles.selectedDay,
                isTodayDate && !isSelected && !isDisabled && styles.todayDay,
                isStartDate && styles.startDateCapsule,
                isEndDate && styles.endDateCapsule,
                isInRange &&
                  !isSelected &&
                  !isStartDate &&
                  !isEndDate &&
                  !isDisabled &&
                  styles.middleDateCapsule,
                isDisabled && !isBooked,
                // Booked date styling with joined capsules
                // Priority: In-range booked dates (square) over out-of-range booked dates (round)
                isBookedInRangeDate && !isBookedInRangeStartDate && !isBookedInRangeEndDate && !isBookedInRangeMiddleDate && styles.bookedInRange,
                isBookedInRangeStartDate && styles.bookedInRangeStart,
                isBookedInRangeEndDate && styles.bookedInRangeEnd,
                isBookedInRangeMiddleDate && styles.bookedInRangeMiddle,
                // Out-of-range booked dates (round)
                isBooked && !isBookedInRangeDate && !isBookedStartDate && !isBookedEndDate && !isBookedMiddleDate && styles.bookedDay,
                isBooked && !isBookedInRangeDate && isBookedStartDate && styles.bookedStartCapsule,
                isBooked && !isBookedInRangeDate && isBookedEndDate && styles.bookedEndCapsule,
                isBooked && !isBookedInRangeDate && isBookedMiddleDate && styles.bookedMiddleCapsule,
              ]}
              onPress={() => handleDatePress(day)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.dayText,
                  isInRange &&
                    !isSelected &&
                    !isDisabled &&
                    styles.rangeDayText,
                  isSelected && styles.selectedDayText,
                  isTodayDate &&
                    !isSelected &&
                    !isDisabled &&
                    styles.todayDayText,
                  isDisabled && !isBooked && styles.disabledDayText,
                  isBooked && styles.bookedDayText,
                ]}
              >
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <LinearGradient
      colors={["#1F0045", "#120128"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.monthYearText}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth("prev")}
          >
            <ArrowLeft width={22} height={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth("next")}
          >
            <ArrowRight width={22} height={22} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarContainer}>{renderCalendar()}</View>
    </LinearGradient>
  );
};

export default DateRangePicker;
