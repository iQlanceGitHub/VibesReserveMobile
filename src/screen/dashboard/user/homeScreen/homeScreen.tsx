import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import styles from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // or your icon lib
import AppleIcon from "../../../../assets/svg/appleIcon";
import CategoryButton from "../../../../components/CategoryButton";
import EventCard from "./card/featuredEvent/featuredEvent";
import LocationFavouriteWhiteIcon from "../../../../assets/svg/locationFavouriteWhiteIcon";
import NotificationUnFillIcon from "../../../../assets/svg/notificationUnFillIcon";

import NearbyEventCard from "./card/nearbyEvent/nearbyEvent";
import { colors } from "../../../../utilis/colors";
import Filtericon from "../../../../assets/svg/filtericon";
import Blox from "../../../../assets/svg/blox";
import SearchIcon from "../../../../assets/svg/searchIcon";
import FilterScreen from "./FilterScreen/FilterScreen";
import { useCategory } from "../../../../hooks/useCategory";
import { useFacility } from "../../../../hooks/useFacility";
import { longPollingService } from "../../../../services/longPollingService";
import {
  LocationProvider,
  useLocation,
} from "../../../../contexts/LocationContext";
import LocationDisplay from "../../../../components/LocationDisplay";

//API
import {
  onHomenew,
  homenewData,
  homenewError,
  onFilter,
  filterData,
  filterError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
  onFavoriteslist,
  favoriteslistData,
  favoriteslistError,
} from "../../../../redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomAlertSingleBtn } from "../../../../components/CustomeAlertDialog";
import { handleRestrictedAction } from "../../../../utilis/userPermissionUtils";
import CustomAlert from "../../../../components/CustomAlert";

const categories = [
  { id: "all", name: "All" },
  { id: "vip", name: "🥂 VIP Clubs" },
  { id: "dj", name: "🎧 DJ Nights" },
  { id: "events", name: "🎟️ Events" },
  { id: "lounge", name: "🍸 Lounge Bars" },
  { id: "live", name: "🎤 Live Music" },
  { id: "dance", name: "🕺 Dance Floors" },
];

const featuredEvent = {
  image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
  title: "Friday Night Party",
  location: "Bartonfort, Canada",
  date: "Aug 29 - 10:00 PM",
  rating: 4.8,
  price: 120,
  tag: "DJ Nights",
};

