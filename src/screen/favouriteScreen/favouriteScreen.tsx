import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import CategoryButton from "../../components/CategoryButton";
import NearbyEventCard from "../dashboard/user/homeScreen/card/nearbyEvent/nearbyEvent";
import NearbyEventCardNew from "../dashboard/user/homeScreen/card/nearbyEventCardNew/nearbyEventCardNew";
import styles from "./styles";
import { useDispatch, useSelector } from 'react-redux';
import {
  onFavoriteslist,
  favoriteslistData,
  favoriteslistError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
} from '../../redux/auth/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCategory } from '../../hooks/useCategory';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from "../../utilis/appConstant";
import { handleRestrictedAction } from '../../utilis/userPermissionUtils';
import CustomAlert from '../../components/CustomAlert';

interface FavouriteScreenProps {
  navigation?: any;
}

const FavouriteScreen: React.FC<FavouriteScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });
  // Remove local loading state since global loader handles it

  const dispatch = useDispatch();
  const favoriteslist = useSelector((state: any) => state.auth.favoriteslist);
  const favoriteslistErr = useSelector((state: any) => state.auth.favoriteslistErr);
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector((state: any) => state.auth.togglefavoriteErr);

  // Use the custom hook for category management
  const { categories: apiCategories, fetchCategories } = useCategory();
  
  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();

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

  // Fetch favorites list
  const fetchFavoritesList = async (categoryId?: string) => {
    console.log("FavouriteScreen: fetchFavoritesList called with categoryId:", categoryId);
    const userId = await getUserID();
    console.log("FavouriteScreen: userId from getUserID:", userId);
    const payload = {
      userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      ...(categoryId && categoryId !== 'all' && { categoryId })
    };
    console.log("FavouriteScreen: dispatching onFavoriteslist with payload:", payload);
    console.log("FavouriteScreen: About to call API...");
    dispatch(onFavoriteslist(payload));
    console.log("FavouriteScreen: API call dispatched");
  };

  // Fetch categories and favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("FavouriteScreen: useFocusEffect triggered - fetching data");
      
      // Clear any previous data to ensure fresh load
      setEvents([]);
      
      // Clear Redux state to ensure fresh API call
      dispatch(favoriteslistData(''));
      dispatch(favoriteslistError(''));
      
      // Add a small delay to ensure screen is fully focused
      const timer = setTimeout(() => {
        console.log("FavouriteScreen: executing delayed data fetch");
        //  fetchCategories();
        getUserID();
        fetchFavoritesList();
      }, 100);
      
      // Cleanup function
      return () => {
        console.log("FavouriteScreen: useFocusEffect cleanup");
        clearTimeout(timer);
      };
    }, [])
  );

  // Handle favorites list API response
  useEffect(() => {
    console.log("FavouriteScreen: useEffect triggered for favoriteslist response");
    console.log("FavouriteScreen: favoriteslist object:", favoriteslist);
    console.log("FavouriteScreen: favoriteslist status:", favoriteslist?.status);
    console.log("FavouriteScreen: favoriteslist data:", favoriteslist?.data);
    console.log("FavouriteScreen: favoriteslistErr:", favoriteslistErr);
    
    if (
      favoriteslist?.status === true ||
      favoriteslist?.status === 'true' ||
      favoriteslist?.status === 1 ||
      favoriteslist?.status === "1"
    ) {
      console.log("FavouriteScreen: favoriteslist response success:", favoriteslist);
      if (favoriteslist?.data) {
        console.log("FavouriteScreen: setting events with data:", favoriteslist.data);
        console.log("FavouriteScreen: data type:", typeof favoriteslist.data);
        console.log("FavouriteScreen: data is array:", Array.isArray(favoriteslist.data));
        
        // Ensure data is an array
        const dataArray = Array.isArray(favoriteslist.data) ? favoriteslist.data : [favoriteslist.data];
        console.log("FavouriteScreen: processed data array:", dataArray);
        setEvents(dataArray);
      } else {
        console.log("FavouriteScreen: no data in response");
        setEvents([]);
      }
      dispatch(favoriteslistData(''));
    } else if (favoriteslist?.status === false || favoriteslist?.status === 'false' || favoriteslist?.status === 0) {
      console.log("FavouriteScreen: favoriteslist response failed:", favoriteslist);
      setEvents([]);
    } else {
      console.log("FavouriteScreen: favoriteslist response pending or unknown status:", favoriteslist?.status);
    }

    if (favoriteslistErr) {
      console.log("FavouriteScreen: favoriteslistErr:", favoriteslistErr);
      dispatch(favoriteslistError(''));
    }
  }, [favoriteslist, favoriteslistErr, dispatch]);

  // Handle toggle favorite API response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === 'true' ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("togglefavorite response in favorites:", togglefavorite);
      // Re-fetch favorites list after toggle
      fetchFavoritesList(selectedCategory !== 'all' ? selectedCategory : undefined);
      dispatch(togglefavoriteData(''));
    }

    if (togglefavoriteErr) {
      console.log("togglefavoriteErr in favorites:", togglefavoriteErr);
      dispatch(togglefavoriteError(''));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Fetch favorites with category filter
    fetchFavoritesList(categoryId !== 'all' ? categoryId : undefined);
  };

  const handleEventPress = (eventId: string) => {
    console.log("Event pressed:", eventId);
    // Navigate to event details
    console.log('Book Now clicked for event:', eventId);
    // Handle booking logic here
    (navigation as any).navigate("ClubDetailScreen", { clubId: eventId || '68b6eceba9ae1fc590695248' });
  };

  const handleFavoritePress = async (eventId: string) => {
    console.log('Toggling favorite for event ID:', eventId);
    
    // Check if user has permission to like/favorite
    const hasPermission = await handleRestrictedAction('canLike', navigation, 'like this event');
    
    if (hasPermission) {
      dispatch(onTogglefavorite({ eventId }));
    } else {
      // Show custom alert for login required
      setAlertConfig({
        title: 'Login Required',
        message: 'Please sign in to like this event. You can explore the app without an account, but some features require login.',
        primaryButtonText: 'Sign In',
        secondaryButtonText: 'Continue Exploring',
        onPrimaryPress: () => {
          setShowCustomAlert(false);
          (navigation as any).navigate('SignInScreen');
        },
        onSecondaryPress: () => {
          setShowCustomAlert(false);
        },
      });
      setShowCustomAlert(true);
    }
  };

  // Use API categories if available, otherwise fallback to static categories
  const allCategories = apiCategories.length > 0 ? [
    { _id: "all", name: "All" },
    ...apiCategories
  ] : [
    { _id: "all", name: "All" }
  ];

  // No need for local filtering since we're using API filtering
  const filteredEvents = events;
  
  // Debug logging
  console.log("FavouriteScreen: events state:", events);
  console.log("FavouriteScreen: events length:", events.length);
  console.log("FavouriteScreen: events type:", typeof events);
  console.log("FavouriteScreen: events is array:", Array.isArray(events));
  console.log("FavouriteScreen: events content:", JSON.stringify(events, null, 2));
  
  // Validate that we have valid data
  const hasValidData = Array.isArray(events) && events.length > 0;
  console.log("FavouriteScreen: hasValidData:", hasValidData);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === 'android' && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: 'transparent',
        })}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <View style={styles.statusBar}></View>
            <Text style={styles.title}>Favourite</Text>
          </View>

          {/* <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {allCategories.map((category) => {
                const categoryId = (category as any)._id || (category as any).id;
                const categoryTitle = (category as any).name || (category as any).title;
                return (
                  <CategoryButton
                    key={categoryId}
                    title={categoryTitle}
                    isSelected={selectedCategory === categoryId}
                    onPress={() => handleCategoryPress(categoryId)}
                  />
                );
              })}
            </ScrollView>
          </View> */}

          <View style={styles.eventsContainer}>
            {/* Favorites Section */}
            <Text style={styles.sectionTitle}>Favorited Events</Text>
            
            {/* Simple test to verify rendering */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: 'yellow', fontSize: 16 }}>
                RENDER TEST: This should be visible
              </Text>
              <Text style={{ color: 'white', fontSize: 14 }}>
                Events count: {filteredEvents.length}
              </Text>
              <Text style={{ color: 'white', fontSize: 14 }}>
                Has valid data: {hasValidData ? 'YES' : 'NO'}
              </Text>
            </View>
            
            {console.log("FavouriteScreen: filteredEvents length:", filteredEvents.length)}
            {console.log("FavouriteScreen: filteredEvents data:", JSON.stringify(filteredEvents, null, 2))}
            
            {filteredEvents.length > 0 ? (
              <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>
                  DEBUG: Found {filteredEvents.length} events
                </Text>
                {console.log("FavouriteScreen: About to map over", filteredEvents.length, "events")}
                <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>
                  MAP TEST: Should see this before mapping
                </Text>
                {filteredEvents.map((favorite, index) => {
                  console.log("FavouriteScreen: Mapping item at index", index, ":", favorite);
                  
                  // Extract event data from the nested structure
                  let event = null;
                  let eventId = null;
                  
                  // Based on the actual data structure, event is nested under eventId
                  if (favorite.eventId && (favorite.eventId._id || favorite.eventId.id)) {
                    event = favorite.eventId;
                    eventId = favorite.eventId._id || favorite.eventId.id;
                    console.log("FavouriteScreen: Using eventId structure");
                  }
                  // Fallback: Check if the item itself is the event (direct structure)
                  else if (favorite._id || favorite.id) {
                    event = favorite;
                    eventId = favorite._id || favorite.id;
                    console.log("FavouriteScreen: Using direct structure");
                  }
                  // Fallback: Check if event is nested in event
                  else if (favorite.event && (favorite.event._id || favorite.event.id)) {
                    event = favorite.event;
                    eventId = favorite.event._id || favorite.event.id;
                    console.log("FavouriteScreen: Using event structure");
                  }
                  
                  console.log("FavouriteScreen: Extracted event:", event);
                  console.log("FavouriteScreen: Extracted eventId:", eventId);
                  
                  // If no valid event found, skip rendering
                  if (!event || !eventId) {
                    console.log("FavouriteScreen: No valid event data found, skipping item");
                    return null;
                  }
                  
                  // Create event object that matches the structure expected by NearbyEventCardNew
                  const eventData = {
                    // Required properties for NearbyEventCardNew interface
                    id: eventId,
                    _id: eventId,
                    name: event?.name || event?.businessName || 'Unknown Event',
                    category: event?.type || 'Event', // Changed from 'type' to 'category' to match interface
                    type: event?.type || 'Event', // Keep both for compatibility
                    location: event?.address || 'Location not available',
                    address: event?.address || 'Location not available',
                    date: event?.startDate || favorite.createdAt,
                    time: event?.openingTime || 'Time not available',
                    price: (() => {
                      if (event?.booths && event.booths.length > 0) {
                        const prices = event.booths
                          .map((booth: any) => booth.boothPrice || booth.discountedPrice || 0)
                          .filter((price: number) => price > 0);
                        
                        if (prices.length > 0) {
                          return `$${Math.min(...prices)}`;
                        }
                      }
                      return `$${event?.entryFee || '0'}`;
                    })(),
                    image: event?.photos?.[0] || 'https://via.placeholder.com/120x90/2D014D/8D34FF?text=Event',
                    isFavorite: true, // All items in favorites are favorited
                    
                    // Additional properties for better functionality
                    photos: event?.photos || [],
                    startDate: event?.startDate || favorite.createdAt,
                    openingTime: event?.openingTime || 'Time not available',
                    entryFee: (() => {
                      if (event?.booths && event.booths.length > 0) {
                        const prices = event.booths
                          .map((booth: any) => booth.boothPrice || booth.discountedPrice || 0)
                          .filter((price: number) => price > 0);
                        
                        if (prices.length > 0) {
                          return Math.min(...prices).toString();
                        }
                      }
                      return event?.entryFee?.toString() || '0';
                    })(),
                    booths: event?.booths || [],
                    coordinates: event?.coordinates || null,
                    businessDescription: event?.businessDescription || event?.description || '',
                    distance: event?.distance || '0 km',
                  };
                  
                  console.log("FavouriteScreen: Created eventData:", eventData);
                  
                  return (
                    <View key={eventId || index} style={{ marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: 'white' }}>
                      <Text style={{ color: 'white', fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                        ✅ EVENT FOUND: {eventData.name}
                      </Text>
                      <Text style={{ color: 'white', fontSize: 14, marginBottom: 5 }}>
                        Category: {eventData.category}
                      </Text>
                      <Text style={{ color: 'white', fontSize: 14, marginBottom: 5 }}>
                        Address: {eventData.address}
                      </Text>
                      <Text style={{ color: 'white', fontSize: 14, marginBottom: 5 }}>
                        Price: {eventData.price}
                      </Text>
                      <Text style={{ color: 'white', fontSize: 14, marginBottom: 10 }}>
                        Date: {eventData.date}
                      </Text>
                      <Text style={{ color: 'yellow', fontSize: 12 }}>
                        Component should render above this text
                      </Text>
                      {/* Temporarily comment out NearbyEventCardNew to test */}
                      {/* <NearbyEventCardNew
                        event={eventData}
                        onPress={() => handleEventPress(eventId)}
                        onFavoritePress={() => handleFavoritePress(eventId)}
                      /> */}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                <Text style={styles.emptySubtitle}>
                  {selectedCategory === 'all' 
                    ? "Start adding events to your favorites to see them here!"
                    : "No favorites found in this category. Try selecting a different category."
                  }
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginBottom: verticalScale(100) }} />
        </View>
      </LinearGradient>
      
      <CustomAlert
        visible={showCustomAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText={alertConfig.primaryButtonText}
        secondaryButtonText={alertConfig.secondaryButtonText}
        onPrimaryPress={alertConfig.onPrimaryPress}
        onSecondaryPress={alertConfig.onSecondaryPress}
        onClose={() => setShowCustomAlert(false)}
      />
     
    </View>
  );
};

export default FavouriteScreen;
