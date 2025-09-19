import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import EventCard from '../../../../../screen/dashboard/user/homeScreen/card/featuredEvent/featuredEvent';
import BackIcon from '../../../../../assets/svg/backIcon';
import SearchIcon from '../../../../../assets/svg/searchIcon';
import { colors } from '../../../../../utilis/colors';
import Filtericon from '../../../../../assets/svg/filtericon';
import Blox from '../../../../../assets/svg/blox';
import { BackButton } from '../../../../../components/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import { LocationProvider, useLocation } from '../../../../../contexts/LocationContext';
import LocationDisplay from '../../../../../components/LocationDisplay';
import {
  onHome,
  homeData,
  homeError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
  onFilter,
} from '../../../../../redux/auth/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrentLocationIcon from '../../../../../assets/svg/currentLocationIcon';
import FilterScreen from '../FilterScreen/FilterScreen';

// Sample data for floating avatars (people/events)
const nearbyPeople = [
  {
    id: '1',
    name: 'DJ Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format',
    distance: '2.8 km',
    position: { latitude: 45.516, longitude: -73.556 },
    type: 'dj'
  },
  {
    id: '2',
    name: 'Mike Events',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    distance: '4.5 km',
    position: { latitude: 45.518, longitude: -73.558 },
    type: 'event'
  },
  {
    id: '3',
    name: 'Singer Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
    distance: '1.5 km',
    position: { latitude: 45.514, longitude: -73.560 },
    type: 'singer',
    isHighlighted: true
  },
  {
    id: '4',
    name: 'Club Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
    distance: '3.4 km',
    position: { latitude: 45.512, longitude: -73.562 },
    type: 'manager'
  },
  {
    id: '5',
    name: 'Party Host',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    distance: '1.1 km',
    position: { latitude: 45.520, longitude: -73.564 },
    type: 'host'
  }
];

// Sample featured events data
const featuredEvents = [
  {
    id: "1",
    name: "Friday Night Party",
    category: "DJ Nights",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$120",
    image: {
      uri: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Echoe",
    category: "Live Music",
    location: "Montreal, QC",
    date: "Sept 2",
    time: "9:00 PM",
    price: "$99",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: false,
    rating: 4.5,
  }
];

// Custom dark purple map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#8d34ff" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#3d015d" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  }
];

