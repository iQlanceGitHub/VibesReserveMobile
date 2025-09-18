import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Linking,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

//API
import {
  onViewdetails,
  viewdetailsData,
  viewdetailsError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
} from '../../../../../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SVG Icons
import BackArrowIcon from '../../../../../../assets/svg/backIcon';
import ShareIcon from '../../../../../../assets/svg/shareIcon';
import BookmarkIcon from '../../../../../../assets/svg/bookmarkIcon';
import HeartIcon from '../../../../../../assets/svg/heartIcon';
import FavouriteIcon from '../../../../../../assets/svg/favouriteIcon';
import StarIcon from '../../../../../../assets/svg/starIcon';
import LocationFavourite from '../../../../../../assets/svg/locationFavourite';
import ClockIcon from '../../../../../../assets/svg/clockIcon';
import MessageIcon from '../../../../../../assets/svg/messageIcon';
import PhoneIcon from '../../../../../../assets/svg/phoneIcon';
import CocktailIcon from '../../../../../../assets/svg/cocktailIcon';
import MapView, { Marker } from 'react-native-maps';

const ClubDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedLounge, setSelectedLounge] = useState('crystal');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [viewedMap, setViewedMap] = useState(false);
  const [clubDetails, setClubDetails] = useState(null);
  const [msg, setMsg] = useState('');

  const dispatch = useDispatch();
  const viewdetails = useSelector((state: any) => state.auth.viewdetails);
  const viewdetailsErr = useSelector((state: any) => state.auth.viewdetailsErr);
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector((state: any) => state.auth.togglefavoriteErr);

  // Get club ID from route params
  const clubId = (route?.params as any)?.clubId || '68b6eceba9ae1fc590695248'; // fallback ID

  // Call Viewdetails API when component mounts
  useEffect(() => {
    if (clubId) {
      console.log('Calling Viewdetails API with ID:', clubId);
      dispatch(onViewdetails({ id: clubId }));
    }
  }, [clubId, dispatch]);

  // Handle Viewdetails API response
  useEffect(() => {
    if (
      viewdetails?.status === true ||
      viewdetails?.status === 'true' ||
      viewdetails?.status === 1 ||
      viewdetails?.status === "1"
    ) {
      console.log("viewdetails response:+>", viewdetails);
      setClubDetails(viewdetails?.data);

      // Initialize bookmark state based on club details
      if (viewdetails?.data?.isFavorite !== undefined) {
        setIsBookmarked(viewdetails.data.isFavorite);
      }

      dispatch(viewdetailsData(''));
    }

    if (viewdetailsErr) {
      console.log("viewdetailsErr:+>", viewdetailsErr);
      setMsg(viewdetailsErr?.message?.toString());
      dispatch(viewdetailsError(''));
    }
  }, [viewdetails, viewdetailsErr, dispatch]);

  // Handle Toggle Favorite API response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === 'true' ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("togglefavorite response:+>", togglefavorite);

      // Update bookmark state based on server response
      if (togglefavorite?.data?.isFavorite !== undefined) {
        setIsBookmarked(togglefavorite.data.isFavorite);
      } else {
        // Fallback: toggle current state
        setIsBookmarked((prev: boolean) => !prev);
      }

      dispatch(togglefavoriteData(''));
    }

    if (togglefavoriteErr) {
      console.log("togglefavoriteErr:+>", togglefavoriteErr);
      setMsg(togglefavoriteErr?.message?.toString());
      dispatch(togglefavoriteError(''));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  // Get facilities from API data or use default facilities
  const facilities = (clubDetails as any)?.facilities?.map((facility: any, index: number) => ({
    id: facility._id || `facility_${index}`,
    title: facility.name || 'Facility',
    icon: <CocktailIcon size={16} color={colors.white} />
  })) || [

    ];

  // Get coordinates from API data or use default
  const location = {
    latitude: (clubDetails as any)?.coordinates?.coordinates?.[1] || 43.6532,
    longitude: (clubDetails as any)?.coordinates?.coordinates?.[0] || -79.3832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Get lounges from API data or use empty array
  const lounges = (clubDetails as any)?.booths?.map((booth: any, index: number) => ({
    id: booth._id || `booth_${index}`,
    name: booth.boothName || 'Booth',
    type: booth.boothType?.name || 'VIP Booth',
    capacity: `${booth.capacity || 6} People`,
    originalPrice: booth.boothPrice || 1000,
    discountedPrice: booth.discountedPrice || 800,
    image: booth.boothImage?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
  })) || [];


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

  const openInMapApp = () => {
    if (!clubDetails) {
      Alert.alert('Error', 'Location data not available');
      return;
    }

    const latitude = (clubDetails as any)?.coordinates?.coordinates?.[1];
    const longitude = (clubDetails as any)?.coordinates?.coordinates?.[0];
    const address = (clubDetails as any)?.address;

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Coordinates not available');
      return;
    }

    const mapUrl = Platform.select({
      ios: `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(address || 'Club Location')})`,
    });

    const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    if (mapUrl) {
      Linking.canOpenURL(mapUrl).then((supported) => {
        if (supported) {
          Linking.openURL(mapUrl);
        } else {
          // Fallback to web version
          Linking.openURL(webUrl);
        }
      }).catch((err) => {
        console.error('Error opening map:', err);
        // Fallback to web version
        Linking.openURL(webUrl);
      });
    } else {
      // Fallback to web version
      Linking.openURL(webUrl);
    }
  };

  const handleShare = async () => {
    if (!clubDetails) {
      Alert.alert('Error', 'Club details not available');
      return;
    }

    const clubName = (clubDetails as any)?.name || 'Amazing Club';
    const clubAddress = (clubDetails as any)?.address || 'Great Location';
    const clubDetails_text = (clubDetails as any)?.details || 'Experience the best nightlife';
    const clubType = (clubDetails as any)?.type || 'Club';
    const entryFee = (clubDetails as any)?.entryFee || 'Free';

    // Create trendy share content
    const shareMessage = `🎉 Check out ${clubName}! 🎉

📍 ${clubAddress}

${clubDetails_text}

🏷️ Type: ${clubType}
💰 Entry: ₹${entryFee}

#Nightlife #Party #${clubType} #VibesReserve #Fun #Entertainment

Download VibesReserve app to discover more amazing venues! 🚀`;

    try {
      const result = await Share.share({
        message: shareMessage,
        title: `Discover ${clubName} on VibesReserve`,
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share content');
    }
  };

  const handleToggleFavorite = async () => {
    if (!clubDetails) {
      Alert.alert('Error', 'Club details not available');
      return;
    }

    const eventId = (clubDetails as any)?._id;
    if (!eventId) {
      Alert.alert('Error', 'Event ID not available');
      return;
    }

    // Debug: Check token before making API call
    try {
      const userToken = await AsyncStorage.getItem("user_token");
      const signinData = await AsyncStorage.getItem("signin");
      console.log('=== CLUB DETAIL TOKEN DEBUG ===');
      console.log('user_token (raw):', userToken);
      console.log('user_token type:', typeof userToken);
      console.log('user_token length:', userToken?.length);
      console.log('signin data (raw):', signinData);
      console.log('eventId:', eventId);

      // Test if token is valid JWT format
      if (userToken && userToken.includes('.')) {
        const parts = userToken.split('.');
        console.log('JWT parts count:', parts.length);
        if (parts.length === 3) {
          console.log('Token appears to be valid JWT format');
        } else {
          console.log('Token does not appear to be valid JWT format');
        }
      } else {
        console.log('Token does not contain dots - not JWT format');
      }
      console.log('================================');
    } catch (error) {
      console.log('Error retrieving token:', error);
    }

    console.log('Toggling favorite for event ID:', eventId);
    dispatch(onTogglefavorite({ eventId }));
  };

  const getTotalPrice = () => {
    const selectedLoungeData = lounges.find((lounge: any) => lounge.id === selectedLounge);
    return selectedLoungeData ? selectedLoungeData.discountedPrice + 100 : 0; // +100 for base event price
  };

  const handleBookNow = () => {
    // Collect all selected values
    const selectedLoungeData = lounges.find((lounge: any) => lounge.id === selectedLounge);
    const selectedFacilitiesData = facilities.filter((facility: any) => selectedFacilities.includes(facility.id));

    const selectedValues = {
      selectedLounge: selectedLounge,
      selectedLoungeData: selectedLoungeData,
      isBookmarked: isBookmarked,
      totalPrice: getTotalPrice(),
      eventDetails: {
        title: (clubDetails as any)?.name || 'Club Event',
        location: (clubDetails as any)?.address || 'Location',
        date: clubDetails ?
          `${new Date((clubDetails as any).startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${(clubDetails as any).openingTime}` :
          'Date',
        rating: '4.8',
        category: (clubDetails as any)?.type || 'Club'
      },
      selectedFacilities: selectedFacilitiesData,
      allFacilities: facilities.map((facility: any) => facility.title),
      organizer: {
        name: (clubDetails as any)?.userId?.fullName || 'Event Organizer',
        role: 'Organize Team'
      },
      address: (clubDetails as any)?.address || 'Address not available',
      userInteractions: {
        viewedMap: viewedMap,
        bookmarked: isBookmarked,
      }
    };

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
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <ShareIcon size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleToggleFavorite}
            >
              {/* {isBookmarked ? (
                <FavouriteIcon size={20} color={colors.violate} />
              ) : (
                <HeartIcon size={20} color={colors.white} />
              )} */}
              {/* {isBookmarked ? (
                <FavouriteIcon size={16} color={colors.violate} />
              ) : (
                <HeartIcon size={16} color={colors.white} />
              )} */}

              {isBookmarked ? (
                <HeartIcon size={20} color={colors.white} />
              ) : (
                <FavouriteIcon size={20} color={colors.violate} />
              )}
              
            </TouchableOpacity>
          </View>
        </View>


      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{(clubDetails as any)?.type || 'Club'}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <StarIcon size={16} color={colors.yellow} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          <Text style={styles.eventTitle}>{(clubDetails as any)?.name || 'Loading...'}</Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <LocationFavourite size={16} color={colors.violate} />
              <Text style={styles.detailText}>{(clubDetails as any)?.address || 'Loading...'}</Text>
            </View>
            <View style={styles.detailRow}>
              <ClockIcon size={16} color={colors.violate} />
              <Text style={styles.detailText}>
                {clubDetails ?
                  `${new Date((clubDetails as any).startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${(clubDetails as any).openingTime}` :
                  'Loading...'
                }
              </Text>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>
              {(clubDetails as any)?.details || 'Loading club details...'}
            </Text>
          </View>

          {/* Booking Options */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.loungesContainer}
            >
              {lounges.map((lounge: any) => (
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                <Text style={styles.organizerName}>{(clubDetails as any)?.userId?.fullName}</Text>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(16) }}>
              <Text style={styles.sectionTitle}>Address</Text>
              <TouchableOpacity style={styles.mapButton} onPress={openInMapApp}>
                <Text style={styles.mapButtonText}>View on Map</Text>
              </TouchableOpacity></View>

            <View style={styles.addressRow}>
              <LocationFavourite size={16} color={colors.violate} />
              <Text style={styles.addressText}>{(clubDetails as any)?.address || 'Loading address...'}</Text>
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
              {facilities.map((facility: any) => (
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
        <View style={{ marginTop: verticalScale(100) }}></View>
      </ScrollView>


      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>${getTotalPrice()}</Text>
        </View>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
        <View style={{ marginTop: verticalScale(80) }}></View>
      </View>
    </SafeAreaView >
  );
};

export default ClubDetailScreen;
