import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";
import HeartIcon from "../assets/svg/heartIcon";
import LocationIcon from "../assets/svg/locationIcon";
import ClockIcon from "../assets/svg/clockIcon";
import ArrowRightIcon from "../assets/svg/arrowRightIcon";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    category: string;
    location: string;
    date: string;
    time: string;
    price: string;
    image: any;
    isFavorite: boolean;
  };
  onPress: () => void;
  onFavoritePress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={event.image} style={styles.eventImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <HeartIcon size={20} color={colors.white} filled={event.isFavorite} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>

        <Text style={styles.eventName}>{event.name}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <LocationIcon size={14} color={colors.violate} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <ClockIcon size={14} color={colors.violate} />
            <Text style={styles.detailText}>
              {event.date} - {event.time}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <ArrowRightIcon size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    width: horizontalScale(334),
    height: verticalScale(110),
    borderRadius: verticalScale(16),
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(8),
    padding: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    opacity: 1,
    alignItems: "center",
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    marginRight: horizontalScale(8),
  },
  eventImage: {
    width: horizontalScale(120),
    height: verticalScale(90),
    borderRadius: verticalScale(14),
  },
  favoriteButton: {
    position: "absolute",
    top: verticalScale(8),
    left: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryTag: {
    backgroundColor: colors.categoryBackground,
    height: verticalScale(16),
    borderRadius: verticalScale(90),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(10),
    paddingHorizontal: horizontalScale(12),
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: fontScale(10),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  priceText: {
    fontSize: fontScale(16),
    fontWeight: "800",
    lineHeight: fontScale(20),
    fontFamily: fonts.ExtraBold,
    color: colors.white,
    marginTop: verticalScale(10),
  },
  eventName: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(5),
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: horizontalScale(20),
    height: verticalScale(20),
    borderRadius: verticalScale(20),
    backgroundColor: colors.primary_blue,
    justifyContent: "center",
  },
});

export default EventCard;
