import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

// SVG Icons
import BackArrowIcon from '../../../../../../assets/svg/backIcon';
import ShareIcon from '../../../../../../assets/svg/shareIcon';
import BookmarkIcon from '../../../../../../assets/svg/bookmarkIcon';
import HeartIcon from '../../../../../../assets/svg/heartIcon';
import StarIcon from '../../../../../../assets/svg/starIcon';
import LocationFavourite from '../../../../../../assets/svg/locationFavourite';
import ClockIcon from '../../../../../../assets/svg/clockIcon';
import MessageIcon from '../../../../../../assets/svg/messageIcon';
import PhoneIcon from '../../../../../../assets/svg/phoneIcon';
import CocktailIcon from '../../../../../../assets/svg/cocktailIcon';
import DinnerIcon from '../../../../../../assets/svg/dinnerIcon';
import MusicIcon from '../../../../../../assets/svg/musicIcon';
import DanceIcon from '../../../../../../assets/svg/danceIcon';
import EventCard from '../../card/featuredEvent/featuredEvent';
import MapView, { Marker } from 'react-native-maps';

const ClubDetailScreen = () => {
  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedLounge, setSelectedLounge] = useState('crystal');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [viewedMap, setViewedMap] = useState(false);

  const facilities = [
    { id: 'welcome', title: '🍸 Welcome Drinks', icon: <CocktailIcon size={16} color={colors.white} /> },
    { id: 'dinner', title: '🍽️ 5-Course Dinner', icon: <DinnerIcon size={16} color={colors.white} /> },
    { id: 'music', title: '🎵 Live Band & DJ', icon: <MusicIcon size={16} color={colors.white} /> },
    { id: 'dance', title: '💃 Dance Floor', icon: <DanceIcon size={16} color={colors.white} /> },
    { id: 'lounge', title: '🍸 Lounge Access', icon: <CocktailIcon size={16} color={colors.white} /> },
  ];

  const location = {
    latitude: 43.6532, // Example coordinates for Toronto, Canada
    longitude: -79.3832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const lounges = [
    {
      id: 'crystal',
      name: 'Crystal Lounge',
      type: 'VIP Booth',
      capacity: '4 People',
      originalPrice: 500,
      discountedPrice: 450,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    },
    {
      id: 'velvet',
      name: 'Velvet Co',
      type: 'Family Booth',
      capacity: '4 People',
      originalPrice: 400,
      discountedPrice: 350,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
    },
  ];


const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];

  const handleLoungeSelect = (loungeId: string) => {
    setSelectedLounge(loungeId);
  };

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facilityId) 
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleMapView = () => {
    setViewedMap(true);
    console.log('Map viewed by user');
  };

  const getTotalPrice = () => {
    const selectedLoungeData = lounges.find(lounge => lounge.id === selectedLounge);
    return selectedLoungeData ? selectedLoungeData.discountedPrice + 100 : 550; // +100 for base event price
  };

  const handleBookNow = () => {
    // Collect all selected values
    const selectedLoungeData = lounges.find(lounge => lounge.id === selectedLounge);
    const selectedFacilitiesData = facilities.filter(facility => selectedFacilities.includes(facility.id));
    
    const selectedValues = {
      selectedLounge: selectedLounge,
      selectedLoungeData: selectedLoungeData,
      isBookmarked: isBookmarked,
      isLiked: isLiked,
      totalPrice: getTotalPrice(),
      eventDetails: {
        title: 'Gala Night of Hilarious Comedy at The Club',
        location: 'Bartonfort, Canada',
        date: 'Aug 03 - 06 - 10:00 PM',
        rating: '4.8',
        category: 'Club'
      },
      selectedFacilities: selectedFacilitiesData,
      allFacilities: facilities.map(facility => facility.title),
      organizer: {
        name: 'SonicVibe Events',
        role: 'Organize Team'
      },
      address: '125 King Street West, Bartonfort, Canada, L3B 4K8',
      userInteractions: {
        viewedMap: viewedMap,
        bookmarked: isBookmarked,
        liked: isLiked
      }
    };

    console.log('=== BOOKING DETAILS ===');
    console.log('Selected Lounge ID:', selectedValues.selectedLounge);
    console.log('Selected Lounge Data:', selectedValues.selectedLoungeData);
    console.log('Total Price: $' + selectedValues.totalPrice);
    console.log('Event Details:', selectedValues.eventDetails);
    console.log('Selected Facilities:', selectedValues.selectedFacilities);
    console.log('All Available Facilities:', selectedValues.allFacilities);
    console.log('Organizer:', selectedValues.organizer);
    console.log('Address:', selectedValues.address);
    console.log('User Interactions:', selectedValues.userInteractions);
    console.log('=======================');

    // You can also use Alert to show the data on screen
    // Alert.alert('Booking Details', JSON.stringify(selectedValues, null, 2));

    // Handle booking logic here
    navigation.navigate("ClubDetailScreen" as never);
  };

  const handleFavorite = (isFavorite: boolean) => {
    console.log('Favorite status:', isFavorite);
    // Handle favorite logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header with Club Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        {/* Overlay Gradient */}
        <View style={styles.imageOverlay} />

        {/* Top Navigation */}
        <View style={styles.topNavigation}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackArrowIcon size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={[styles.rightIcons, { marginTop: verticalScale(10) }]}>
            <TouchableOpacity style={styles.iconButton}>
              <ShareIcon size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <BookmarkIcon size={20} color={isBookmarked ? colors.violate : colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsLiked(!isLiked)}
            >
              <HeartIcon size={20} color={isLiked ? colors.violate : colors.white} />
            </TouchableOpacity>
          </View>
        </View>


      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>Club</Text>
            </View>
            <View style={styles.ratingContainer}>
              <StarIcon size={16} color={colors.yellow} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          <Text style={styles.eventTitle}>Gala Night of Hilarious Comedy at The Club</Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <LocationFavourite size={16} color={colors.violate} />
              <Text style={styles.detailText}>Bartonfort, Canada</Text>
            </View>
            <View style={styles.detailRow}>
              <ClockIcon size={16} color={colors.violate} />
              <Text style={styles.detailText}>Aug 03 - 06 - 10:00 PM</Text>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>
              Dance under dazzling neon lights with the hottest DJs in town. Your ultimate nightlife experience starts here.
            </Text>
          </View>

          {/* Booking Options */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.loungesContainer}
            >
              {lounges.map((lounge) => (
                <TouchableOpacity
                  key={lounge.id}
                  style={[
                    styles.loungeCard,
                    selectedLounge === lounge.id && styles.loungeCardSelected
                  ]}
                  onPress={() => handleLoungeSelect(lounge.id)}
                >
                  <Image source={{ uri: lounge.image }} style={styles.loungeImage} />
                  <View style={styles.loungeContent}>
                    <Text style={styles.loungeName}>{lounge.name}</Text>
                    <Text style={styles.loungeDetails}>
  <Text style={styles.loungeTitle}>Booth Type: </Text>
  <Text style={styles.loungeDetails}>{lounge.type}</Text>
  {'\n'}
  <Text style={styles.loungeTitle}>Capacity: </Text>
  <Text style={styles.loungeDetails}>{lounge.capacity}</Text>
</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                      style={[
                        styles.selectButton,
                        selectedLounge === lounge.id && styles.selectButtonSelected
                      ]}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        selectedLounge === lounge.id && styles.selectButtonTextSelected
                      ]}>
                        {selectedLounge === lounge.id ? 'Selected' : 'Select'}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPrice}>${lounge.originalPrice}</Text>
                      <Text style={styles.discountedPrice}>${lounge.discountedPrice}</Text>
                    </View>
                    </View>
                  
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Organizations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organizations</Text>
            <View style={styles.organizationCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                style={styles.organizerAvatar}
              />
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>SonicVibe Events</Text>
                <Text style={styles.organizerRole}>Organize Team</Text>
              </View>
              <View style={styles.contactIcons}>
                <TouchableOpacity style={styles.contactButton}>
                  <MessageIcon size={20} color={colors.violate} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <PhoneIcon size={20} color={colors.violate} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(16)}}>
             <Text style={styles.sectionTitle}>Address</Text>
             <TouchableOpacity style={styles.mapButton} onPress={handleMapView}>
                   <Text style={styles.mapButtonText}>View on Map</Text>
                 </TouchableOpacity></View>

            <View style={styles.addressRow}>
                  <LocationFavourite size={16} color={colors.violate} />
                  <Text style={styles.addressText}>125 King Street West, Bartonfort, Canada, L3B 4K8</Text>
                </View>
                
            
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={location}
                customMapStyle={mapStyle} // Apply custom styling
                scrollEnabled={false} // Disable scrolling if you want it to be static
                zoomEnabled={false} // Disable zoom if you want it to be static
              >
                <Marker
                  coordinate={location}
                  pinColor={colors.violate}
                >
                  <View style={styles.mapPin}>
                    <LocationFavourite size={24} color={colors.white} />
                  </View>
                </Marker>
              </MapView>
            </View>
          </View>
           {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
           <View style={styles.facilitiesContainer}>
             {facilities.map((facility) => (
               <TouchableOpacity 
                 key={facility.id} 
                 style={[
                   styles.facilityButton,
                   selectedFacilities.includes(facility.id) && styles.facilityButtonSelected
                 ]}
                 onPress={() => handleFacilityToggle(facility.id)}
               >
                 {/* {facility.icon} */}
                 <Text style={[
                   styles.facilityText,
                   selectedFacilities.includes(facility.id) && styles.facilityTextSelected
                 ]}>
                   {facility.title}
                 </Text>
               </TouchableOpacity>
             ))}
           </View>
        </View>
        </View>
        <View style={{marginTop: verticalScale(100)}}></View>
    </ScrollView>
  

      {/* Bottom Booking Bar */ }
  <View style={styles.bottomBar}>
    <View style={styles.priceSection}>
      <Text style={styles.totalPriceLabel}>Total Price</Text>
      <Text style={styles.totalPriceValue}>${getTotalPrice()}</Text>
    </View>
    <TouchableOpacity style={styles.bookNowButton}>
      <Text style={styles.bookNowText}>Book Now</Text>
    </TouchableOpacity>
    <View style={{marginTop: verticalScale(80)}}></View>
  </View>
    </SafeAreaView >
  );
};

export default ClubDetailScreen;
