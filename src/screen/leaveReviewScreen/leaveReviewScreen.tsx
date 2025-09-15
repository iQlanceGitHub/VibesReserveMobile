import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
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

interface LeaveReviewScreenProps {
  navigation?: any;
}

// Sample event data
const sampleEvent = {
  id: "1",
  name: "Gala Night of Hilarious Comedy at The Club",
  category: "DJ Nights",
  location: "New York, USA",
  date: "Sep 4",
  time: "10:00 PM",
  price: "$500",
  image: {
    uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
  },
  isFavorite: true,
};

const LeaveReviewScreen: React.FC<LeaveReviewScreenProps> = ({
  navigation,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    navigation?.goBack();
  };

  const handleFavoritePress = () => {
    // Handle favorite toggle
    console.log("Toggle favorite");
  };

  const handleEventPress = () => {
    // Handle event details navigation
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
                      source={sampleEvent.image}
                      style={styles.eventImage}
                    />
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={handleFavoritePress}
                    >
                      <HeartIcon
                        size={20}
                        color={colors.white}
                        filled={sampleEvent.isFavorite}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>
                          {sampleEvent.category}
                        </Text>
                      </View>
                      <Text style={styles.priceText}>{sampleEvent.price}</Text>
                    </View>

                    <Text style={styles.eventName}>{sampleEvent.name}</Text>

                    <View style={styles.detailsRow}>
                      <LocationFavourite size={14} color={colors.violate} />
                      <Text style={styles.detailText}>
                        {sampleEvent.location}
                      </Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <ClockIcon size={14} color={colors.violate} />
                      <Text style={styles.detailText}>
                        {sampleEvent.date} - {sampleEvent.time}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleEventPress}
                    >
                      <ArrowRightIcon size={16} color={colors.white} />
                    </TouchableOpacity>
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
              title="Submit"
              onPress={handleSubmit}
              disabled={rating === 0 && reviewText.trim() === ""}
              style={[
                styles.submitButton,
                { opacity: rating === 0 && reviewText.trim() === "" ? 0.5 : 1 },
              ]}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LeaveReviewScreen;
