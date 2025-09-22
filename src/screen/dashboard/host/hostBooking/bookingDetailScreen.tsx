import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../../../../utilis/colors";
import BackIcon from "../../../../assets/svg/backIcon";
import EventInfo from "../../../../components/EventInfo";
import UserInfo from "../../../../components/UserInfo";
import ReviewCard from "../../../../components/ReviewCard";
import styles from "./bookingDetailStyles";

interface BookingDetailsScreenProps {
  navigation: any;
}

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  navigation,
}) => {
  const bookingData = {
    eventName: "DJ Night Party",
    location: "Bartonfort, Canada",
    date: "Aug 03 - 06",
    time: "10:00 PM",
    rating: 4.8,
    totalPrice: "$550",
    user: {
      name: "Mike Hussey",
      image: {
        uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
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
    ],
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {
    console.log("Chat pressed");
  };

  const handleCallPress = () => {
    console.log("Call pressed");
  };

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

        <View style={styles.reviewsSection}>
          <View style={styles.divider} />
          <Text style={styles.reviewsTitle}>
            Reviews ({bookingData.reviews.length})
          </Text>
          <View style={styles.reviewsContainer}>
            {bookingData.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                userName={review.userName}
                userImage={review.userImage}
                rating={review.rating}
                reviewText={review.reviewText}
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
