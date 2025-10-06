import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import ClockIcon from "../../assets/svg/clockIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";
import { useDispatch, useSelector } from "react-redux";
import { getBookingList } from "../../redux/auth/actions";

interface BookingScreenProps {
  navigation?: any;
}

const tabs = [
  { id: "pending", title: "Pending" },
  { id: "confirmed", title: "Completed" },
  { id: "cancelled", title: "Cancelled" },
];

const formatBookingDate = (
  startDate: string,
  endDate: string,
  openingTime: string
) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isSameDay = start.toDateString() === end.toDateString();

    let dateFormatted;
    if (isSameDay) {
      dateFormatted = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      dateFormatted = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    let timeFormatted = "Time not available";
    if (openingTime) {
      const [hours, minutes] = openingTime.split(":");
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      timeFormatted = `${hour12}:${minutes} ${ampm}`;
    }

    return `${dateFormatted} - ${timeFormatted}`;
  } catch (error) {
    console.log("Error formatting date:", error);
    return "Date not available";
  }
};

const BookingCard: React.FC<{
  booking: any;
  onCancel: () => void;
  onLeaveReview?: () => void;
}> = ({ booking, onCancel, onLeaveReview }) => {
  const getButtonText = () => {
    switch (booking.status) {
      case "confirmed":
        return "Leave Review";
      case "cancelled":
        return "Book Again";
      default:
        return "Cancel";
    }
  };

  const handleButtonPress = () => {
    if (booking.status === "confirmed" && onLeaveReview) {
      onLeaveReview();
    } else {
      onCancel();
    }
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardTopSection}>
        <Image
          source={{
            uri:
              booking?.eventId?.photos?.[0] ||
              "https://via.placeholder.com/150",
          }}
          style={styles.bookingImage}
        />
        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{booking?.type}</Text>
            </View>
            <Text style={styles.priceText}>${booking?.fees}</Text>
          </View>

          <Text style={styles.eventName}>{booking?.eventId?.name}</Text>

          <View style={styles.detailsRow}>
            <LocationFavourite size={14} color={colors.violate} />
            <Text style={styles.detailText}>{booking?.eventId?.address}</Text>
          </View>

          <View style={styles.detailsRow}>
            <ClockIcon size={14} color={colors.violate} />
            <Text style={styles.detailText}>
              {formatBookingDate(
                booking.bookingStartDate,
                booking.bookingEndDate,
                booking?.eventId?.openingTime
              )}
            </Text>
          </View>
        </View>
      </View>

      {booking.status !== "cancelled" && (
        <>
          <View style={styles.separatorLine} />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleButtonPress}
          >
            <Text style={styles.cancelButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const bookingList = useSelector((state: any) => state.auth.bookingList);
  const bookingListErr = useSelector((state: any) => state.auth.bookingListErr);
  const loading = useSelector((state: any) => state.auth.loader);

  const [selectedTab, setSelectedTab] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState({
    pending: false,
    confirmed: false,
    cancelled: false,
  });

  const fetchBookingList = async (status: string) => {
    const payload = {
      status: status,
    };
    dispatch(getBookingList(payload));
  };

  const fetchDataForTab = (tabId: string) => {
    fetchBookingList(tabId);
  };

  useFocusEffect(
    useCallback(() => {
      setIsDataLoaded({
        pending: false,
        confirmed: false,
        cancelled: false,
      });

      setPendingBookings([]);
      setConfirmedBookings([]);
      setCancelledBookings([]);

      fetchBookingList(selectedTab);
    }, [selectedTab])
  );

  useEffect(() => {
    if (bookingList && bookingList.data) {
      const currentTabData = bookingList.data;

      switch (selectedTab) {
        case "pending":
          setPendingBookings(currentTabData);
          setIsDataLoaded((prev) => ({ ...prev, pending: true }));
          break;
        case "confirmed":
          setConfirmedBookings(currentTabData);
          setIsDataLoaded((prev) => ({ ...prev, confirmed: true }));
          break;
        case "cancelled":
          setCancelledBookings(currentTabData);
          setIsDataLoaded((prev) => ({ ...prev, cancelled: true }));
          break;
        default:
          break;
      }
    }
  }, [bookingList, selectedTab]);

  console.log("bookingList...", bookingList);

  const handleTabPress = (tabId: string) => {
    setSelectedTab(tabId);
    fetchDataForTab(tabId);
  };

  const handleCancelBooking = (bookingId: string) => {};

  const handleLeaveReview = (bookingId: string) => {
    navigation?.navigate("LeaveReviewScreen");
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookingList(selectedTab);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getBookingsForTab = () => {
    switch (selectedTab) {
      case "pending":
        return pendingBookings;
      case "confirmed":
        return confirmedBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return [];
    }
  };

  const currentBookings = getBookingsForTab();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.statusBar}></View>
            <Text style={styles.title}>Bookings</Text>
          </View>

          <View style={styles.tabsSection}>
            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    selectedTab === tab.id
                      ? styles.selectedTab
                      : styles.unselectedTab,
                  ]}
                  onPress={() => handleTabPress(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab.id
                        ? styles.selectedTabText
                        : styles.unselectedTabText,
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <ScrollView
            style={styles.bookingsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bookingsContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.violate]}
                tintColor={colors.violate}
                title="Pull to refresh"
                titleColor={colors.white}
              />
            }
          >
            {loading || refreshing ? (
              <View style={styles.emptyContainer}></View>
            ) : currentBookings && currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking.id)}
                  onLeaveReview={() => handleLeaveReview(booking.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No {selectedTab} bookings found
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default BookingScreen;
