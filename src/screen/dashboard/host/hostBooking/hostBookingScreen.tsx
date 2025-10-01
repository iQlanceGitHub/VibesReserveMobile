import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../../../utilis/colors";
import PeopleIcon from "../../../../assets/svg/peopleIcon";
import ChatIcon from "../../../../assets/svg/chatIcon";
import ClockIcon from "../../../../assets/svg/clockIcon";
import LocationFavourite from "../../../../assets/svg/locationFavourite";
import PhoneIcon from "../../../../assets/svg/phoneIcon";
import MusicIcon from "../../../../assets/svg/musicIcon";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import styles from "./hostBookingStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  onBookingrequest,
  bookingrequestData,
  bookingrequestError,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BookingData {
  id: string;
  userName: string;
  userImage: any;
  category: string;
  eventName: string;
  location: string;
  date: string;
  time: string;
  people: string;
  price: string;
  rejectionReason?: string;
  status?: string;
}

interface HostBookingScreenProps {
  navigation: any;
}

const HostBookingScreen: React.FC<HostBookingScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<"accepted" | "rejected">(
    "accepted"
  );
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Redux state
  const {
    bookingrequest,
    bookingrequestErr,
    loading: reduxLoading,
  } = useSelector((state: any) => ({
    bookingrequest: state.auth.bookingrequest,
    bookingrequestErr: state.auth.bookingrequestErr,
    loading: state.auth.loading,
  }));

  // Get user ID from AsyncStorage
  const getUserID = async (): Promise<string | null> => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData?.id || "";
        return userId;
      }
      return null;
    } catch (error) {
      console.log("Error getting user ID:", error);
      return null;
    }
  };

  // Fetch bookings based on status
  const fetchBookings = async (status: "confirmed" | "cancelled") => {
    setLoading(true);
    const userId = await getUserID();

    dispatch(
      onBookingrequest({
        page: 1,
        limit: 20,
        status: status,
      })
    );
  };

  // Clear booking data
  const clearBookingData = () => {
    setBookings([]);
    setLoading(false);
    setRefreshing(false);
    dispatch(bookingrequestData(""));
    dispatch(bookingrequestError(""));
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(selectedTab === "accepted" ? "confirmed" : "cancelled");
  };

  // Handle API response
  useEffect(() => {
    if (
      bookingrequest?.status === true ||
      bookingrequest?.status === "true" ||
      bookingrequest?.status === 1 ||
      bookingrequest?.status === "1"
    ) {
      console.log("Booking requests fetched:", bookingrequest);
      const transformedBookings = transformBookingData(
        bookingrequest?.data || []
      );
      setBookings(transformedBookings);
      setLoading(false);
      setRefreshing(false);
      dispatch(bookingrequestData(""));
    }

    if (bookingrequestErr) {
      console.log("Booking request error:", bookingrequestErr);
      setLoading(false);
      setRefreshing(false);
      showToast("error", "Failed to fetch bookings. Please try again.");
      dispatch(bookingrequestError(""));
    }
  }, [bookingrequest, bookingrequestErr, dispatch]);

  const formatDateAndTime = (
    bookingStartDate: string,
    bookingEndDate: string,
    openingTime: string
  ) => {
    try {
      const startDate = new Date(bookingStartDate);
      const endDate = new Date(bookingEndDate);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const startMonth = monthNames[startDate.getMonth()];
      const startDay = startDate.getDate().toString();
      const endDay = endDate.getDate().toString();

      const formatTime = (timeString: string) => {
        if (!timeString) return "12:00 AM";

        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        const displayMinutes = minutes || "00";

        return `${displayHour}:${displayMinutes} ${ampm}`;
      };

      const formattedTime = formatTime(openingTime);

      return `${startMonth} ${startDay}-${endDay} ${formattedTime}`;
    } catch (error) {
      console.log("Error formatting date:", error);
      return "Date not available";
    }
  };

  const transformBookingData = (apiData: any[]): BookingData[] => {
    return apiData.map((item: any) => ({
      id: item._id || item.id || "",
      userName: item.userId?.fullName || "Unknown User",
      userImage: {
        uri: item.userId?.profileImage,
      },
      category: item.eventId?.type,
      eventName: item.eventId?.name || "Event",
      location: item.eventId?.address
        ? item.eventId.address.length > 30
          ? item.eventId.address.substring(0, 85) + "..."
          : item.eventId.address
        : "Location",
      date: formatDateAndTime(
        item.bookingStartDate,
        item.bookingEndDate,
        item.eventId?.openingTime
      ),
      time: item.eventId?.openingTime || "Time",
      people: `${item.members || 1} Person`,
      price: `$${item.totalAmount || "0.00"}`,
      rejectionReason: item.cancelReason || "No reason provided",
      status: item.status,
    }));
  };

  useEffect(() => {
    fetchBookings(selectedTab === "accepted" ? "confirmed" : "cancelled");
  }, [selectedTab]);

  // Focus effect to fetch data when screen comes into focus and clear when leaving
  useFocusEffect(
    useCallback(() => {
      // Fetch data when screen comes into focus
      fetchBookings(selectedTab === "accepted" ? "confirmed" : "cancelled");

      // Cleanup function - clear data when screen loses focus
      return () => {
        clearBookingData();
      };
    }, [selectedTab])
  );

  const currentBookings = bookings;

  const handleCall = (bookingId: string) => {
    console.log("Call booking:", bookingId);
  };

  const handleChat = (bookingId: string) => {
    console.log("Chat booking:", bookingId);
  };

  const handleAccept = (bookingId: string) => {
    console.log("Accept booking:", bookingId);
  };

  const handleCardPress = (bookingId: string) => {
    console.log("Navigate to booking detail:", bookingId);
    try {
      navigation.navigate("BookingDetailScreen", { bookingId });
    } catch (error) {
      console.log("Navigation error:", error);
    }
  };

  const renderBookingCard = (booking: BookingData, index: number) => (
    <TouchableOpacity
      key={booking.id}
      style={[
        selectedTab === "rejected"
          ? styles.rejectedBookingCard
          : styles.bookingCard,
        index === currentBookings.length - 1 &&
          (selectedTab === "rejected"
            ? styles.lastRejectedBookingCard
            : styles.lastBookingCard),
      ]}
      onPress={() => handleCardPress(booking.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Image source={booking.userImage} style={styles.profileImage} />
        </View>

        <View style={styles.rightSection}>
          <View style={styles.headerRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{booking.category}</Text>
            </View>
            {selectedTab === "accepted" && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(booking.id)}
                >
                  <PhoneIcon size={16} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleChat(booking.id)}
                >
                  <ChatIcon size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{booking.userName}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MusicIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.eventName}</Text>
            </View>

            <View style={styles.detailRow}>
              <LocationFavourite width={14} height={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <ClockIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <PeopleIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.people}</Text>
              <Text style={styles.priceText}>{booking.price}</Text>
            </View>
          </View>
        </View>
      </View>

      {selectedTab === "rejected" && (
        <View style={styles.rejectionRow}>
          <Text style={styles.rejectionText}>
            ❌ Reason: {booking.rejectionReason || "No reason provided"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper
      backgroundColor={colors.gradient_dark_purple}
      statusBarStyle="light-content"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "accepted" && styles.activeTab]}
            onPress={() => setSelectedTab("accepted")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "accepted" && styles.activeTabText,
              ]}
            >
              Accepted
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "rejected" && styles.activeTab]}
            onPress={() => setSelectedTab("rejected")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "rejected" && styles.activeTabText,
              ]}
            >
              Rejected
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.violate]} // Android
              tintColor={colors.violate} // iOS
              title="Pull to refresh"
              titleColor={colors.white}
            />
          }
        >
          {loading || reduxLoading ? (
            <View style={styles.emptyContainer}></View>
          ) : currentBookings.length > 0 ? (
            currentBookings.map((booking, index) =>
              renderBookingCard(booking, index)
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {selectedTab} bookings found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default HostBookingScreen;
