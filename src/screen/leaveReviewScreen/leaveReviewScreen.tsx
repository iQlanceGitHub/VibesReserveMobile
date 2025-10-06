import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { BackButton } from "../../components/BackButton";
import { Buttons } from "../../components/buttons";
import HeartIcon from "../../assets/svg/heartIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";
import ClockIcon from "../../assets/svg/clockIcon";
import ArrowRightIcon from "../../assets/svg/arrowRightIcon";
import StarRating from "../../components/StarRating";
import { handleRestrictedAction } from "../../utilis/userPermissionUtils";
import { onRatingReview } from "../../redux/auth/actions";
import { showToast } from "../../utilis/toastUtils";

interface LeaveReviewScreenProps {
  navigation?: any;
  route?: any;
}

const LeaveReviewScreen: React.FC<LeaveReviewScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const { ratingReview, ratingReviewErr, loader } = useSelector(
    (state: any) => state.auth
  );

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const bookingData = route?.params?.bookingData;

  const handleSubmit = () => {
    if (rating === 0) {
      showToast(
        "error",
        "Please select a rating before submitting your review."
      );
      return;
    }

    if (bookingData) {
      const ratingData = {
        bookingId: bookingData._id || bookingData.id,
        eventId: bookingData.eventId?._id || bookingData.eventId?.id,
        rating: rating,
        review: reviewText.trim(),
      };

      dispatch(onRatingReview(ratingData));
    }
  };

  useEffect(() => {
    if (ratingReview && ratingReview.status === 1 && ratingReview.data) {
      showToast("success", ratingReview.message);
      setTimeout(() => {
        navigation?.goBack();
      }, 2000);
    }
  }, [ratingReview]);

  useEffect(() => {
    if (ratingReviewErr) {
      showToast("error", "Failed to submit review. Please try again.");
    }
  }, [ratingReviewErr]);

  const handleFavoritePress = async () => {
    const hasPermission = await handleRestrictedAction(
      "canLike",
      navigation,
      "like this event"
    );

    if (hasPermission) {
      console.log("User has permission to like");
    } else {
      showToast("error", "Please sign in to like this event.");
    }
  };

  const handleEventPress = () => {
    console.log("Navigate to event details");
  };

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
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Leave Review</Text>
            <View style={styles.placeholder} />
          </View>

          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.eventCard}>
                <View style={styles.cardTopSection}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri:
                          bookingData?.eventId?.photos?.[0] ||
                          "https://via.placeholder.com/150",
                      }}
                      style={styles.eventImage}
                    />
                    {/* <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={handleFavoritePress}
                    >
                      <HeartIcon
                        size={20}
                        color={colors.white}
                        filled={false}
                      />
                    </TouchableOpacity> */}
                  </View>

                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>
                          {bookingData?.type || "Event"}
                        </Text>
                      </View>
                      <Text style={styles.priceText}>
                        ${bookingData?.fees || "0"}
                      </Text>
                    </View>

                    <Text style={styles.eventName}>
                      {bookingData?.eventId?.name || "Event Name"}
                    </Text>

                    <View style={styles.detailsRow}>
                      <LocationFavourite size={14} color={colors.violate} />
                      <Text style={styles.detailText}>
                        {bookingData?.eventId?.address ||
                          "Location not available"}
                      </Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <ClockIcon size={14} color={colors.violate} />
                      <Text style={styles.detailText}>
                        {bookingData?.bookingStartDate
                          ? new Date(
                              bookingData.bookingStartDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            }) +
                            " - " +
                            (bookingData?.eventId?.openingTime
                              ? (() => {
                                  const [hours, minutes] =
                                    bookingData.eventId.openingTime.split(":");
                                  const hour24 = parseInt(hours);
                                  const hour12 =
                                    hour24 === 0
                                      ? 12
                                      : hour24 > 12
                                      ? hour24 - 12
                                      : hour24;
                                  const ampm = hour24 >= 12 ? "PM" : "AM";
                                  return `${hour12}:${minutes} ${ampm}`;
                                })()
                              : "Time not available")
                          : "Date not available"}
                      </Text>
                    </View>

                    {/* <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleEventPress}
                    >
                      <ArrowRightIcon size={16} color={colors.white} />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.experienceTitle}>
                  How was your Experience?
                </Text>

                <View style={styles.separator} />

                <Text style={styles.ratingLabel}>Your Overall rating</Text>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={28}
                />
                <View style={styles.separatorsecond} />
                <Text style={styles.detailsLabel}>Add details review</Text>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Enter here"
                  placeholderTextColor={colors.textColor}
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.submitContainer}>
            <Buttons
              title={loader ? "Submitting..." : "Submit"}
              onPress={handleSubmit}
              disabled={loader || (rating === 0 && reviewText.trim() === "")}
              style={[
                styles.submitButton,
                {
                  opacity:
                    loader || (rating === 0 && reviewText.trim() === "")
                      ? 0.5
                      : 1,
                },
              ]}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LeaveReviewScreen;
