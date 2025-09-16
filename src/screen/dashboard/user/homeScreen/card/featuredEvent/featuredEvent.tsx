import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import styles from './styles';
import StarIcon from "../../../../../../assets/svg/starIcon";
import FavouriteIcon from "../../../../../../assets/svg/favouriteIcon";
import LocationIcon from "../../../../../../assets/svg/locationIcon";
import ClockIcon from "../../../../../../assets/svg/clockIcon";
import { colors } from '../../../../../../utilis/colors';
import LocationFavourite from '../../../../../../assets/svg/locationFavourite';
import { flush } from 'redux-saga/effects';

interface EventCardProps {
  title?: string;
  rating?: number;
  location?: string;
  date?: string;
  price?: string;
  tag?: string;
  image?: string;
  onBookNow?: () => void;
  onFavoritePress?: (isFavorite: boolean) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title = "Friday Night Party", 
  rating = 4.8, 
  location = "Bartonfort, Canada", 
  date = "Aug 29 - 10:00 PM", 
  price = "$120",
  tag = "DJ Nights",
  image = "https://images.unsplash.com/photo-1464983953574-0892a716854b",
  onBookNow,
  onFavoritePress 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    onFavoritePress && onFavoritePress(!isFavorite);
  };

  return (
    <View style={styles.card}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.eventImage} resizeMode="cover" />
        
        {/* Heart Icon - Top Left */}
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <View style={styles.heartIconContainer}>
            <FavouriteIcon isFilled={isFavorite} />
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
        <Text style={styles.StarRating}>⭐ {4.8}</Text>
        </View>

        <View style={styles.detailRow}>
          <View style={{flex: 1 , flexDirection: 'row',}}>
           <LocationFavourite size={14} color={colors.violate} />
           <Text style={styles.detailText}>{location}</Text>
           </View>
           <ClockIcon />
           <Text style={styles.detailText}>{date}</Text>
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