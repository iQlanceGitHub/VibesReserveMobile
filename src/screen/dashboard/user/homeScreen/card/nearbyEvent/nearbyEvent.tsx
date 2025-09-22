import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";
import HeartIcon from "../../../../../../assets/svg/heartIcon";
import FavouriteIcon from "../../../../../../assets/svg/favouriteIcon";
import LocationIcon from "../../../../../../assets/svg/locationIcon";
import ClockIcon from "../../../../../../assets/svg/clockIcon";
import ArrowRightIcon from "../../../../../../assets/svg/arrowRightIcon";
import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
import styles from './styles';

interface NearbyEventCardProps {
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
  onFavoritePress: (eventId: string) => void;
}

const NearbyEventCard: React.FC<NearbyEventCardProps> = ({
  event,
  onPress,
  onFavoritePress,
}) => {
  // Use isFavorite directly from event data
  const isFavorite = (event as any).isFavorite || false;

  const handleFavoritePress = () => {
    const eventId = (event as any)?._id || event?.id;
    if (!eventId) {
      Alert.alert('Error', 'Event ID not available');
      return;
    }

    console.log('Nearby Event - Toggling favorite for event ID:', eventId);
    
    // Call the parent's onFavoritePress function
    if (onFavoritePress) {
      onFavoritePress(eventId);
    }
  };

  // Format date to "Sep 4 - 10:00 PM" format
  const formatDateTime = (dateString: string, timeString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
      
      // Format time to 12-hour format
      let formattedTime = '';
      if (timeString) {
        try {
          const time = new Date(`2000-01-01T${timeString}`);
          formattedTime = time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch {
          formattedTime = timeString;
        }
      }
      
      return formattedTime ? `${formattedDate} - ${formattedTime}` : formattedDate;
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={(event as any).photos?.[0] ? { uri: (event as any).photos[0] } : { uri: 'https://via.placeholder.com/120x90/2D014D/8D34FF?text=Event' }} 
          style={styles.eventImage} 
          resizeMode="cover"
        />
        {/* Heart Icon - Top Left of Image */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          {isFavorite ? (
              <HeartIcon size={20} color={colors.white} />
            ) : (
              <FavouriteIcon size={20} color={colors.violate} />
            )}
          
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {/* Category Tag - Top Right Area */}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{event.type}</Text>
        </View>

        {/* Price - Top Right Corner */}
        <Text style={styles.priceText}>${(event as any).entryFee || event.price}</Text>

        {/* Event Title */}
        <Text style={styles.eventName}>{event.name}</Text>

        {/* Location */}
        <View style={styles.detailsRow}>
          <LocationFavourite size={14} color={colors.violate} />
          <Text style={styles.detailText} numberOfLines={1}>
            {(event as any).address || event.location}
          </Text>
        </View>

        {/* Date & Time */}
        <View style={styles.detailsRow}>
          <ClockIcon size={14} color={colors.violate} />
          <Text style={styles.detailText}>
            {formatDateTime((event as any).startDate || event.date, (event as any).openingTime || event.time)}
          </Text>
        </View>

        {/* Action Button - Bottom Right */}
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <ArrowRightIcon size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default NearbyEventCard;
