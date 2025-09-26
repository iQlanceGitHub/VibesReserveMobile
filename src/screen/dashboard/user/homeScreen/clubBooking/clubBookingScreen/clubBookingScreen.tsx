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
  
  // Debug: Log route params to see what's being passed
  console.log("ClubBookingScreen route.params:", route.params);
  console.log("ClubBookingScreen eventData:", eventData);
  
  // Fallback event data for testing (remove this when real data is working)
  const fallbackEventData = {
    "_id": "68d3b7123ecac02e1e4e3a6a",
    "type": "Event",
    "userId": {
      "_id": "68d3b31c3ecac02e1e4e3a17",
      "fullName": "Nilam",
      "email": "nilam@yopmail.com",
      "phone": "2042598551",
      "profilePicture": null
    },
    "name": "New my event",
    "details": "Hi theee test only",
    "entryFee": 690,
    "openingTime": "14:46",
    "closeTime": "14:46",
    "startDate": "2025-09-24T00:00:00.000Z",
    "endDate": "2025-09-26T00:00:00.000Z",
    "address": "Land, E2/80, Lucknow, Uttar Pradesh 226003, India",
    "coordinates": {
      "type": "Point",
      "coordinates": [26.885451, 80.859326]
    },
    "booths": [],
    "tickets": [
      {
        "ticketType": {
          "_id": "68b7dfc2241ce469fe7e2086",
          "name": "DJ Nights"
        },
        "ticketPrice": 500,
        "capacity": 67,
        "_id": "68d3b7123ecac02e1e4e3a6b"
      }
    ],
    "photos": [
      "https://shw-doc-app.s3.amazonaws.com/main_1758705400362_0.jpg",
      "https://shw-doc-app.s3.amazonaws.com/main_1758705401451_1.jpg",
      "https://shw-doc-app.s3.amazonaws.com/main_1758705401660_2.jpg"
    ],
    "facilities": [
      {
        "_id": "68b6e4dc2242405283b3554c",
        "name": "kukuykhjy"
      },
      {
        "_id": "68b6e4d72242405283b35545",
        "name": "rferfef"
      },
      {
        "_id": "68b6e43f2242405283b3550f",
        "name": "Welcome Drink"
      },
      {
        "_id": "68b583de6e30c338c5d1b202",
        "name": "testing122"
      },
      {
        "_id": "68b582acec67a0b7e3ad93af",
        "name": "testing12"
      },
      {
        "_id": "68b58296ec67a0b7e3ad93ac",
        "name": "testing1"
      },
      {
        "_id": "68b58290ec67a0b7e3ad93a9",
        "name": "testing"
      },
      {
        "_id": "68b58185ec67a0b7e3ad939f",
        "name": "Updated Category"
      },
      {
        "_id": "68b580414eaf375659d31007",
        "name": "Smoking Zone"
      },
      {
        "_id": "68b5800f4eaf375659d30ffb",
        "name": "VIP Area"
      }
    ],
    "status": "active",
    "isFeature": true,
    "createdAt": "2025-09-24T09:17:06.222Z",
    "updatedAt": "2025-09-24T12:46:12.496Z",
    "__v": 0,
    "isFavorite": true
  };
  
  // Use eventData if available, otherwise use fallback
  const currentEventData = eventData && Object.keys(eventData).length > 0 ? eventData : fallbackEventData;
  
  // Initialize with event data or fallback to current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Use event dates dynamically from currentEventData
  const eventStartDate = currentEventData?.startDate ? new Date(currentEventData.startDate) : new Date();
  const eventEndDate = currentEventData?.endDate ? new Date(currentEventData.endDate) : new Date();
  
  const bookingData = {
    startDate: currentEventData?.startDate || "2025-09-01T00:00:00.000Z",
    endDate: currentEventData?.endDate || "2025-09-30T00:00:00.000Z",
    bookedDates: [], // No booked dates for now, can be added later if needed
  };

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    currentEventData?.startDate ? eventStartDate : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    currentEventData?.endDate ? eventEndDate : null
  );
  const [memberCount, setMemberCount] = useState(1);

  // Get capacity from event data
  const maxCapacity = currentEventData?.tickets?.[0]?.capacity || 10;
  const ticketPrice = currentEventData?.tickets?.[0]?.ticketPrice || 0;
  const entryFee = currentEventData?.entryFee || 0;

  const handleDateRangeSelect = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log("Selected date range:", { startDate, endDate });
  };

  useEffect(
    () => {
      console.log("currentEventData", currentEventData);
    }, [currentEventData]
  );

  const formatSelectedDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      const startMonth = selectedStartDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = selectedStartDate.getDate().toString().padStart(2, "0");
      const endDay = selectedEndDate.getDate().toString().padStart(2, "0");
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    // If no dates selected, show event dates or default
    if (currentEventData?.startDate && currentEventData?.endDate) {
      const startDate = new Date(currentEventData.startDate);
      const endDate = new Date(currentEventData.endDate);
      const startMonth = startDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = startDate.getDate().toString().padStart(2, "0");
      const endDay = endDate.getDate().toString().padStart(2, "0");
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return "Select dates";
  };

  const handleMemberCountChange = (increment: boolean) => {
    if (increment) {
      setMemberCount((prev) => Math.min(prev + 1, maxCapacity));
    } else {
      setMemberCount((prev) => Math.max(prev - 1, 1));
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const totalTicketPrice = ticketPrice * memberCount;
    const totalEntryFee = entryFee * memberCount;
    return totalTicketPrice + totalEntryFee;
  };

  const handleNextPress = () => {
    // Prepare booking data to pass to next screen
    const totalPrice = calculateTotalPrice();
    const bookingData = {
      eventData: currentEventData,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
      memberCount: memberCount,
      maxCapacity: maxCapacity,
      ticketPrice: ticketPrice,
      entryFee: entryFee,
      totalPrice: totalPrice,
      bookingDetails: {
        eventName: currentEventData?.name || "Event",
        eventAddress: currentEventData?.address || "Address not available",
        eventPrice: entryFee,
        ticketPrice: ticketPrice,
        eventTime: currentEventData?.openingTime || "10:00",
        eventDate: selectedStartDate ? selectedStartDate.toISOString() : new Date().toISOString(),
        memberCount: memberCount,
        totalPrice: totalPrice,
        maxCapacity: maxCapacity,
      }
    };
    
    console.log("Booking data:", bookingData);
    (navigation as any).navigate("PaymentScreen", bookingData);
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
              {currentEventData?.address || "Address not available"}
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
          initialStartDate={selectedStartDate || eventStartDate}
          initialEndDate={selectedEndDate || eventEndDate}
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
            <Text style={clubBookingStyles.capacityText}>
              Max capacity: {maxCapacity} members
            </Text>
          </View>
          <View style={clubBookingStyles.memberCounter}>
            <TouchableOpacity 
              onPress={() => handleMemberCountChange(false)}
              disabled={memberCount <= 1}
            >
              <MinusSVG />
            </TouchableOpacity>
            <Text style={clubBookingStyles.memberCount}>{memberCount}</Text>
            <TouchableOpacity 
              onPress={() => handleMemberCountChange(true)}
              disabled={memberCount >= maxCapacity}
            >
              <PlusSVG />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Price Display Section */}
      {/* <View style={clubBookingStyles.priceSection}>
        <Text style={clubBookingStyles.priceTitle}>Price Breakdown</Text>
        <View style={clubBookingStyles.priceRow}>
          <Text style={clubBookingStyles.priceLabel}>Entry Fee (per person):</Text>
          <Text style={clubBookingStyles.priceValue}>${entryFee}</Text>
        </View>
        <View style={clubBookingStyles.priceRow}>
          <Text style={clubBookingStyles.priceLabel}>Ticket Price (per person):</Text>
          <Text style={clubBookingStyles.priceValue}>${ticketPrice}</Text>
        </View>
        <View style={clubBookingStyles.priceRow}>
          <Text style={clubBookingStyles.priceLabel}>Members:</Text>
          <Text style={clubBookingStyles.priceValue}>{memberCount}</Text>
        </View>
        <View style={clubBookingStyles.totalPriceRow}>
          <Text style={clubBookingStyles.totalPriceLabel}>Total:</Text>
          <Text style={clubBookingStyles.totalPriceValue}>${calculateTotalPrice()}</Text>
        </View>
      </View> */}

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
