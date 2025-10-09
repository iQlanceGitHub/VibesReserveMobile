import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../utilis/colors";
import { verticalScale } from "../../utilis/appConstant";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import ClockIcon from "../../assets/svg/clockIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBookingData,
  getBookingList,
  onCancelBooking,
} from "../../redux/auth/actions";
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
            <Text style={styles.priceText}>${booking?.totalAmount}</Text>
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

  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState("pending");
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState({
    pending: false,
    confirmed: false,
    cancelled: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const fetchBookingList = async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ) => {
    const payload = {
      page,
      limit,
      status,
    };
    dispatch(getBookingList(payload));
  };

  const fetchDataForTab = (tabId: string, page: number = 1) => {
    setCurrentPage(page);
    const statusMap: { [key: string]: string } = {
      pending: "pending",
      confirmed: "confirmed",
      cancelled: "cancelled",
    };
    fetchBookingList(page, 10, statusMap[tabId]);
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
      setCurrentPage(1);
      setHasMoreData(true);

      fetchBookingList(1, 10);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedTab) {
        fetchDataForTab(selectedTab);
      }
    }, [selectedTab])
  );

  useEffect(() => {
    if (bookingList && bookingList.data) {
      const { upcoming, completed, cancelled } = bookingList.data;

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

  // Keyboard event listeners with more stable handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Use requestAnimationFrame for smoother state updates
        requestAnimationFrame(() => {
          setKeyboardVisible(true);
        });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Use requestAnimationFrame for smoother state updates
        requestAnimationFrame(() => {
          setKeyboardVisible(false);
        });
      }
    );

    // iOS-specific keyboard listeners for better handling
    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", () => {
            requestAnimationFrame(() => {
              setKeyboardVisible(true);
            });
          })
        : null;

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", () => {
            requestAnimationFrame(() => {
              setKeyboardVisible(false);
            });
          })
        : null;

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (cancelBooking && cancelBooking.status === 1) {
      showToast(
        "success",
        cancelBooking.message || "Booking cancelled successfully!"
      );
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedBooking(null);
      fetchBookingList(1, 10);
      dispatch(cancelBookingData(""));
    }
  }, [cancelBooking]);

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

  // Handle keyboard dismiss with a more stable approach
  const handleKeyboardDismiss = useCallback(() => {
    setKeyboardVisible(false);
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      Keyboard.dismiss();
    });
  }, []);

  const handleLeaveReview = (booking: any) => {
    navigation?.navigate("LeaveReviewScreen", { bookingData: booking });
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
        backgroundColor="transparent"
        translucent={true}
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
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
          >
            {loading ? (
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
          <View style={{ marginBottom: verticalScale(40) }} />
        </View>

        {/* Cancel Booking Modal */}
        <Modal
          visible={showCancelModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelModalClose}
          statusBarTranslucent={true}
          hardwareAccelerated={true}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View
              style={[
                styles.modalContainer,
                isKeyboardVisible &&
                  Platform.OS === "ios" && {
                    maxHeight: "70%",
                    marginTop: verticalScale(20),
                  },
              ]}
            >
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
                onChangeText={(text) => {
                  if (text.length <= 160) {
                    setCancelReason(text);
                  }
                }}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                maxLength={160}
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
                    style={styles.cancelButton}
                    onPress={handleCancelConfirm}
                  >
                    <Text style={styles.cancelButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default BookingScreen;
