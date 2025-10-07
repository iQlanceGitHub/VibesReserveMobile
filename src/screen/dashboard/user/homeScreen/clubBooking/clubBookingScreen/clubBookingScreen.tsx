import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToast } from "../../../../../../utilis/toastUtils";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DateRangePicker from "../../../../../../components/DateRangePicker";
import { colors } from "../../../../../../utilis/colors";
import { BackButton } from "../../../../../../components/BackButton";
import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
import CalendarIconViolet from "../../../../../../assets/svg/CalendarIconViolet";
import MinusSVG from "../../../../../../assets/svg/MinusSVG";
import PlusSVG from "../../../../../../assets/svg/PlusSVG";
import clubBookingStyles from "./styles";
import { verticalScale } from "../../../../../../utilis/appConstant";
import { onCheckBookedDateBooth, onCheckBookedDate, checkBookedDateData, checkBookedDateBoothData } from "../../../../../../redux/auth/actions";

const ClubBookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Get event data from route params
  const { eventData } = (route.params as any) || {};
  const { selected } = (route.params as any) || {};

  // Redux state
  const { checkBookedDateBooth, checkBookedDateBoothErr, checkBookedDate, checkBookedDateErr } = useSelector((state: any) => state.auth);

  // Debug: Log route params to see what's being passed
  console.log("ClubBookingScreen route.params:", route.params);
  console.log("ClubBookingScreen eventData:", eventData);
  console.log("ClubBookingScreen selected:", selected);
  console.log("ClubBookingScreen eventData type:", typeof eventData);
  console.log("ClubBookingScreen eventData keys:", eventData ? Object.keys(eventData) : 'eventData is null/undefined');
  console.log("ClubBookingScreen eventData length:", eventData ? Object.keys(eventData).length : 'eventData is null/undefined');

  // Extract actual event data - handle both direct data and API response structure
  const actualEventData = eventData?.data || eventData;
  console.log("ClubBookingScreen actualEventData:", actualEventData);
  console.log("ClubBookingScreen selectedTicket:", actualEventData?.selectedTicket);
  console.log("ClubBookingScreen tickets:", actualEventData?.tickets);

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

  // State for event data and fallback indicator
  const [currentEventData, setCurrentEventData] = useState(fallbackEventData);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(true);

  // State for dates and booking data
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [bookingData, setBookingData] = useState({
    startDate: "2025-09-01T00:00:00.000Z",
    endDate: "2025-09-30T00:00:00.000Z",
    bookedDates: [] as string[],
  });
  const [eventStartDate, setEventStartDate] = useState<Date>(new Date());
  const [eventEndDate, setEventEndDate] = useState<Date>(new Date());
  const [memberCount, setMemberCount] = useState(1);

  // Function to call checkBookedDateBooth API
  const callCheckBookedDateBoothAPI = (eventId: string, boothId: string) => {
    console.log("Calling checkBookedDateBooth API with:", { eventId, boothId });
    dispatch(onCheckBookedDateBooth({ eventId, boothId }));
  };

  // Function to call checkBookedDate API
  const callCheckBookedDateAPI = (eventId: string, startDate: string, endDate: string) => {
    console.log("Calling checkBookedDate API with:", { eventId, startDate, endDate });
    dispatch(onCheckBookedDate({ eventId, startDate, endDate }));
  };

  // Process event data in useEffect to prevent infinite re-renders
  useEffect(() => {
    if (!actualEventData) {
      console.log("No actualEventData available, using fallback");
      setCurrentEventData(fallbackEventData);
      setIsUsingFallbackData(true);
      return;
    }

    if (typeof actualEventData === 'string' && actualEventData.trim() === '') {
      console.log("actualEventData is empty string, using fallback");
      setCurrentEventData(fallbackEventData);
      setIsUsingFallbackData(true);
      return;
    }

    if (typeof actualEventData === 'object' && Object.keys(actualEventData).length === 0) {
      console.log("actualEventData is empty object, using fallback");
      setCurrentEventData(fallbackEventData);
      setIsUsingFallbackData(true);
      return;
    }

    console.log("Using actualEventData:", actualEventData);
    setCurrentEventData(actualEventData);
    setIsUsingFallbackData(false);
  }, [actualEventData]);

  // Initialize dates and booking data when currentEventData changes
  useEffect(() => {
    if (currentEventData) {
      const startDate = currentEventData?.startDate ? new Date(currentEventData.startDate) : new Date();
      const endDate = currentEventData?.endDate ? new Date(currentEventData.endDate) : new Date();

      setEventStartDate(startDate);
      setEventEndDate(endDate);
      // Don't auto-select dates - let user choose
      // setSelectedStartDate(startDate);
      // setSelectedEndDate(endDate);

      setBookingData({
        startDate: currentEventData?.startDate || new Date().toISOString(),
        endDate: currentEventData?.endDate || new Date().toISOString(),
        bookedDates: [], // Will be updated when API response is received
      });

      // Call API to get booked dates if we have eventId and boothId
      const eventId = currentEventData?._id || (currentEventData as any)?.id;
      const boothId = (currentEventData as any)?.selectedTicket?.boothId || 
                     (currentEventData as any)?.selectedTicket?.id ||
                     (currentEventData?.booths?.[0] as any)?._id ||
                     (currentEventData?.booths?.[0] as any)?.id;

      if (eventId && boothId) {
        console.log("Calling checkBookedDateBooth API with eventId:", eventId, "boothId:", boothId);
       // callCheckBookedDateBoothAPI(eventId, boothId);
      } else {
        console.log("Missing eventId or boothId, skipping API call");
        console.log("eventId:", eventId, "boothId:", boothId);
      }
    }
  }, [currentEventData]);
  useEffect(() => {
    if ((currentEventData as any)?.selectedTicket?.capacity) {
      const eventId = currentEventData?._id || (currentEventData as any)?.id;
      const boothId = (currentEventData as any)?.selectedTicket?.boothId || 
                     (currentEventData as any)?.selectedTicket?.id ||
                     (currentEventData?.booths?.[0] as any)?._id ||
                     (currentEventData?.booths?.[0] as any)?.id;
     callCheckBookedDateBoothAPI(eventId, boothId);
    }
  }, [currentEventData]);

  

  // Handle API response for booked dates
  useEffect(() => {
    if (checkBookedDateBooth && checkBookedDateBooth.status === 1) {
      console.log("Received booked dates from API:", checkBookedDateBooth);
      const bookedDates = checkBookedDateBooth.bookedDates || [];
      
      setBookingData(prevData => ({
        ...prevData,
        bookedDates: bookedDates
      }));
      
      console.log("Updated bookingData with booked dates:", bookedDates);
    } else if (checkBookedDateBoothErr) {
      console.log("Error fetching booked dates:", checkBookedDateBoothErr);
      showExtendedToast('error', 'Failed to load booked dates. Please try again.', 5000);
    }
  }, [checkBookedDateBooth, checkBookedDateBoothErr]);

  // Handle API response for checking booked date availability
  useEffect(() => {
    if (checkBookedDate && checkBookedDate.status === 1) {
      console.log("Received checkBookedDate response:", checkBookedDate);
      
      // Check if response has data array (new format)
      if (checkBookedDate.data && Array.isArray(checkBookedDate.data)) {
        console.log("Processing date availability data:", checkBookedDate.data);
        
        // Check if ALL dates have sufficient available capacity and collect insufficient dates
        const insufficientDates: Array<{date: string, availableCapacity: number, requiredMembers: number}> = [];
        const hasAvailableCapacity = checkBookedDate.data.every((dateInfo: any) => {
          const availableCapacity = dateInfo.availableCapacity || 0;
          const requiredMembers = memberCount;
          console.log(`Date ${dateInfo.date}: availableCapacity=${availableCapacity}, requiredMembers=${requiredMembers}`);
          
          if (availableCapacity < requiredMembers) {
            insufficientDates.push({
              date: dateInfo.date,
              availableCapacity,
              requiredMembers
            });
          }
          
          return availableCapacity >= requiredMembers;
        });
        
        if (hasAvailableCapacity) {
          console.log("✅ All dates have sufficient capacity, proceeding to next screen");
          proceedToNextScreen();
        } else {
          console.log("❌ At least one date has insufficient capacity for selected member count");
          
          // Format insufficient dates for display
          const insufficientDatesText = insufficientDates.map(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            return `${formattedDate}`;
          }).join(', ');
          
          showExtendedToast(
            'error',
            `Booking not available. Insufficient capacity on: ${insufficientDatesText}. Please try different dates or reduce members.`,
            8000 // 8 seconds duration
          );
          dispatch(checkBookedDateData(''));
        }
      } 
      // Fallback to old format (simple available boolean)
      else if (checkBookedDate.available === true || checkBookedDate.available === "true") {
        console.log("✅ Tickets available (legacy format), proceeding to next screen");
        proceedToNextScreen();
      } else {
        console.log("❌ Tickets not available for selected date and member count");
        showExtendedToast(
          'error',
          'Booking is not available for the selected date and member count. Please try a different date or reduce the number of members.',
          6000 // 6 seconds duration
        );
      }
    } else if (checkBookedDateErr) {
      console.log("Error checking booked date availability:", checkBookedDateErr);
      Alert.alert(
        'Error',
        'Failed to check booking availability. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [checkBookedDate, checkBookedDateErr, memberCount]);

  // Custom toast function with extended duration for this screen
  const showExtendedToast = (type: string, text: string, duration: number = 5000) => {
    Toast.show({
      type: type,
      text2: text,
      text2Style: {
        color: type === 'error' ? colors.red : colors.green,
        fontSize: 14,
        flexWrap: "wrap",
        fontWeight: "500",
      },
      props: {
        text1NumberOfLines: 2,
      },
      visibilityTime: duration, // Extended duration in milliseconds
    });
  };

  // Get capacity and pricing from selected ticket data using useMemo to prevent re-calculations
  const maxCapacity = useMemo(() => {
    console.log("Calculating maxCapacity from currentEventData:", currentEventData);
    
    // First try to get from selected ticket
    if ((currentEventData as any)?.selectedTicket?.capacity) {
      const capacity = parseInt(String((currentEventData as any).selectedTicket.capacity));
      console.log("Using selectedTicket capacity:", capacity);
      return isNaN(capacity) ? 10 : capacity;
    }
    // Then try from tickets array
    // if (currentEventData?.tickets?.[0]?.capacity) {
    //   const capacity = parseInt(String(currentEventData.tickets[0].capacity));
    //   console.log("Using tickets[0] capacity:", capacity);
    //   return isNaN(capacity) ? 10 : capacity;
    // }
    if (currentEventData) {
      const capacity = parseInt(String(currentEventData?.eventCapacity));
      return isNaN(capacity) ? 0 : capacity;
    }
    // Fallback to 10
    console.log("Using fallback capacity: 10");
    return 10;
  }, [currentEventData]);
  
  const ticketPrice = useMemo(() => {
    console.log("Calculating ticketPrice from currentEventData:", currentEventData);
    
    // First try to get from selected ticket/booth
    if ((currentEventData as any)?.selectedTicket?.price) {
      const price = parseFloat(String((currentEventData as any).selectedTicket.price));
      console.log("Using selectedTicket price:", price);
      return isNaN(price) ? 0 : price;
    }
    
    // Check if this is a booth (has boothType property)
    const isBooth = (currentEventData as any)?.selectedTicket?.boothType !== undefined;
    
    if (isBooth) {
      // Try from booths array
      if (currentEventData?.booths?.[0] && 'boothPrice' in currentEventData.booths[0]) {
        const price = parseFloat(String((currentEventData.booths[0] as any).boothPrice));
        console.log("Using booths[0] boothPrice:", price);
        return isNaN(price) ? 0 : price;
      }
    } else {
      // Try from tickets array
      if (currentEventData?.tickets?.[0]?.ticketPrice) {
        const price = parseFloat(String(currentEventData.tickets[0].ticketPrice));
        console.log("Using tickets[0] ticketPrice:", price);
        return isNaN(price) ? 0 : price;
      }
    }
    
    // Fallback to 0
    console.log("Using fallback price: 0");
    return 0;
  }, [currentEventData]);
  
  const entryFee = useMemo(() => {
    // First try to get from selected ticket
    if ((currentEventData as any)?.selectedTicket?.entryFee) {
      return (currentEventData as any).selectedTicket.entryFee;
    }
    // Then try from event data
    if (currentEventData?.entryFee) {
      return currentEventData.entryFee;
    }
    // Fallback to 0
    return 0;
  }, [currentEventData]);

  const handleDateRangeSelect = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log("Selected date range:", { startDate, endDate });
    
    // Ensure we always have at least one date selected
    if (!startDate && !endDate) {
      console.log("Warning: No date selected, this should not happen with updated DateRangePicker");
    }
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
    // If only start date is selected
    if (selectedStartDate && !selectedEndDate) {
      const startMonth = selectedStartDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = selectedStartDate.getDate().toString().padStart(2, "0");
      return `${startMonth} ${startDay}`;
    }
    // If no dates selected, return placeholder
    return "Select Date";
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

  // Function to proceed to next screen (extracted from handleNextPress)
  const proceedToNextScreen = () => {
    console.log("🔍 proceedToNextScreen called");
    console.log("🔍 selectedStartDate:", selectedStartDate);
    console.log("🔍 selectedEndDate:", selectedEndDate);
    
    // If only start date is selected, use the same date for end date
    // This ensures single date selection passes same date as start and end
    const finalStartDate = selectedStartDate;
    const finalEndDate = selectedEndDate || selectedStartDate;
    
    console.log("📅 Final dates - Start:", finalStartDate, "End:", finalEndDate);

    // Prepare booking data to pass to next screen
    const totalPrice = calculateTotalPrice();
    const selectedTicket = (currentEventData as any)?.selectedTicket;

    const startDateISO = String(finalStartDate.getFullYear()) + '-' + 
                        String(finalStartDate.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(finalStartDate.getDate()).padStart(2, '0') + 'T00:00:00.000Z';
    const endDateISO = String(finalEndDate.getFullYear()) + '-' + 
                      String(finalEndDate.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(finalEndDate.getDate()).padStart(2, '0') + 'T00:00:00.000Z';
    console.log("startDateISONew", startDateISO);
    console.log("endDateISONew", endDateISO);
    
    const bookingData = {
      // Event information
      eventData: currentEventData,
      
      
      // Selected dates (converted to strings to avoid serialization warnings)
      selectedStartDate: startDateISO?.toString() || null,
      selectedEndDate: endDateISO?.toString() || null,
      selectedDateRange: {
        start: startDateISO?.toString() || '',
        end: endDateISO?.toString() || '',
        formatted: formatSelectedDateRange()
      },
      
      // Ticket/Booth information
      selectedTicket: selectedTicket,
      ticketId: selectedTicket?.id || selectedTicket?._id || '',
      ticketType: selectedTicket?.title || selectedTicket?.name || 
                  selectedTicket?.ticketType?.name || selectedTicket?.boothType?.name || 'General',
      
      // Booking details
      memberCount: memberCount,
      maxCapacity: maxCapacity,
      ticketPrice: ticketPrice,
      entryFee: entryFee,
      totalPrice: totalPrice,
      
      // Additional booking information
      bookingDetails: {
        eventName: currentEventData?.name || (currentEventData as any)?.title || "Event",
        eventAddress: currentEventData?.address || (currentEventData as any)?.location || "Address not available",
        eventPrice: entryFee,
        ticketPrice: ticketPrice,
        eventTime: currentEventData?.openingTime || "10:00",
        eventDate: startDateISO?.toString() || '',
        memberCount: memberCount,
        totalPrice: totalPrice,
        maxCapacity: maxCapacity,
        ticketId: selectedTicket?.id || selectedTicket?._id || '',
        ticketType: selectedTicket?.title || selectedTicket?.name || 
                    selectedTicket?.ticketType?.name || selectedTicket?.boothType?.name || 'General',
        selectedDateRange: formatSelectedDateRange()
      }
    };
    
    console.log("Complete booking data being passed to next screen:", bookingData);
    console.log("Selected dates:", { start: startDateISO, end: endDateISO });
    console.log("Number of tickets:", memberCount);
    console.log("Ticket price per person:", ticketPrice);
    console.log("Total price:", totalPrice);
    console.log("Ticket ID:", selectedTicket?.id || currentEventData?.tickets?.[0]?._id);
    dispatch(checkBookedDateData(''));
    (navigation as any).navigate("PaymentScreen", bookingData);
  };

  const handleNextPress = () => {
    console.log("🔍 handleNextPress called");
    console.log("🔍 selectedStartDate:", selectedStartDate);
    console.log("🔍 selectedEndDate:", selectedEndDate);
    console.log("🔍 !selectedStartDate:", !selectedStartDate);
    
    // Validate required data before proceeding
    if (!selectedStartDate) {
      console.log("❌ No date selected, showing toast");
      showExtendedToast('error', 'Please select at least one date for your booking.', 4000);
      return;
    }
    
    console.log("✅ Date validation passed, proceeding...");

    // If only start date is selected, use the same date for end date
    // This ensures single date selection passes same date as start and end
    const finalStartDate = selectedStartDate;
    const finalEndDate = selectedEndDate || selectedStartDate;
    
    console.log("📅 Final dates - Start:", finalStartDate, "End:", finalEndDate);

    if (memberCount < 1) {
      Alert.alert('Invalid Member Count', 'Please select at least 1 member for your booking.');
      return;
    }

    // Get event ID
    const eventId = currentEventData?._id || (currentEventData as any)?.id;
    
    if (!eventId) {
      Alert.alert('Error', 'Event ID not found. Please try again.');
      return;
    }

    // Call API to check if booking is available for selected date and member count
    // Format dates as YYYY-MM-DD at midnight UTC to avoid timezone issues
    const startDateISO = finalStartDate.getFullYear() + '-' + 
                        String(finalStartDate.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(finalStartDate.getDate()).padStart(2, '0') + 'T00:00:00.000Z';
    const endDateISO = finalEndDate.getFullYear() + '-' + 
                      String(finalEndDate.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(finalEndDate.getDate()).padStart(2, '0') + 'T00:00:00.000Z';
    
    console.log("🔍 Date conversion debug:");
    console.log("  Selected start date (local):", finalStartDate);
    console.log("  Selected end date (local):", finalEndDate);
    console.log("  Start date (toISOString):", finalStartDate.toISOString());
    console.log("  End date (toISOString):", finalEndDate.toISOString());
    console.log("  Start date (formatted):", startDateISO);
    console.log("  End date (formatted):", endDateISO);
    console.log("  Member count:", memberCount);
    console.log("🔍 Calling checkBookedDate API with:", { eventId, startDate: startDateISO, endDate: endDateISO });
    callCheckBookedDateAPI(eventId, startDateISO, endDateISO);
  };

  return (
    <SafeAreaView style={clubBookingStyles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
        {...(Platform.OS === 'android' && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: 'transparent',
        })}
      />
      <KeyboardAvoidingView
        style={clubBookingStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={clubBookingStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={clubBookingStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={clubBookingStyles.header}>
            <BackButton navigation={navigation} />
            <Text style={clubBookingStyles.headerTitle}>Select Date</Text>
            <View style={clubBookingStyles.headerRight} />
          </View>

      <View style={clubBookingStyles.locationContainer}>
        <View style={clubBookingStyles.locationLeft}>
          <LocationFavourite width={16} height={16} />
          <Text numberOfLines={1} style={clubBookingStyles.locationText}>
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

      {/* Debug indicator when using fallback data */}
      {isUsingFallbackData && (
        <View style={{ backgroundColor: '#ffeb3b', padding: 8, margin: 10, borderRadius: 4 }}>
          <Text style={{ color: '#000', fontSize: 12, textAlign: 'center' }}>
            ⚠️ Using sample data - Event details not loaded properly
          </Text>
        </View>
      )}

      {/* Selected ticket information */}
      {/* {(currentEventData as any)?.selectedTicket && (
        <View style={{ backgroundColor: '#4CAF50', padding: 8, margin: 10, borderRadius: 4 }}>
          <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
            ✅ Selected: {(currentEventData as any).selectedTicket.title || (currentEventData as any).selectedTicket.name || 'Ticket'}
          </Text>
          <Text style={{ color: '#fff', fontSize: 10, textAlign: 'center' }}>
            Capacity: {maxCapacity} | Price: ${ticketPrice}
          </Text>
        </View>
      )} */}

      {/* Booking summary */}
      {/* <View style={{ backgroundColor: '#2196F3', padding: 12, margin: 10, borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>
          📋 Booking Summary
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>
          Dates: {formatSelectedDateRange()}
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>
          Members: {memberCount} of {maxCapacity}
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>
          Price per person: ${ticketPrice}
        </Text>
        <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: 'bold', marginTop: 4 }}>
          Total: ${calculateTotalPrice()}
        </Text>
      </View> */}

      <View style={clubBookingStyles.calendarContainer}>
        <DateRangePicker
          onDateRangeSelect={handleDateRangeSelect}
          initialStartDate={undefined}
          initialEndDate={undefined}
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
        <View style={{ marginBottom: verticalScale(5), marginTop: verticalScale(10)}}></View>

        {/* <Text style={clubBookingStyles.memberAge}>
              * Please select at least one date for your booking.
            </Text> */}
        <View style={{ marginBottom: verticalScale(50), marginTop: verticalScale(10)}}></View>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ClubBookingScreen;
