import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import BackIcon from "../../../../assets/svg/backIcon";
import EventInfo from "../../../../components/EventInfo";
import UserInfo from "../../../../components/UserInfo";
import ReviewCard from "../../../../components/ReviewCard";
import styles from "./bookingDetailStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  onBookingDetail,
  bookingDetailData,
  bookingDetailError,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";

interface BookingDetailsScreenProps {
  navigation: any;
  route: any;
}

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);

  // Get booking ID from route params
  const bookingId = route?.params?.bookingId;

  console.log("BookingDetailScreen - Route params:", route?.params);
  console.log("BookingDetailScreen - Booking ID:", bookingId);

  // Redux state
  const {
    bookingDetail,
    bookingDetailErr,
    loading: reduxLoading,
  } = useSelector((state: any) => ({
    bookingDetail: state.auth.bookingDetail,
    bookingDetailErr: state.auth.bookingDetailErr,
    loading: state.auth.loader,
  }));

  // Fetch booking details
  useEffect(() => {
    if (bookingId) {
      dispatch(onBookingDetail({ bookingId }));
    } else {
      showToast("error", "Booking ID not found");
      navigation.goBack();
    }
  }, [bookingId, dispatch, navigation]);

  // Handle API response
  useEffect(() => {
    if (
      bookingDetail?.status === true ||
      bookingDetail?.status === "true" ||
      bookingDetail?.status === 1 ||
      bookingDetail?.status === "1"
    ) {
      console.log("Booking detail fetched:", bookingDetail);
      setBookingData(bookingDetail?.data);
      setLoading(false);
      dispatch(bookingDetailData(""));
    }

    if (bookingDetailErr) {
      console.log("Booking detail error:", bookingDetailErr);
      setLoading(false);

      // Check if it's a "Not found" error
      if (bookingDetailErr?.error?.message === "Not found") {
        showToast(
          "error",
          "Booking not found. This booking may have been deleted or you don't have permission to view it."
        );
      } else {
        showToast(
          "error",
          "Failed to fetch booking details. Please try again."
        );
      }

      dispatch(bookingDetailError(""));
    }
  }, [bookingDetail, bookingDetailErr, dispatch]);

  // Transform API data to component format
  const transformBookingData = (apiData: any) => {
    if (!apiData) return null;

    return {
      eventName: apiData.eventId?.name || "Event",
      location: "Event Location", // Since address is not in the API response
      date: formatDateAndTime(
        apiData.bookingStartDate,
        apiData.bookingEndDate,
        apiData.eventId?.openingTime
      ),
      time: formatTime(apiData.eventId?.openingTime),
      rating: 4.5, // Static rating since not in API response
      totalPrice: `$${apiData.totalAmount || "0.00"}`,
      user: {
        name: apiData.userId?.fullName || "Unknown User",
        email: apiData.userId?.email || "",
        phone: apiData.userId?.phone || "",
        image: {
          uri: "https://via.placeholder.com/100", // Static image since profileImage not in response
        },
      },
      bookingDetails: {
        members: apiData.members || 1,
        ticketType: apiData.ticketType || "Standard",
        ticketCost: apiData.ticketCost || 0,
        boothCost: apiData.boothCost || 0,
        discount: apiData.discount || 0,
        fees: apiData.fees || 0,
        transactionInfo: apiData.transactionInfo || "",
        status: apiData.status || "pending",
        createdAt: apiData.createdAt || "",
      },
      reviews: [
        {
          id: "1",
          userName: "Loki Bright",
          userImage: {
            uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          },
          rating: 5,
          reviewText:
            "Amazing experience! The vibe was incredible, and the music kept us on the floor all night.",
        },
        {
          id: "2",
          userName: "Anita Cruz",
          userImage: {
            uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          },
          rating: 4,
          reviewText:
            "Loved the DJ sets, but the entry queue was a bit long. Still worth it.",
        },
      ], // Static reviews as requested
    };
  };

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
      const startDay = startDate.getDate().toString().padStart(2, "0");
      const endDay = endDate.getDate().toString().padStart(2, "0");

      const formattedTime = formatTime(openingTime);
      return `${startMonth} ${startDay} to ${endDay} - ${formattedTime}`;
    } catch (error) {
      console.log("Error formatting date:", error);
      return "Date not available";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "12:00 AM";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinutes = minutes || "00";

    return `${displayHour}:${displayMinutes} ${ampm}`;
  };

  // Transform data when bookingDetail changes
  useEffect(() => {
    if (bookingDetail?.data) {
      const transformedData = transformBookingData(bookingDetail.data);
      setBookingData(transformedData);
    }
  }, [bookingDetail]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {
    console.log("Chat pressed");
  };

  const handleCallPress = () => {
    console.log("Call pressed");
  };

  // Show loading state
  if (loading || reduxLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <BackIcon size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  // Show error state if no booking data
  if (!bookingData && !loading && !reduxLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <BackIcon size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Booking not found</Text>
          <Text style={styles.errorSubText}>
            This booking may have been deleted or you don't have permission to
            view it.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (bookingId) {
                dispatch(onBookingDetail({ bookingId }));
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackIcon size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <EventInfo
          eventName={bookingData.eventName}
          location={bookingData.location}
          date={bookingData.date}
          time={bookingData.time}
          rating={bookingData.rating}
          totalPrice={bookingData.totalPrice}
        />

        <UserInfo
          userName={bookingData.user.name}
          userImage={bookingData.user.image}
          onChatPress={handleChatPress}
          onCallPress={handleCallPress}
        />

        {/* Booking Details Section */}
        <View style={styles.bookingDetailsSection}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Members:</Text>
            <Text style={styles.detailValue}>
              {bookingData.bookingDetails.members} Person(s)
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ticket Type:</Text>
            <Text style={styles.detailValue}>
              {bookingData.bookingDetails.ticketType}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ticket Cost:</Text>
            <Text style={styles.detailValue}>
              ${bookingData.bookingDetails.ticketCost}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booth Cost:</Text>
            <Text style={styles.detailValue}>
              ${bookingData.bookingDetails.boothCost}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Discount:</Text>
            <Text style={styles.detailValue}>
              -${bookingData.bookingDetails.discount}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fees:</Text>
            <Text style={styles.detailValue}>
              ${bookingData.bookingDetails.fees}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>
              {bookingData.bookingDetails.transactionInfo}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusText]}>
              {bookingData.bookingDetails.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <View style={styles.divider} />
          <Text style={styles.reviewsTitle}>
            Reviews ({bookingData.reviews.length})
          </Text>
          <View style={styles.reviewsContainer}>
            {bookingData.reviews.map((review: any, index: number) => (
              <ReviewCard
                key={review.id || index}
                userName={review.userName || review.user?.name || "Anonymous"}
                userImage={
                  review.userImage ||
                  review.user?.image || {
                    uri: "https://via.placeholder.com/100",
                  }
                }
                rating={review.rating || 5}
                reviewText={
                  review.reviewText || review.comment || "No review text"
                }
              />
            ))}
          </View>
          <View style={styles.divider} />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingDetailsScreen;
