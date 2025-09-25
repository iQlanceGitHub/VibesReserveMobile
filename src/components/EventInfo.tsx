import React from "react";
import { View, Text } from "react-native";
import { colors } from "../utilis/colors";
import LocationFavourite from "../assets/svg/locationFavourite";
import ClockIcon from "../assets/svg/clockIcon";
import StarIcon from "../assets/svg/starIcon";
import styles from "./eventInfoStyles";

interface EventInfoProps {
  eventName: string;
  location: string;
  date: string;
  time: string;
  rating: number;
  totalPrice: string;
}

const EventInfo: React.FC<EventInfoProps> = ({
  eventName,
  location,
  date,
  time,
  rating,
  totalPrice,
}) => {
  const renderStars = () => {
    return <StarIcon size={16} color={colors.yellow} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventHeader}>
        <View style={styles.eventDetails}>
          <View style={styles.eventNameRow}>
            <Text style={styles.eventName} numberOfLines={1}>
              {eventName}
            </Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingValue}>{rating}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <LocationFavourite width={16} height={16} color={colors.white} />
            <Text style={styles.detailText}>{location}</Text>
          </View>
          <View style={styles.detailRow}>
            <ClockIcon size={16} color={colors.white} />
            <Text style={styles.detailText}>{date}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>{totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

export default EventInfo;
