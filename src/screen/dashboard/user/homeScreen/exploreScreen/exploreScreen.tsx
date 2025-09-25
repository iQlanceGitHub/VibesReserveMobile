
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
  Dimensions,
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

const { width, height } = Dimensions.get('window');

const ExploreScreenContent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef<MapView>(null);
  const [searchVal, setSearchVal] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  
  // Default coordinates for Ahmedabad, India with larger delta for better view
  const [mapRegion, setMapRegion] = useState({
    latitude: 23.0225,
    longitude: 72.5714,
    latitudeDelta: 0.5,  // Increased for better visibility
    longitudeDelta: 0.5, // Increased for better visibility
  });

  // Force map ready after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapReady) {
        console.log('Map loading timeout - forcing map ready');
        setMapReady(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [mapReady]);

  // Force map ready after component mount
  useEffect(() => {
    const forceReady = setTimeout(() => {
      console.log('Forcing map ready after 5 seconds');
      setMapReady(true);
    }, 5000);

    return () => clearTimeout(forceReady);
  }, []);

  const dispatch = useDispatch();
  const home = useSelector((state: any) => state.auth.home);
  const homeErr = useSelector((state: any) => state.auth.homeErr);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };

  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };

  const handleFilterApply = (filterValues: any) => {
    const filterPayload = {
      lat: "23.0225",
      long: "72.5714",
      categoryId: filterValues?.selectedCategory?.id !== 'all' ? filterValues?.selectedCategory?.id : undefined,
      minPrice: filterValues?.priceRange?.min || 0,
      maxPrice: filterValues?.priceRange?.max || 3000,
      date: filterValues?.selectedDate?.formattedDate || new Date().toISOString().split('T')[0],
      minDistance: filterValues?.distanceRange?.min || 0,
      maxDistance: filterValues?.distanceRange?.max || 20,
      userId: userId || "68c147b05f4b76754d914383"
    };
    
    dispatch(onFilter(filterPayload));
    navigation.navigate("FilterListScreen" as never);
  };

  useEffect(() => {
    console.log('=== ExploreScreen Mounted ===');
    requestLocationPermission();
    getUserID();
    fetchNearbyData();
  }, []);

  // Debug effect to check events data
  useEffect(() => {
    console.log('=== DEBUG: Nearby Events Data ===');
    console.log('Number of events:', nearbyEvents.length);
    nearbyEvents.forEach((event, index) => {
      console.log(`Event ${index}: ${event.name}`);
      if (event.coordinates && event.coordinates.coordinates) {
        const [lng, lat] = event.coordinates.coordinates;
        console.log(`Raw API Coords: [${lng}, ${lat}]`);
        console.log(`Corrected Coords: lat=${lng}, lng=${lat}`);
      }
    });
  }, [nearbyEvents]);

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

  const fetchNearbyData = async () => {
    const userId = await getUserID();
    console.log('Fetching nearby data with userId:', userId);
    
    dispatch(onHome({
      lat: mapRegion.latitude.toString(),
      long: mapRegion.longitude.toString(),
      userId: userId || "68c17979f763e99ba95a6de4",
    }));
  };

  // Handle API response
  useEffect(() => {
    if (home?.status === true || home?.status === 'true' || home?.status === 1 || home?.status === "1") {
      console.log("Home data received:", home);
      if (home?.data?.nearby) {
        setNearbyEvents(home.data.nearby);
        // Don't auto-adjust map bounds initially
      }
      if (home?.data?.featured) {
        setFeaturedEvents(home.data.featured);
      }
      dispatch(homeData(''));
    }

    if (homeErr) {
      console.log("Home error:", homeErr);
      dispatch(homeError(''));
    }
  }, [home, homeErr, dispatch]);

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
    if (eventId) {
      (navigation as any).navigate("ClubDetailScreen", { clubId: eventId });
    }
  };

  const handleFavoritePress = (eventId: string) => {
    dispatch(onTogglefavorite({ eventId }));
  };

  const onSearchClose = () => {
    setSearchVal('');
    fetchNearbyData();
  };

  const handleSearch = async (searchText: string) => {
    setSearchVal(searchText);
    
    if (searchText.trim().length > 0) {
      const userId = await getUserID();
      dispatch(onHome({
        lat: mapRegion.latitude.toString(),
        long: mapRegion.longitude.toString(),
        userId: userId || "68c17979f763e99ba95a6de4",
        search_keyword: searchText.trim(),
      }));
    } else {
      fetchNearbyData();
    }
  };

  // SIMPLIFIED MARKER RENDERING - Using default markers first
  const renderEventMarker = (event: any, index: number) => {
    if (!event.coordinates || !event.coordinates.coordinates) {
      console.log('Event missing coordinates:', event.name);
      return null;
    }

    try {
      const [apiLongitude, apiLatitude] = event.coordinates.coordinates;
      
      // Swap coordinates (API returns them swapped)
      const latitude = parseFloat(apiLongitude);
      const longitude = parseFloat(apiLatitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for event:', event.name);
        return null;
      }

      console.log(`Marker ${index}: ${event.name} at lat=${latitude}, lng=${longitude}`);
      
      // Use default marker first for testing
      return (
        <Marker
          key={event._id || `event-${index}`}
          coordinate={{ latitude, longitude }}
          title={event.name}
          description={event.address || 'Event location'}
          pinColor="red" // Simple red pin for testing
          onPress={() => {
            console.log('Marker pressed:', event.name);
            (navigation as any).navigate("ClubDetailScreen", { clubId: event._id });
          }}
        />
      );
    } catch (error) {
      console.log('Error rendering marker for event:', event.name, error);
      return null;
    }
  };

  return (
    <View style={styles.mainContainer}>

      {/* Map View */}
      {!mapReady && (
        <View style={styles.mapLoadingContainer}>
          <Text style={styles.mapLoadingText}>Loading Map...</Text>
        </View>
      )}
      
      <MapView
        ref={mapRef}
        style={styles.fullScreenMap}
        provider={undefined}
        initialRegion={mapRegion}
        onMapReady={() => {
          console.log('✅ MapView is ready and rendered');
          setMapReady(true);
        }}
        onMapLoaded={() => {
          console.log('✅ MapView loaded successfully');
          setMapReady(true);
        }}
        onError={(error) => {
          console.log('❌ MapView error:', error);
          setMapReady(true);
        }}
        onPress={() => {
          console.log('Map pressed');
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        mapType="standard"
        loadingEnabled={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
      >
        {/* Simple test marker to verify map is working */}
        <Marker
          coordinate={{
            latitude: 23.0225,
            longitude: 72.5714,
          }}
          title="Test Marker"
          description="Map is working!"
          pinColor="red"
        />
        
        {/* Event markers */}
        {nearbyEvents.map((event, index) => renderEventMarker(event, index))}
      </MapView>

      {/* Overlay Content */}
      <View style={styles.overlayContainer}>
        {/* Top Section - Back Button */}
        <View style={[styles.topSection, { marginTop: 50 }]}>
          <View style={styles.locationRow}>
            <TouchableOpacity style={styles.filterButton}>
              <BackButton navigation={navigation} onBackPress={() => navigation.goBack()} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.topSection, { marginTop: 10 }]}>
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
      {featuredEvents.length > 0 && (
        <View style={styles.featuredSection}>
          <Text style={styles.featuredTitle}>Featured ({featuredEvents.length})</Text>
          <FlatList
            data={featuredEvents}
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
      )}

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