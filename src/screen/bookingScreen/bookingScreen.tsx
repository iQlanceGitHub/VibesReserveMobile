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
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import ClockIcon from "../../assets/svg/clockIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";
import { useDispatch, useSelector } from "react-redux";
import { getBookingList, onCancelBooking } from "../../redux/auth/actions";
import { showToast } from "../../utilis/toastUtils";
import CloseIcon from "../../assets/svg/closeIcon";

interface BookingScreenProps {
  navigation?: any;
}

const tabs = [
  { id: "pending", title: "Upcoming" },
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

  const shouldShowLeaveReviewButton = () => {
    return (
      booking.status === "confirmed" &&
      !booking.isReview &&
      booking.displayStatus === "completed"
    );
  };

  const shouldShowCancelButton = () => {
    return (
      booking.status === "confirmed" && booking.displayStatus === "upcoming"
    );
  };

  const handleButtonPress = () => {
    if (shouldShowLeaveReviewButton() && onLeaveReview) {
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
            <Text
              style={styles.detailText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {booking?.eventId?.address}
            </Text>
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
          {(shouldShowLeaveReviewButton() ||
            shouldShowCancelButton() ||
            booking.status === "pending") && (
            <View style={styles.separatorLine} />
          )}

          {shouldShowLeaveReviewButton() ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.cancelButtonText}>Leave Review</Text>
            </TouchableOpacity>
          ) : shouldShowCancelButton() ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : booking.status === "pending" ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.cancelButtonText}>{getButtonText()}</Text>
            </TouchableOpacity>
          ) : null}
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
  const cancelBooking = useSelector((state: any) => state.auth.cancelBooking);
  const cancelBookingErr = useSelector(
    (state: any) => state.auth.cancelBookingErr
  );

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

  // Cancel booking modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const fetchBookingList = async () => {
    // Since the API returns all data at once, we don't need status parameter
    const payload = {};
    dispatch(getBookingList(payload));
  };

  const fetchDataForTab = (tabId: string) => {
    // Just fetch all data since API returns everything
    fetchBookingList();
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

      fetchBookingList();
    }, [])
  );

  useEffect(() => {
    if (bookingList && bookingList.data) {
      const { upcoming, completed, cancelled } = bookingList.data;

      // Set all data at once since the API returns all three arrays
      setPendingBookings(upcoming || []);
      setConfirmedBookings(completed || []);
      setCancelledBookings(cancelled || []);

      setIsDataLoaded({
        pending: true,
        confirmed: true,
        cancelled: true,
      });
    }
  }, [bookingList]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle cancel booking success
  useEffect(() => {
    if (cancelBooking && cancelBooking.status === 1) {
      showToast(
        "success",
        cancelBooking.message || "Booking cancelled successfully!"
      );
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedBooking(null);
      fetchBookingList(); // Refresh the booking list
    }
  }, [cancelBooking]);

  // Handle cancel booking error
  useEffect(() => {
    if (cancelBookingErr) {
      showToast("error", "Failed to cancel booking. Please try again.");
    }
  }, [cancelBookingErr]);

  const handleTabPress = (tabId: string) => {
    setSelectedTab(tabId);
    fetchDataForTab(tabId);
  };

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setSelectedBooking(null);
  };

  const handleCancelConfirm = () => {
    if (cancelReason.trim()) {
      const cancelData = {
        bookingId: selectedBooking?._id || selectedBooking?.id,
        reason: cancelReason.trim(),
      };
      dispatch(onCancelBooking(cancelData));
    } else {
      showToast("error", "Please provide a reason for cancellation.");
    }
  };

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const handleLeaveReview = (booking: any) => {
    navigation?.navigate("LeaveReviewScreen", { bookingData: booking });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookingList();
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
                  onCancel={() => handleCancelBooking(booking)}
                  onLeaveReview={() => handleLeaveReview(booking)}
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

        {/* Cancel Booking Modal */}
        <Modal
          visible={showCancelModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelModalClose}
          statusBarTranslucent={true}
          hardwareAccelerated={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Cancel Booking</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCancelModalClose}
                >
                  <CloseIcon size={24} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>
                Please provide a reason for cancellation:
              </Text>

              <TextInput
                style={styles.reasonTextInput}
                placeholder="Enter reason for cancellation..."
                placeholderTextColor={colors.textColor}
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />

              {/* Show Done button when keyboard is visible */}
              {isKeyboardVisible && (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleKeyboardDismiss}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Hide buttons when keyboard is visible */}
              {!isKeyboardVisible && (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={handleCancelModalClose}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleCancelConfirm}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default BookingScreen;
