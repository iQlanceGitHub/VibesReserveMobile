import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  onFavoriteslist,
  favoriteslistData,
  favoriteslistError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
} from "../../redux/auth/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { verticalScale, horizontalScale, fontScale } from "../../utilis/appConstant";
import { handleRestrictedAction } from "../../utilis/userPermissionUtils";
import CustomAlert from "../../components/CustomAlert";
import { fonts } from "../../utilis/fonts";
import { useFocusEffect } from "@react-navigation/native";

interface FavouriteScreenProps {
  navigation?: any;
}

const FavouriteScreen: React.FC<FavouriteScreenProps> = ({ navigation }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  const dispatch = useDispatch();
  const favoriteslist = useSelector((state: any) => state.auth.favoriteslist);
  const favoriteslistErr = useSelector(
    (state: any) => state.auth.favoriteslistErr
  );
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector(
    (state: any) => state.auth.togglefavoriteErr
  );

  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();

  // Get user ID from AsyncStorage
  const getUserID = async (): Promise<string | null> => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData?.id || "";
        setUserId(userId);
        return userId;
      }
      return null;
    } catch (error) {
      console.log("Error getting user ID:", error);
      return null;
    }
  };

  // Fetch favorites list
  const fetchFavoritesList = async () => {
    const userId = await getUserID();
    const payload = {
      userId: userId
    };
    dispatch(onFavoriteslist(payload));
  };

  // Fetch favorites on component mount and every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('FavouriteScreen: Screen focused, fetching favorites...');
      getUserID();
      fetchFavoritesList();
    }, [])
  );

  // Handle favorites list API response
  useEffect(() => {
    if (
      favoriteslist?.status === true ||
      favoriteslist?.status === "true" ||
      favoriteslist?.status === 1 ||
      favoriteslist?.status === "1"
    ) {
      console.log("favoriteslist response:", favoriteslist);
      if (favoriteslist?.data) {
        console.log("Setting events data:", favoriteslist.data.length, "items");
        setEvents(favoriteslist.data);
      } else {
        console.log("No data in response, setting empty array");
        setEvents([]);
      }
      dispatch(favoriteslistData(""));
    }

    if (favoriteslistErr) {
      console.log("favoriteslistErr:", favoriteslistErr);
      dispatch(favoriteslistError(""));
    }
  }, [favoriteslist, favoriteslistErr, dispatch]);

  // Handle toggle favorite API response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === "true" ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("togglefavorite response in favorites:", togglefavorite);
      // Immediately update local state if we know the item was removed
      if (togglefavorite?.data?.isFavorited === false) {
        console.log("Item was unfavorited, removing from local state");
        setEvents(prevEvents => prevEvents.filter(event => {
          const eventId = event.eventId?._id || event._id;
          return eventId !== togglefavorite?.data?.eventId;
        }));
      }
      // Re-fetch favorites list after toggle to ensure consistency
      fetchFavoritesList();
      dispatch(togglefavoriteData(""));
    }

    if (togglefavoriteErr) {
      console.log("togglefavoriteErr in favorites:", togglefavoriteErr);
      fetchFavoritesList();
      dispatch(togglefavoriteError(""));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  const handleEventPress = (eventId: string) => {
    console.log("Event pressed:", eventId);
    (navigation as any).navigate("ClubDetailScreen", {
      clubId: eventId || "68b6eceba9ae1fc590695248",
    });
  };

  const handleFavoritePress = async (eventId: string) => {
    console.log("Toggling favorite for event ID:", eventId);

    // Check if user has permission to like/favorite
    const hasPermission = await handleRestrictedAction(
      "canLike",
      navigation,
      "like this event"
    );

    if (hasPermission) {
      dispatch(onTogglefavorite({ eventId }));
    } else {
      // Show custom alert for login required
      setAlertConfig({
        title: "Login Required",
        message:
          "Please sign in to like this event. You can explore the app without an account, but some features require login.",
        primaryButtonText: "Sign In",
        secondaryButtonText: "Continue Exploring",
        onPrimaryPress: () => {
          setShowCustomAlert(false);
          (navigation as any).navigate("SignInScreen");
        },
        onSecondaryPress: () => {
          setShowCustomAlert(false);
        },
      });
      setShowCustomAlert(true);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Time not available";
    return timeString;
  };

  const getEventType = (event: any) => {
    if (event?.category?.name) return event.category.name;
    if (event?.type) return event.type;
    return "Event";
  };

  const getEventPrice = (event: any) => {
    if (event?.booths && event.booths.length > 0) {
      const prices = event.booths
        .map((booth: any) => booth.boothPrice || booth.discountedPrice || 0)
        .filter((price: number) => price > 0);
      
      if (prices.length > 0) {
        return `$${Math.min(...prices)}`;
      }
    }
    return "$0";
  };

  const renderEventCard = ({ item: favorite, index }: { item: any; index: number }) => {
    const event = favorite.eventId || favorite;
    const eventId = event?._id || favorite._id;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleEventPress(eventId)}
        activeOpacity={0.8}
      >
        <View style={styles.eventImageContainer}>
          <Image
            source={{
              uri: event?.photos?.[0] || event?.image || "https://via.placeholder.com/150x120/8D34FF/FFFFFF?text=Event"
            }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoritePress(eventId)}
            activeOpacity={0.7}
          >
            <View style={styles.favoriteIcon}>
              <Text style={styles.favoriteIconText}>♥</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.eventTypeContainer}>
            <Text style={styles.eventType}>{getEventType(event)}</Text>
          </View>

          <Text style={styles.eventName} numberOfLines={1}>
            {event?.name || "Unknown Event"}
          </Text>

          <View style={styles.eventInfoRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.eventLocation} numberOfLines={1}>
              {event?.address || "Location not available"}
            </Text>
          </View>

          <View style={styles.eventInfoRow}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.eventDateTime}>
              {formatTime(event?.openingTime || "10:00 PM")}
            </Text>
          </View>

          <View style={styles.eventFooter}>
            <Text style={styles.eventPrice}>{getEventPrice(event)}</Text>
            <TouchableOpacity style={styles.arrowButton} onPress={() => handleEventPress(eventId)}>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Favourite</Text>
          </View>

          {/* Events List */}
          <View style={styles.eventsContainer}>
            {console.log('Rendering favorites screen with', events.length, 'events')}
            {events && events.length > 0 ? (
              <FlatList
                data={events}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.eventsContent}
                keyExtractor={(item, index) =>
                  (item as any).eventId?._id ||
                  (item as any)._id ||
                  index.toString()
                }
                renderItem={renderEventCard}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Favorites</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't added any events to your favorites yet.{'\n'}
                  Start exploring and add events you love!
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