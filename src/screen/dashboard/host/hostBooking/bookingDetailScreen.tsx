import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
  const bookingId = route?.params?.bookingId;

  const {
    bookingDetail,
    bookingDetailErr,
    loading: reduxLoading,
  } = useSelector((state: any) => ({
    bookingDetail: state.auth.bookingDetail,
    bookingDetailErr: state.auth.bookingDetailErr,
    loading: state.auth.loader,
  }));

  useEffect(() => {
    if (bookingId) {
      dispatch(onBookingDetail({ bookingId }));
    } else {
      showToast("error", "Booking ID not found");
      navigation.goBack();
    }
  }, [bookingId, dispatch, navigation]);

  useEffect(() => {
    if (
      bookingDetail?.status === true ||
      bookingDetail?.status === "true" ||
      bookingDetail?.status === 1 ||
      bookingDetail?.status === "1"
    ) {
      // Transform API data to component format
      const apiData = bookingDetail?.data;
      if (apiData) {
        const transformedData = {
          eventName: apiData.eventId?.name || "Event",
          location: apiData.eventId?.address
            ? apiData.eventId.address.length > 30
              ? apiData.eventId.address
              : apiData.eventId.address
            : "Location not available",
          date: formatDateAndTime(
            apiData.bookingStartDate,
            apiData.bookingEndDate,
            apiData.eventId?.openingTime
          ),
          rating: apiData.rating?.average || 0,
          totalPrice: `$${apiData.totalAmount || "0.00"}`,
          user: {
            name: apiData.userId?.fullName,
            email: apiData.userId?.email || "",
            phone: apiData.userId?.phone || "",
            image: {
              uri: apiData.userId?.profilePicture,
            },
          },
          reviews:
            apiData.rating?.reviews?.map((review: any, index: number) => ({
              id: review._id || index.toString(),
              userName: review.user?.fullName,
              userImage: {
                uri: review.user?.profilePicture,
              },
              rating: review.rating || 5,
              reviewText: review.review,
              createdAt: review.createdAt,
            })) || [],
        };
        setBookingData(transformedData);
      }
      setLoading(false);
      dispatch(bookingDetailData(""));
    }

    if (bookingDetailErr) {
      setLoading(false);
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
      return `${startMonth} ${startDay} - ${endDay}  ${formattedTime}`;
    } catch (error) {
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

    return `- ${displayHour}:${displayMinutes} ${ampm}`;
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {};

  const handleCallPress = () => {};

  if (!bookingData && !loading && !reduxLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <BackIcon size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Booking not found</Text>
          <Text style={styles.emptySubText}>
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
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading || reduxLoading ? (
          <View>
            {/* <Text style={styles.emptyText}>Loading booking details...</Text> */}
          </View>
        ) : bookingData ? (
          <>
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

            <View style={styles.reviewsSection}>
              <View style={styles.divider} />
              <Text style={styles.reviewsTitle}>
                Reviews ({bookingData.reviews.length})
              </Text>
              <View style={styles.reviewsContainer}>
                {bookingData.reviews.map((review: any, index: number) => (
                  <ReviewCard
                    key={review.id || index}
                    userName={
                      review.userName || review.user?.name || "Anonymous"
                    }
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
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No booking data available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BookingDetailsScreen;