// Sample event data
const sampleEvents = [
  {
    id: "1",
    name: "Neon Nights",
    category: "DJ Nights",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$80",
    image: {
      uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: true,
  },
  {
    id: "2",
    name: "Aurora Lounge",
    category: "Lounge Bars",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$80",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "3",
    name: "Sunset Jazz Fest",
    category: "Live Music",
    location: "Montreal, QC",
    date: "Sept 5",
    time: "4:00 PM",
    price: "$50",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "4",
    name: "Vibe Nation",
    category: "Dance Floors",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$80",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
];

const HomeScreenContent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState(sampleEvents);
  const [searchVal, setSearchVal] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [featured, setFeatured] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  const dispatch = useDispatch();
  const homenew = useSelector((state: any) => state.auth.homenew);
  const homenewErr = useSelector((state: any) => state.auth.homenewErr);
  const filter = useSelector((state: any) => state.auth.filter);
  const filterErr = useSelector((state: any) => state.auth.filterErr);
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector(
    (state: any) => state.auth.togglefavoriteErr
  );
  const favoriteslist = useSelector((state: any) => state.auth.favoriteslist);
  const favoriteslistErr = useSelector(
    (state: any) => state.auth.favoriteslistErr
  );
  const [msg, setMsg] = useState("");
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  // Use the custom hook for category management
  const { categories: apiCategories, fetchCategories } = useCategory();
  const { facilities, isLoading, error, fetchFacilities, refreshFacilities } =
    useFacility();

  // Use the custom hook for home data management
  // Get location data from context
  const { locationData, error: locationError } = useLocation();

  // Use dynamic location or fallback to default
  const defaultLat = locationData?.latitude?.toString() || "23.012649201096547";
  const defaultLong =
    locationData?.longitude?.toString() || "72.51123340677258";

  const handleNextPress = () => {
    // setShowComingSoonDialog(true);
    navigation.navigate("NotificationScreen" as never);
  };

  // Refresh home data when location changes
  useEffect(() => {
    if (locationData?.latitude && locationData?.longitude) {
      console.log(
        "Location updated, refreshing home data with new coordinates:",
        {
          lat: locationData.latitude,
          lng: locationData.longitude,
        }
      );
      const refreshHomeData = async () => {
        const userId = await getUser();
        dispatch(
          onHomenew({
            lat: defaultLat,
            long: defaultLong,
            userId: userId,
          })
        );
      };
      refreshHomeData();
    } else if (locationError) {
      console.log("Location error detected:", locationError);
    }
  }, [locationData?.latitude, locationData?.longitude, locationError]);

  // Get user ID from AsyncStorage
  // const getUserID = async (): Promise<string | null> => {
  //   try {
  //     const userData = await AsyncStorage.getItem('user_data');
  //     if (userData) {
  //       const parsedUserData = JSON.parse(userData);
  //       const userId = parsedUserData?.id || '';
  //       setUserId(userId);
  //       return userId;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.log('Error getting user ID:', error);
  //     return null;
  //   }
  // };
  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user !== null) {
        const parsedUser = JSON.parse(user);
        console.log("User retrieved:", parsedUser);
        const userId = parsedUser?.id || "";
        setUserId(userId);

        return userId;
      }
    } catch (e) {
      console.error("Failed to fetch the user.", e);
    }
  };

  // Fetch favorites list
  const fetchFavoritesList = async () => {
    const userId = await getUser();
    const payload = {
      userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
    };
    dispatch(onFavoriteslist(payload));
  };

  // Fetch categories and home data when component mounts
  useEffect(() => {
    fetchCategories();
    getUser();
  }, [fetchCategories]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const userId = await getUser();
        // Fetch categories and facilities when screen comes into focus
        fetchCategories();
        fetchFacilities();
        // Fetch home data
        dispatch(
          onHomenew({
            lat: defaultLat,
            long: defaultLong,
            userId: userId,
          })
        );
        // Fetch favorites data
        fetchFavoritesList();
      };
      loadData();
    }, [fetchCategories, fetchFacilities])
  );

  useEffect(() => {
    fetchFacilities();
    console.log("facilities:->", facilities);
  }, [fetchFacilities]);

  useEffect(() => {
    const callHomeAPI = async () => {
      const userId = await getUser();
      dispatch(
        onHomenew({
          lat: defaultLat,
          long: defaultLong,
          userId: userId, // fallback userId
        })
      );
    };
    callHomeAPI();
  }, []);

  // Use API categories if available, otherwise fallback to static categories
  const allCategories =
    apiCategories.length > 0
      ? [{ _id: "all", name: "All" }, ...apiCategories]
      : categories;

  const handleCategoryPress = async (categoryId: string) => {
    setSelectedCategory(categoryId);

    const userId = await getUser();

    // Refresh home data with new category filter
    if (categoryId !== "all") {
      const homeParams = {
        lat: defaultLat,
        long: defaultLong,
        categoryid: categoryId,
        userId: userId, // fallback userId
      };
      dispatch(onHomenew(homeParams));
    } else {
      // If "All" is selected, fetch without category filter
      const homeParams = {
        lat: defaultLat,
        long: defaultLong,
        userId: userId, // fallback userId
      };
      dispatch(onHomenew(homeParams));
    }
  };

  const onSearchClose = () => {
    setSearchVal("");
    // Reset to original data when search is cleared
    const callHomeAPI = async () => {
      const userId = await getUser();
      dispatch(
        onHomenew({
          lat: defaultLat,
          long: defaultLong,
          userId: userId, // fallback userId
        })
      );
    };
    callHomeAPI();
  };

  const handleSearch = async (searchText: string) => {
    setSearchVal(searchText);

    if (searchText.trim().length > 0) {
      const userId = await getUser();
      dispatch(
        onHomenew({
          lat: defaultLat,
          long: defaultLong,
          userId: userId, // fallback userId
          search_keyword: searchText.trim(),
        })
      );
    } else {
      // If search is empty, fetch original data
      const userId = await getUser();
      dispatch(
        onHomenew({
          lat: defaultLat,
          long: defaultLong,
          userId: userId, // fallback userId
        })
      );
    }
  };

  useEffect(() => {
    if (
      homenew?.status === true ||
      homenew?.status === "true" ||
      homenew?.status === 1 ||
      homenew?.status === "1"
    ) {
      console.log("homenew:+>", homenew);
      console.log("featuredList data:", homenew?.featuredList);
      console.log("nearbyHosts data:", homenew?.nearbyHosts);

      if (homenew?.featuredList) {
        setFeatured(homenew.featuredList);
      }
      if (homenew?.nearbyHosts) {
        setNearby(homenew.nearbyHosts);
      }
      dispatch(homenewData(""));
    }

    if (homenewErr) {
      console.log("homenewErr:+>", homenewErr);
      setMsg(homenewErr?.message?.toString());
      dispatch(homenewError(""));
    }
  }, [homenew, homenewErr, dispatch]);

  // Handle filter API response
  useEffect(() => {
    if (
      filter?.status === true ||
      filter?.status === "true" ||
      filter?.status === 1 ||
      filter?.status === "1"
    ) {
      console.log("filter response:+>", filter);
      setFilteredData(filter?.data || []);
      // dispatch(filterData(''));
    }

    if (filterErr) {
      console.log("filterErr:+>", filterErr);
      setMsg(filterErr?.message?.toString());
      dispatch(filterError(""));
    }
  }, [filter, filterErr, dispatch]);

  // Handle Toggle Favorite API response
  useEffect(() => {
    const handleToggleFavoriteResponse = async () => {
      if (
        togglefavorite?.status === true ||
        togglefavorite?.status === "true" ||
        togglefavorite?.status === 1 ||
        togglefavorite?.status === "1"
      ) {
        console.log("togglefavorite response in home:+>", togglefavorite);
        const userId = await getUser();
        dispatch(
          onHomenew({
            lat: defaultLat,
            long: defaultLong,
            userId: userId, // fallback userId
          })
        );
        // Also refresh favorites list
        fetchFavoritesList();
        dispatch(togglefavoriteData(""));
      }

      if (togglefavoriteErr) {
        console.log("togglefavoriteErr in home:+>", togglefavoriteErr);
        setMsg(togglefavoriteErr?.message?.toString());
        dispatch(togglefavoriteError(""));
      }
    };

    handleToggleFavoriteResponse();
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  // Handle favorites list API response
  useEffect(() => {
    if (
      favoriteslist?.status === true ||
      favoriteslist?.status === "true" ||
      favoriteslist?.status === 1 ||
      favoriteslist?.status === "1"
    ) {
      console.log("favoriteslist response in home:", favoriteslist);
      if (favoriteslist?.data) {
        setFavoriteEvents(favoriteslist.data);
      }
      dispatch(favoriteslistData(""));
    }

    if (favoriteslistErr) {
      console.log("favoriteslistErr in home:", favoriteslistErr);
      dispatch(favoriteslistError(""));
    }
  }, [favoriteslist, favoriteslistErr, dispatch]);

  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };

  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };

  const handleFilterApply = (filterValues: any) => {
    console.log("=== FILTER APPLY CALLED ===");
    console.log("Filter Values:", filterValues);

    // Format the filter data according to API requirements
    const filterPayload = {
      lat: "23.0126",
      long: "72.5112",
      categoryId:
        filterValues?.selectedCategory?.id !== "all"
          ? filterValues?.selectedCategory?.id
          : undefined,
      minPrice: filterValues?.priceRange?.min || 0,
      maxPrice: filterValues?.priceRange?.max || 3000,
      date:
        filterValues?.selectedDate?.formattedDate ||
        new Date().toISOString().split("T")[0],
      minDistance: filterValues?.distanceRange?.min || 0,
      maxDistance: filterValues?.distanceRange?.max || 20,
      userId: userId, // fallback user ID
    };

    console.log("Filter Payload:", filterPayload);

    // Call filter API
    dispatch(onFilter(filterPayload));

    // Navigate to FilterListScreen immediately (same as explore screen)
    navigation.navigate("FilterListScreen" as never);
  };

  const handleBookNow = (eventId?: string) => {
    console.log("Book Now clicked for featured event:", eventId);
    // Navigate to ClubDetailScreen for booking details (Featured events)
    (navigation as any).navigate("ClubDetailScreen", {
      clubId: eventId,
    });
  };

  const handleNearbyBookNow = (eventId?: string) => {
    console.log("Book Now clicked for nearby event:", eventId);
    // Navigate to ClubProfileScreen for profile details (Nearby events)
    (navigation as any).navigate("ClubProfileScreen", {
      clubId: eventId,
    });
  };

  const handleFavorite = async (eventId: string) => {
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

  return (
    <View style={styles.container}>
      {/* Top Section: Location & Search */}
      <View style={styles.topSection}>
        <View style={styles.locationRow}>
          <LocationDisplay
            showRefreshButton={true}
            style={{ flex: 1 }}
            textStyle={styles.locationText}
          />
          <TouchableOpacity
            style={styles.mapIcon}
            onPress={() => handleNextPress()}
          >
            <NotificationUnFillIcon />
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
            placeholderTextColor={"#9CA3AF"}
          />
          {searchVal && (
            <TouchableOpacity onPress={onSearchClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <Filtericon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() =>
              (navigation as any).navigate("ExploreScreen", {
                nearbyEvents: nearby,
                featuredEvents: featured,
              })
            }
          >
            <LocationFavouriteWhiteIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {allCategories.map((category) => {
            const categoryId = (category as any)._id || (category as any).id;
            const categoryTitle =
              (category as any).name || (category as any).title;
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
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContent}
      >
        {/* Featured Event */}
        <Text style={styles.sectionTitle}>Featured ({featured.length})</Text>
        <FlatList
          horizontal
          data={featured.length > 0 ? featured : []}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.FeatureEventContainer}
          keyExtractor={(item, index) => (item as any)._id || index.toString()}
          renderItem={({ item }) => {
            return (
              <EventCard
                title={(item as any).name}
                location={(item as any).address}
                date={new Date((item as any).startDate).toLocaleDateString()}
                price={`$${(item as any).entryFee}`}
                tag={(item as any).type}
                image={(item as any).photos?.[0] || ""}
                rating={(item as any).avgRating}
                isFavorite={(item as any).isFavorite || false}
                onBookNow={() => handleBookNow((item as any)._id)}
                onFavoritePress={() =>
                  handleFavoritePress((item as any)._id || (item as any).id)
                }
                _id={(item as any)._id || (item as any).id}
              />
            );
          }}
        />

        {/* Nearby Events */}
        <View style={styles.nearbyHeaderRow}>
          <Text style={styles.sectionTitle}>Nearby Profile</Text>
          <TouchableOpacity
            onPress={() =>
              (navigation as any).navigate("NearbyEventsSeeAllScreen", {
                nearbyEvents: nearby,
              })
            }
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {nearby.length > 0 ? (
          <FlatList
            data={nearby.slice(0, 5)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.nearbyEventsContainer}
            keyExtractor={(item, index) =>
              (item as any)._id || (item as any).id || index.toString()
            }
            renderItem={({ item }) => (
              <NearbyEventCard
                event={item}
                onPress={() =>
                  handleNearbyBookNow((item as any)._id || (item as any).id)
                }
                onFavoritePress={() =>
                  handleFavoritePress((item as any)._id || (item as any).id)
                }
              />
            )}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No nearby events found</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterScreen
        visible={isFilterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />

      <Modal
        visible={showComingSoonDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowComingSoonDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.comingSoonDialog}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Coming Soon!</Text>
            </View>

            <View style={styles.dialogContent}>
              <Text style={styles.dialogMessage}>
                We're working on it to bring you an amazing booking experience.
                This feature will be available soon!
              </Text>
            </View>

            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.dialogButton}
                onPress={() => setShowComingSoonDialog(false)}
              >
                <Text style={styles.dialogButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Bottom navigation is assumed to be handled by your navigator */}
    </View>
  );
};

const HomeScreen = () => {
  return (
    <LocationProvider>
      <HomeScreenContent />
    </LocationProvider>
  );
};

export default HomeScreen;
