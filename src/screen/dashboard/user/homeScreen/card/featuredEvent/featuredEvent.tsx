import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import styles from './styles';
import StarIcon from "../../../../../../assets/svg/starIcon";
import FavouriteIcon from "../../../../../../assets/svg/favouriteIcon";
import HeartIcon from "../../../../../../assets/svg/heartIcon";
import LocationIcon from "../../../../../../assets/svg/locationIcon";
import ClockIcon from "../../../../../../assets/svg/clockIcon";
import { colors } from '../../../../../../utilis/colors';
import LocationFavourite from '../../../../../../assets/svg/locationFavourite';

interface EventCardProps {
  title?: string;
  event?: any;
  rating?: number;
  location?: string;
  date?: string;
  price?: string;
  tag?: string;
  image?: string;
  isFavorite?: boolean;
  onBookNow?: () => void;
  onFavoritePress?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  event,
  rating = 4.8, 
  location, 
  date, 
  price,
  tag,
  image,
  isFavorite = false,
  onBookNow,
  onFavoritePress 
}) => {

  const handleFavoritePress = () => {
    if (!event?._id && !event?.id) {
      Alert.alert('Error', 'Event ID not available');
      return;
    }

    const eventId = event?._id || event?.id;
    console.log('Featured Event - Toggling favorite for event ID:', eventId);
    
    // Call the parent's onFavoritePress function
    if (onFavoritePress) {
      onFavoritePress(eventId);
    }
  };

  return (
    <View style={styles.card}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.eventImage} resizeMode="cover" />
        
        {/* Heart Icon - Top Left */}
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <View style={styles.heartIconContainer}>
            {isFavorite ? (
              <FavouriteIcon size={20} color={colors.violate} />
            ) : (
              <HeartIcon size={20} color={colors.white} />
            )}
          </View>
        </TouchableOpacity>
        
        {/* Tag - Top Right */}
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>
      
      {/* Event Content */}
      <View style={styles.content}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.StarRating}>⭐ {rating}</Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.locationContainer}>
           <LocationFavourite size={14} color={colors.violate} />
           <Text numberOfLines={2} style={styles.detailText}>{location}</Text>
           </View>
           <View style={styles.dateContainer}>
             <ClockIcon />
             <Text style={styles.detailText}>{date}</Text>
           </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={onBookNow}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventCard;