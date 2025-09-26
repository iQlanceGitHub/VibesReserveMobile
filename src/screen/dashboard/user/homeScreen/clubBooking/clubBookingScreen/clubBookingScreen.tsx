import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateRangePicker from "../../../../../../components/DateRangePicker";
import { colors } from "../../../../../../utilis/colors";
import { BackButton } from "../../../../../../components/BackButton";
import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
import CalendarIconViolet from "../../../../../../assets/svg/CalendarIconViolet";
import MinusSVG from "../../../../../../assets/svg/MinusSVG";
import PlusSVG from "../../../../../../assets/svg/PlusSVG";
import clubBookingStyles from "./styles";
import { verticalScale } from "../../../../../../utilis/appConstant";

const ClubBookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get event data from route params
  const { eventData } = (route.params as any) || {};
  
  // Initialize with event data or fallback to current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Use event dates if available, otherwise use current month
  const eventStartDate = eventData?.startDate ? new Date(eventData.startDate) : new Date();
  const eventEndDate = eventData?.endDate ? new Date(eventData.endDate) : new Date();
  
  const bookingData = {
    startDate: eventData?.startDate || "2025-09-01T00:00:00.000Z",
    endDate: eventData?.endDate || "2025-09-30T00:00:00.000Z",
    bookedDates: [
      "2025-09-21T00:00:00.000Z",
      "2025-09-22T00:00:00.000Z",
      "2025-09-24T00:00:00.000Z",
    ],
  };

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    eventData?.startDate ? eventStartDate : new Date(2025, 8, 11) // September 11, 2025
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    eventData?.endDate ? eventEndDate : new Date(2025, 8, 27) // September 27, 2025
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
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const currentDay = currentDate.getDate().toString().padStart(2, "0");
    return `${currentMonth} ${currentDay} - ${currentDay}`;
  };

  const handleMemberCountChange = (increment: boolean) => {
    if (increment) {
      setMemberCount((prev) => Math.min(prev + 1, 10));
    } else {
      setMemberCount((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleNextPress = () => {
    // Prepare booking data to pass to next screen
    const bookingData = {
      eventData: eventData,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
      memberCount: memberCount,
      bookingDetails: {
        eventName: eventData?.name || "Event",
        eventAddress: eventData?.address || "Address not available",
        eventPrice: eventData?.entryFee || 0,
        eventTime: eventData?.openingTime || "10:00",
        eventDate: selectedStartDate ? selectedStartDate.toISOString() : new Date().toISOString(),
        memberCount: memberCount,
        totalPrice: (eventData?.entryFee || 0) * memberCount,
      }
    };
    
    console.log("Booking data:", bookingData);
    (navigation as any).navigate("ClubDetailScreen", bookingData);
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
          <Text style={clubBookingStyles.locationText}>
            {eventData?.address || "Bartonfort, Canada"}
          </Text>
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
        <View style={{marginBottom: verticalScale(50)}}></View>
      </View>
     
    </SafeAreaView>
  );
};

export default ClubBookingScreen;
