// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import styles from './styles';
// import FavouriteIcon from "../../../../../../assets/svg/favouriteIcon";
// import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
// import ClockIcon from "../../../../../../assets/svg/clockIcon";
// import ArrowRightIcon from "../../../../../../assets/svg/arrowRightIcon";
// import { colors } from '../../../../../../utilis/colors';

// interface NearbyEventCardProps {
//   title?: string;
//   location?: string;
//   date?: string;
//   price?: string;
//   tag?: string;
//   image?: string;
//   onPress?: () => void;
//   onFavoritePress?: (isFavorite: boolean) => void;
// }

// const NearbyEventCard: React.FC<NearbyEventCardProps> = ({ 
//   title = "Neon Nights", 
//   location = "New York, USA",
//   date = "Sep 4 - 10:00 PM", 
//   price = "$500",
//   tag = "DJ Nights",
//   image = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
//   onPress,
//   onFavoritePress 
// }) => {
//   const [isFavorite, setIsFavorite] = useState(false);

//   const handleFavoritePress = () => {
//     setIsFavorite(!isFavorite);
//     onFavoritePress && onFavoritePress(!isFavorite);
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       {/* Left Side - Event Image */}
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: image }} style={styles.eventImage} resizeMode="cover" />
        
//         {/* Heart Icon - Top Left */}
//         <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
//           <View style={styles.heartIconContainer}>
//             <FavouriteIcon isFilled={isFavorite} />
//           </View>
//         </TouchableOpacity>
        
//         {/* Tag - Top Right */}
//         <View style={styles.tagContainer}>
//           <Text style={styles.tagText}>{tag}</Text>
//         </View>
//       </View>
      
//       {/* Right Side - Event Content */}
//       <View style={styles.content}>
//         {/* Price - Top Right */}
//         <Text style={styles.price}>{price}</Text>
        
//         {/* Event Title */}
//         <Text style={styles.title}>{title}</Text>
        
//         {/* Location with icon */}
//         <View style={styles.detailRow}>
//           <LocationFavourite />
//           <Text style={styles.detailText}>{location}</Text>
//         </View>
        
//         {/* Date with icon */}
//         <View style={styles.detailRow}>
//           <ClockIcon />
//           <Text style={styles.detailText}>{date}</Text>
//         </View>
        
//         {/* Arrow Button - Bottom Right */}
//         <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
//           <ArrowRightIcon />
//         </TouchableOpacity>
       
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default NearbyEventCard;

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";
import HeartIcon from "../../../../../../assets/svg/heartIcon";
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
  onFavoritePress: () => void;
}

const NearbyEventCard: React.FC<NearbyEventCardProps> = ({
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
            <LocationFavourite size={14} color={colors.violate} />
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

export default NearbyEventCard;
