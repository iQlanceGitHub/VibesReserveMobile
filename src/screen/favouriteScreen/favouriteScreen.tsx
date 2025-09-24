import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
} from "react-native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import CategoryButton from "../../components/CategoryButton";
import NearbyEventCard from "../dashboard/user/homeScreen/card/nearbyEvent/nearbyEvent";
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
    const userId = await getUserID();
    const payload = {
      userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      ...(categoryId && categoryId !== 'all' && { categoryId })
    };
    dispatch(onFavoriteslist(payload));
  };

  // Fetch categories and favorites on component mount
  useEffect(() => {
  //  fetchCategories();
     getUserID();
    fetchFavoritesList();
  }, []);

  // Handle favorites list API response
  useEffect(() => {
    if (
      favoriteslist?.status === true ||
      favoriteslist?.status === 'true' ||
      favoriteslist?.status === 1 ||
      favoriteslist?.status === "1"
    ) {
      console.log("favoriteslist response:", favoriteslist);
      if (favoriteslist?.data) {
        setEvents(favoriteslist.data);
      }
      dispatch(favoriteslistData(''));
    }

    if (favoriteslistErr) {
      console.log("favoriteslistErr:", favoriteslistErr);
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
            
            {filteredEvents.length > 0 ? (
              <FlatList
                data={filteredEvents}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.eventsContent}
                keyExtractor={(item, index) => (item as any).eventId?._id || (item as any)._id || index.toString()}
                renderItem={({ item: favorite, index }) => {
                  const event = favorite.eventId; // Extract event data from eventId
                  const eventId = event?._id || favorite._id;
                  
                  // Create event object that matches the structure expected by NearbyEventCard
                  const eventData = {
                    ...event, // Spread all event properties
                    _id: eventId,
                    id: eventId,
                    isFavorite: true, // All items in favorites are favorited
                    // Ensure we have the required properties
                    name: event?.name || 'Unknown Event',
                    type: event?.type || 'Event',
                    address: event?.address || 'Location not available',
                    photos: event?.photos || [],
                    startDate: event?.startDate || favorite.createdAt,
                    openingTime: event?.openingTime || 'Time not available',
                    // Calculate entryFee from booths if available
                    entryFee: (() => {
                      if (event?.booths && event.booths.length > 0) {
                        const prices = event.booths
                          .map((booth: any) => booth.boothPrice || booth.discountedPrice || 0)
                          .filter((price: number) => price > 0);
                        
                        if (prices.length > 0) {
                          return Math.min(...prices).toString();
                        }
                      }
                      return '0';
                    })(),
                  };
                  
                  return (
                    <NearbyEventCard
                      event={eventData}
                      onPress={() => handleEventPress(eventId)}
                      onFavoritePress={() => handleFavoritePress(eventId)}
                    />
                  );
                }}
              />
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
