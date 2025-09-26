import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateRangePicker from "../../../../../../components/DateRangePicker";
import { colors } from "../../../../../../utilis/colors";
import { BackButton } from "../../../../../../components/BackButton";
import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
import CalendarIconViolet from "../../../../../../assets/svg/CalendarIconViolet";
import MinusSVG from "../../../../../../assets/svg/MinusSVG";
import PlusSVG from "../../../../../../assets/svg/PlusSVG";
import clubBookingStyles from "./styles";

const ClubBookingScreen: React.FC = () => {
  const navigation = useNavigation();

  const bookingData = {
    startDate: "2025-09-01T00:00:00.000Z",
    endDate: "2025-09-30T00:00:00.000Z",
    bookedDates: [
      "2025-09-22T00:00:00.000Z",
      "2025-09-24T00:00:00.000Z",
      "2025-09-21T00:00:00.000Z",
    ],
  };

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    new Date(2025, 7, 3)
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    new Date(2025, 7, 6)
  );
  const [memberCount, setMemberCount] = useState(4);

  const handleDateRangeSelect = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log("Selected date range:", { startDate, endDate });
  };

  const formatSelectedDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      const startMonth = selectedStartDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = selectedStartDate.getDate().toString().padStart(2, "0");
      const endDay = selectedEndDate.getDate().toString().padStart(2, "0");
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return "Aug 03 - 06";
  };

  const handleMemberCountChange = (increment: boolean) => {
    if (increment) {
      setMemberCount((prev) => Math.min(prev + 1, 10));
    } else {
      setMemberCount((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleNextPress = () => {
    navigation.navigate("ClubDetailScreen" as never);
  };

  return (
    <SafeAreaView style={clubBookingStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.gradient_dark_purple}
      />

      <View style={clubBookingStyles.header}>
        <BackButton navigation={navigation} />
        <Text style={clubBookingStyles.headerTitle}>Select Date</Text>
        <View style={clubBookingStyles.placeholder} />
      </View>

      <View style={clubBookingStyles.locationContainer}>
        <View style={clubBookingStyles.locationLeft}>
          <LocationFavourite width={16} height={16} />
          <Text style={clubBookingStyles.locationText}>Bartonfort, Canada</Text>
        </View>
        <View style={clubBookingStyles.dateDisplay}>
          <CalendarIconViolet width={16} height={16} />
          <Text style={clubBookingStyles.dateText}>
            {formatSelectedDateRange()}
          </Text>
        </View>
      </View>

      <View style={clubBookingStyles.calendarContainer}>
        <DateRangePicker
          onDateRangeSelect={handleDateRangeSelect}
          initialStartDate={selectedStartDate || undefined}
          initialEndDate={selectedEndDate || undefined}
          startDate={bookingData.startDate}
          endDate={bookingData.endDate}
          bookedDates={bookingData.bookedDates}
        />
      </View>

      <View style={clubBookingStyles.memberSection}>
        <Text style={clubBookingStyles.memberTitle}>Add Member</Text>
        <View style={clubBookingStyles.memberRow}>
          <View style={clubBookingStyles.memberInfo}>
            <Text style={clubBookingStyles.memberLabel}>Member</Text>
            <Text style={clubBookingStyles.memberAge}>
              Ages 18 years and above
            </Text>
          </View>
          <View style={clubBookingStyles.memberCounter}>
            <TouchableOpacity onPress={() => handleMemberCountChange(false)}>
              <MinusSVG />
            </TouchableOpacity>
            <Text style={clubBookingStyles.memberCount}>{memberCount}</Text>
            <TouchableOpacity onPress={() => handleMemberCountChange(true)}>
              <PlusSVG />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={clubBookingStyles.nextButtonContainer}>
        <TouchableOpacity
          style={clubBookingStyles.nextButton}
          onPress={handleNextPress}
        >
          <Text style={clubBookingStyles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClubBookingScreen;