const ExploreScreenContent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef<MapView>(null);
  const [searchVal, setSearchVal] = useState('');
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 23.012649201096547, // Default coordinates from home screen
    longitude: 72.51123340677258,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [mapReady, setMapReady] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: 23.012649201096547,
    longitude: 72.51123340677258,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const dispatch = useDispatch();
  const home = useSelector((state: any) => state.auth.home);
  const homeErr = useSelector((state: any) => state.auth.homeErr);
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector((state: any) => state.auth.togglefavoriteErr);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };

  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };

  const handleFilterApply = (filterValues: any) => {
    console.log('=== FILTER APPLY CALLED ===');
    console.log('Filter Values:', filterValues);
    
    // Format the filter data according to API requirements
    const filterPayload = {
      lat: "23.0126",
      long: "72.5112",
      categoryId: filterValues?.selectedCategory?.id !== 'all' ? filterValues?.selectedCategory?.id : undefined,
      minPrice: filterValues?.priceRange?.min || 0,
      maxPrice: filterValues?.priceRange?.max || 3000,
      date: filterValues?.selectedDate?.formattedDate || new Date().toISOString().split('T')[0],
      minDistance: filterValues?.distanceRange?.min || 0,
      maxDistance: filterValues?.distanceRange?.max || 20,
      userId: userId || "68c147b05f4b76754d914383" // fallback user ID
    };

    console.log('Filter Payload:', filterPayload);
    
    // Call filter API
    dispatch(onFilter(filterPayload));
    
    // Navigate to FilterListScreen
    navigation.navigate("FilterListScreen" as never);
  };

  useEffect(() => {
    requestLocationPermission();
    getUserID();
    
    // Check if events were passed from navigation
    const routeParams = route.params as any;
    if (routeParams?.nearbyEvents && routeParams.nearbyEvents.length > 0) {
      setNearbyEvents(routeParams.nearbyEvents);
      // Calculate map bounds for passed nearby events
      setTimeout(() => {
        calculateMapBounds(routeParams.nearbyEvents);
      }, 500);
    } else {
      fetchNearbyData();
    }
    
    if (routeParams?.featuredEvents && routeParams.featuredEvents.length > 0) {
      setFeaturedEvents(routeParams.featuredEvents);
    }
  }, []);

  // Get user ID from AsyncStorage
  const getUserID = async (): Promise<string | null> => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData?.id || '';
        setUserId(userId);
        return userId;
      }
      return null;
    } catch (error) {
      console.log('Error getting user ID:', error);
      return null;
    }
  };

  // Fetch nearby data
  const fetchNearbyData = async () => {
    const userId = await getUserID();
    dispatch(onHome({
      lat: currentLocation.longitude.toString(),
      long: currentLocation.latitude.toString(),
      userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
    }));
  };

  // Handle API response
  useEffect(() => {
    if (
      home?.status === true ||
      home?.status === 'true' ||
      home?.status === 1 ||
      home?.status === "1"
    ) {
      console.log("home data in explore screen:", home);
      if (home?.data?.nearby) {
        setNearbyEvents(home.data.nearby);
        // Calculate map bounds to show all nearby events
        setTimeout(() => {
          calculateMapBounds(home.data.nearby);
        }, 500); // Small delay to ensure map is ready
      }
      if (home?.data?.featured) {
        setFeaturedEvents(home.data.featured);
      }
      dispatch(homeData(''));
    }

    if (homeErr) {
      console.log("homeErr in explore screen:", homeErr);
      dispatch(homeError(''));
    }
  }, [home, homeErr, dispatch]);

  // Handle toggle favorite API response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === 'true' ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("togglefavorite response in explore screen:", togglefavorite);
      // Update the favorite status in the nearby events
      if (togglefavorite?.data?.eventId) {
        setNearbyEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === togglefavorite.data.eventId 
              ? { ...event, isFavorite: togglefavorite.data.isFavorite }
              : event
          )
        );
      }
      dispatch(togglefavoriteData(''));
    }

    if (togglefavoriteErr) {
      console.log("togglefavoriteErr in explore screen:", togglefavoriteErr);
      dispatch(togglefavoriteError(''));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to location to show events on map',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleBookNow = (eventId?: string) => {
    console.log('Book Now clicked for event:', eventId);
    if (eventId) {
      (navigation as any).navigate("ClubDetailScreen", { clubId: eventId });
    }
  };

  const handleFavoritePress = (eventId: string) => {
    console.log('Toggling favorite for event ID:', eventId);
    dispatch(onTogglefavorite({ eventId }));
  };

  const onSearchClose = () => {
    setSearchVal('');
    // Reset to original data when search is cleared
    fetchNearbyData();
  };

  const handleSearch = async (searchText: string) => {
    setSearchVal(searchText);
    
    if (searchText.trim().length > 0) {
      const userId = await getUserID();
      dispatch(onHome({
        lat: currentLocation.longitude.toString(),
        long: currentLocation.latitude.toString(),
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
        search_keyword: searchText.trim(),
      }));
    } else {
      // If search is empty, fetch original data
      fetchNearbyData();
    }
  };

  const handleRefresh = () => {
    fetchNearbyData();
  };

  // Calculate map bounds to show all markers
  const calculateMapBounds = (events: any[]) => {
    if (events.length === 0) return;

    const coordinates = events
      .filter(event => event.coordinates && event.coordinates.coordinates)
      .map(event => {
        const [longitude, latitude] = event.coordinates.coordinates;
        return { latitude, longitude };
      });

    if (coordinates.length === 0) return;

    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const deltaLat = Math.max(maxLat - minLat, 0.01) * 1.2; // Add 20% padding
    const deltaLng = Math.max(maxLng - minLng, 0.01) * 1.2; // Add 20% padding

    const newRegion = {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLng,
    };

    // Only animate to the new region without updating state to prevent color changes
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  // Render nearby event markers
  const renderEventMarker = (event: any) => {
    if (!event.coordinates || !event.coordinates.coordinates) {
      return null;
    }

    const [longitude, latitude] = event.coordinates.coordinates;
    
    return (
      <Marker
        key={event._id || event.id}
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        onPress={() => {
          console.log('Event pressed:', event.name);
          // Navigate to event details
          (navigation as any).navigate("ClubDetailScreen", { clubId: event._id || event.id });
        }}
      >
        <View style={styles.eventMarker}>
          <Image 
            source={{ 
              uri: event.photos?.[0] || 'https://via.placeholder.com/60x60/2D014D/8D34FF?text=Event' 
            }} 
            style={styles.eventMarkerImage} 
          />
          <Text style={styles.eventMarkerDistance}>
            {event.distance || '0.0 km'}
          </Text>
        </View>
      </Marker>
    );
  };

  const renderAvatarMarker = (person: any) => (
    <Marker
      key={person.id}
      coordinate={person.position}
      onPress={() => console.log('Avatar pressed:', person.name)}
    >
      <View style={[
        styles.avatarMarker,
        person.isHighlighted && styles.highlightedAvatarMarker
      ]}>
        <Image source={{ uri: person.avatar }} style={styles.avatarImage} />
        <Text style={styles.distanceText}>{person.distance}</Text>
      </View>
    </Marker>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Full Screen Map */}
      {!mapReady && (
        <View style={styles.mapLoadingContainer}>
          <Text style={styles.mapLoadingText}>Loading Map...</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.fullScreenMap}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        customMapStyle={mapStyle}
        onMapReady={() => {
          console.log('Map is ready');
          setMapReady(true);
        }}
        onMapLoaded={() => {
          console.log('Map loaded');
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor={colors.violate}
        loadingBackgroundColor={colors.backgroundColor}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        userInterfaceStyle="dark"
        tintColor={colors.violate}
      >
        {/* User Location Marker */}
        <Marker 
          coordinate={currentLocation} 
          title="Your Location"
          description="You are here"
        >
          <View style={styles.userLocationMarker}>
            <CurrentLocationIcon size={32} color={colors.violate} />
          </View>
        </Marker>
        
        {/* Nearby Event Markers */}
        {nearbyEvents.length > 0 ? nearbyEvents.map(renderEventMarker) : null}
      </MapView>

      {/* Overlay Content */}
      <View style={styles.overlayContainer}>
        {/* Top Section - Location & Back Button */}
        <View style={styles.topSection}>
          <View style={styles.locationRow}>
            <LocationDisplay 
              showRefreshButton={true}
              style={{ flex: 1 }}
              textStyle={styles.locationText}
            />
            <TouchableOpacity style={styles.filterButton}>
              <BackButton navigation={navigation} onBackPress={()=> navigation.goBack()} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.topSection}>
         
          <View style={styles.inputContainer}>
            <SearchIcon size={18} color={colors.violate} />
            <TextInput
              value={searchVal}
              onChangeText={handleSearch}
              style={styles.input}
              placeholder="Search clubs, events, Bars,..."
              placeholderTextColor={'#9CA3AF'}
            />
            {searchVal && (
              <TouchableOpacity onPress={onSearchClose}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
              <Filtericon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => navigation.goBack()}>
             <Blox />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Featured Events Carousel */}
      <View style={styles.featuredSection}>
        <Text style={styles.featuredTitle}>Featured ({featuredEvents.length})</Text>
        <FlatList
          data={featuredEvents.length > 0 ? featuredEvents : []}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredEventsContainer}
          keyExtractor={(item, index) => (item as any)._id || index.toString()}
          renderItem={({ item }) => (
            <EventCard
              title={(item as any).name}
              location={(item as any).address}
              date={new Date((item as any).startDate).toLocaleDateString()}
              price={`$${(item as any).entryFee}`}
              tag={(item as any).type}
              image={(item as any).photos?.[0] || ''}
              rating={4.5}
              isFavorite={(item as any).isFavorite || false}
              onBookNow={() => handleBookNow((item as any)._id)}
              onFavoritePress={() => handleFavoritePress((item as any)._id)}
              _id={(item as any)._id}
            />
          )}
        />
      </View>
      <FilterScreen
        visible={isFilterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />
    </View>
  );
};

const ExploreScreen = () => {
  return (
    <LocationProvider>
      <ExploreScreenContent />
    </LocationProvider>
  );
};

export default ExploreScreen;