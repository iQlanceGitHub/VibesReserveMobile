import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { colors } from "../../../../../utilis/colors";
import { fonts } from "../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../utilis/appConstant";
import NearbyEventCard from "../card/nearbyEvent/nearbyEvent";
import { BackButton } from "../../../../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import {
  onTogglefavorite,
  onNearbyHostViewAll,
  nearbyHostViewAllData,
  nearbyHostViewAllError,
  togglefavoriteData,
  togglefavoriteError,
} from "../../../../../redux/auth/actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { handleRestrictedAction } from "../../../../../utilis/userPermissionUtils";
import CustomAlert from "../../../../../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation } from "../../../../../contexts/LocationContext";

interface NearbyEventsSeeAllScreenProps {
  route: {
    params: {
      nearbyEvents: any[];
    };
  };
}

const NearbyEventsSeeAllScreen: React.FC<
  NearbyEventsSeeAllScreenProps
> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Get location data from context
  const { locationData, error: locationError } = useLocation();

  // Use dynamic location or fallback to default
  const defaultLat = locationData?.latitude?.toString();
  const defaultLong = locationData?.longitude?.toString();

  // State for API data
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(5); // Set to 5 as requested

  // Redux selectors
  const nearbyHostViewAll = useSelector(
    (state: any) => state.auth.nearbyHostViewAll
  );
  const nearbyHostViewAllErr = useSelector(
    (state: any) => state.auth.nearbyHostViewAllErr
  );
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector(
    (state: any) => state.auth.togglefavoriteErr
  );

  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();

  // Get user ID from AsyncStorage
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

  // Fetch nearby events from API
  const fetchNearbyEvents = async (page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
        setCurrentPage(1);
        setNearbyEvents([]);
        setHasMoreData(true);
      }

      const userId = await getUser();

      const payload = {
        lat: defaultLat,
        long: defaultLong,
        userId: userId,
        page: page,
        limit: pageLimit,
      };

      console.log("Fetching nearby events with payload:", payload);
      console.log("Current page:", page, "Limit:", pageLimit);
      dispatch(onNearbyHostViewAll(payload));
    } catch (error) {
      console.error("Error fetching nearby events:", error);
      setIsLoading(false);
    }
  };

  // Load more data for pagination
  const loadMoreData = () => {
    if (!isLoading && hasMoreData && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      console.log("Loading next page:", nextPage);
      setCurrentPage(nextPage);
      fetchNearbyEvents(nextPage, true);
    } else {
      console.log("Load more blocked - conditions not met");
    }
  };

  // Refresh data (pull to refresh)
  const onRefresh = () => {
    fetchNearbyEvents(1, false);
  };

  const handleNearbyBookNow = (eventId?: string) => {
    // Navigate to ClubProfileScreen for profile details (Nearby events)
    (navigation as any).navigate("ClubProfileScreen", {
      clubId: eventId,
    });
  };

  const handleFavoritePress = async (eventId: string) => {
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

  // Handle API responses
  useEffect(() => {
    if (
      nearbyHostViewAll?.status === true ||
      nearbyHostViewAll?.status === "true" ||
      nearbyHostViewAll?.status === 1 ||
      nearbyHostViewAll?.status === "1"
    ) {
      console.log("Nearby host view all response:", nearbyHostViewAll);

      // Extract events from the response
      const events =
        nearbyHostViewAll?.data || nearbyHostViewAll?.nearbyHosts || [];

      console.log("=== API RESPONSE DEBUG ===");
      console.log("Events received:", events.length);
      console.log("Current page:", currentPage);
      console.log(
        "Full API response:",
        JSON.stringify(nearbyHostViewAll, null, 2)
      );

      // Handle pagination
      if (currentPage === 1) {
        // First page - replace data
        setNearbyEvents(events);
        console.log("Set initial events:", events.length);
      } else {
        // Load more - append data
        setNearbyEvents((prevEvents) => {
          const newEvents = [...prevEvents, ...events];
          console.log(
            "Appended events. Previous:",
            prevEvents.length,
            "New:",
            events.length,
            "Total:",
            newEvents.length
          );
          return newEvents;
        });
      }

      // Update pagination info from API response
      const totalFromAPI = nearbyHostViewAll?.total || 0;
      const limitFromAPI = nearbyHostViewAll?.limit || pageLimit;
      const currentPageFromAPI = nearbyHostViewAll?.page || currentPage;

      // Calculate total pages manually if not provided by API
      const totalPagesFromAPI =
        nearbyHostViewAll?.totalPages ||
        nearbyHostViewAll?.pagination?.totalPages ||
        Math.ceil(totalFromAPI / limitFromAPI) ||
        1;

      console.log("Pagination info from API:");
      console.log("- totalFromAPI:", totalFromAPI);
      console.log("- limitFromAPI:", limitFromAPI);
      console.log("- currentPageFromAPI:", currentPageFromAPI);
      console.log("- calculated totalPagesFromAPI:", totalPagesFromAPI);

      setTotalPages(totalPagesFromAPI);
      setPageLimit(limitFromAPI); // Update limit from API
      setHasMoreData(currentPageFromAPI < totalPagesFromAPI);

      console.log("Updated states:");
      console.log("- totalPages:", totalPagesFromAPI);
      console.log("- hasMoreData:", currentPageFromAPI < totalPagesFromAPI);

      console.log("Pagination updated from API:", {
        totalPages: totalPagesFromAPI,
        currentPage: currentPageFromAPI,
        limit: limitFromAPI,
        hasMoreData: currentPageFromAPI < totalPagesFromAPI,
      });

      setIsLoading(false);

      // Clear the response
      dispatch(nearbyHostViewAllData(""));
    }

    if (nearbyHostViewAllErr) {
      console.log("Nearby host view all error:", nearbyHostViewAllErr);
      setIsLoading(false);
      // Clear the error
      dispatch(nearbyHostViewAllError(""));
    }
  }, [nearbyHostViewAll, nearbyHostViewAllErr, dispatch, currentPage]);

  // Handle toggle favorite response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === "true" ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("Toggle favorite response:", togglefavorite);
      // Refresh the nearby events list
      fetchNearbyEvents(1, false);
      // Clear the response
      dispatch(togglefavoriteData(""));
    }

    if (togglefavoriteErr) {
      console.log("Toggle favorite error:", togglefavoriteErr);
      // Clear the error
      dispatch(togglefavoriteError(""));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

  // Fetch data when component mounts and when screen comes into focus
  useEffect(() => {
    fetchNearbyEvents(1, false);
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchNearbyEvents(1, false);
    }, [locationData?.latitude, locationData?.longitude])
  );

  const renderEventItem = ({ item }: { item: any }) => (
    <NearbyEventCard
      event={item}
      onPress={() => handleNearbyBookNow((item as any)._id || (item as any).id)}
      onFavoritePress={() =>
        handleFavoritePress((item as any)._id || (item as any).id)
      }
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />

      {/* Header */}
      <View style={styles.header}>
        <BackButton
          navigation={navigation}
          onBackPress={() => navigation?.goBack()}
        />
        <Text style={styles.headerTitle}>Nearby Events</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Events List */}
      <FlatList
        data={nearbyEvents}
        renderItem={renderEventItem}
        keyExtractor={(item, index) =>
          (item as any)._id || (item as any).id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + verticalScale(20) },
        ]}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No nearby events found</Text>
            </View>
          ) : null
        }
        refreshing={isLoading}
        onRefresh={onRefresh}
        onEndReached={() => {
          console.log("=== ON END REACHED TRIGGERED ===");
          console.log("Current events count:", nearbyEvents.length);
          loadMoreData();
        }}
        onEndReachedThreshold={0.1}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    // Remove default padding as we're handling it with useSafeAreaInsets
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20), // Reduced since we're adding paddingTop to container
    paddingBottom: verticalScale(20),
    backgroundColor: colors.backgroundColor,
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: "center",
  },
  placeholder: {
    width: horizontalScale(24), // Same width as back button for centering
  },
  listContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(200),
  },
  emptyText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: "center",
  },
});

export default NearbyEventsSeeAllScreen;
