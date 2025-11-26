import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import ClockIcon from "../../../../assets/svg/clockIcon";
import EditIcon from "../../../../assets/svg/editIcon";
import DeleteIcon from "../../../../assets/svg/deleteIconNew";
import {
  onListEvent,
  onDeleteEvent,
  deleteEventData,
  deleteEventError,
  listEventData,
  listEventError,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
import styles from "./manageAvailabityStyle";

interface Event {
  _id: string;
  type: string;
  name: string;
  details: string;
  openingTime: string;
  startDate: string;
  photos: string[];
  address?: string;
}

interface ManageAvailabilityProps {
  navigation?: any;
}

const ManageAvailability: React.FC<ManageAvailabilityProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { listEvent, listEventErr, deleteEvent, deleteEventErr } = useSelector(
    (state: any) => state.auth
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Debug Redux state
  useEffect(() => {
    console.log("Full Redux auth state:", {
      listEvent,
      listEventErr,
      deleteEvent,
      deleteEventErr,
    });
    console.log("deleteEvent type:", typeof deleteEvent);
    console.log("deleteEventErr type:", typeof deleteEventErr);
  }, [listEvent, listEventErr, deleteEvent, deleteEventErr]);

  // Fetch events with dynamic pagination
  const fetchEvents = async (page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
        setCurrentPage(1); // Always reset to page 1 for fresh load
        setEvents([]);
        setHasMoreData(true);
        console.log("Fresh load - resetting to page 1");
      }

      console.log("Fetching events with page:", page, "limit:", pageLimit);
      dispatch(onListEvent({ page: page, limit: pageLimit }));
    } catch (error) {
      console.error("Error fetching events:", error);
      setIsLoading(false);
    }
  };

  // Load more data for pagination
  const loadMoreData = () => {
    if (!isLoading && hasMoreData && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      console.log("Loading next page:", nextPage);
      setCurrentPage(nextPage);
      fetchEvents(nextPage, true);
    } else {
      console.log("Load more blocked - conditions not met");
    }
  };

  // Refresh data (pull to refresh)
  const onRefresh = () => {
    fetchEvents(1, false);
  };

  // Fetch data when component mounts
  useEffect(() => {
    // Clear Redux state on mount
    dispatch(listEventData(""));
    dispatch(listEventError(""));
    fetchEvents(1, false);
  }, [dispatch]);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused - clearing Redux state and reloading events");
      // Clear Redux state first to prevent showing old data
      dispatch(listEventData(""));
      dispatch(listEventError(""));

      // Always start fresh when screen comes into focus
      setCurrentPage(1);
      setEvents([]);
      setHasMoreData(true);
      setIsLoading(true);

      // Small delay to ensure state is cleared before making new request
      setTimeout(() => {
        fetchEvents(1, false);
      }, 100);
    }, [dispatch])
  );

  // Handle API responses with pagination logic
  useEffect(() => {
    if (
      listEvent?.status === true ||
      listEvent?.status === "true" ||
      listEvent?.status === 1 ||
      listEvent?.status === "1"
    ) {
      console.log("List event response:", listEvent);

      // Extract events from the response
      const eventsData = listEvent?.data || [];

      console.log("=== API RESPONSE DEBUG ===");
      console.log("Events received:", eventsData.length);
      console.log("Current page:", currentPage);
      console.log("Full API response:", JSON.stringify(listEvent, null, 2));

      // Handle pagination based on API response page, not local state
      const apiPage = listEvent?.pagination?.page || listEvent?.page || 1;

      if (apiPage === 1) {
        // First page - replace data
        setEvents(eventsData);
        setCurrentPage(1);
        console.log(
          "Set initial events:",
          eventsData.length,
          "API page:",
          apiPage
        );
      } else {
        // Load more - append data with duplicate prevention
        setEvents((prevEvents) => {
          // Filter out duplicates based on _id
          const existingIds = new Set(prevEvents.map((event) => event._id));
          const uniqueNewEvents = eventsData.filter(
            (event) => !existingIds.has(event._id)
          );

          const newEvents = [...prevEvents, ...uniqueNewEvents];
          console.log(
            "Appended events. Previous:",
            prevEvents.length,
            "New unique:",
            uniqueNewEvents.length,
            "Filtered out:",
            eventsData.length - uniqueNewEvents.length,
            "Total:",
            newEvents.length,
            "API page:",
            apiPage
          );
          return newEvents;
        });
        setCurrentPage(apiPage);
      }

      // Update pagination info from API response
      const totalFromAPI =
        listEvent?.pagination?.total || listEvent?.total || 0;
      const limitFromAPI =
        listEvent?.pagination?.limit || listEvent?.limit || pageLimit;
      const currentPageFromAPI =
        listEvent?.pagination?.page || listEvent?.page || currentPage;

      // Calculate total pages manually if not provided by API
      const totalPagesFromAPI =
        listEvent?.totalPages ||
        listEvent?.pagination?.totalPages ||
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
    }

    if (listEventErr) {
      console.log("List event error:", listEventErr);
      setIsLoading(false);
    }
  }, [listEvent, listEventErr, currentPage]);

  // Handle delete event response
  useEffect(() => {
    console.log("deleteEvent useEffect triggered:", deleteEvent);
    console.log("deleteEventErr:", deleteEventErr);

    if (
      deleteEvent?.status === true ||
      deleteEvent?.status === "true" ||
      deleteEvent?.status === 1 ||
      deleteEvent?.status === "1"
    ) {
      console.log("Delete successful, showing toast and setting timeout");
      showToast("success", "Event deleted successfully!");

      // Clear the delete event state to prevent multiple triggers
      dispatch(deleteEventData(""));

      // Reload screen after successful delete
      fetchEvents(1, false);
    }

    if (deleteEventErr) {
      console.log("Delete error:", deleteEventErr);
      showToast("error", deleteEventErr ? deleteEventErr : "Failed to delete event");
      // Clear the error state
      dispatch(deleteEventError(""));
    }
  }, [deleteEvent, deleteEventErr, dispatch]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleEventPress = (event: Event) => {
    console.log("Event pressed:", event);
    (navigation as any).navigate("DetailScreen", {
      clubId: event._id,
    });
  };

  const handleEditEvent = (event: Event) => {
    console.log("Edit event pressed:", event);
    (navigation as any).navigate("EditDetailScreen", {
      clubId: event._id,
    });
  };

  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Deleting event:", event._id);
            console.log("Dispatching onDeleteEvent action...");
            dispatch(onDeleteEvent({ id: event._id }));
            console.log("onDeleteEvent action dispatched");
          },
        },
      ]
    );
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Helper function to format time
  const formatTime = (timeString: string | undefined) => {
    // Handle undefined or null values
    if (!timeString || typeof timeString !== 'string') {
      return '';
    }
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderEventCard = (event: Event) => {
    return (
      <View key={event._id} style={styles.eventCard}>
        <LinearGradient
          colors={["#1F0045", "#120128"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardGradient}
        >
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => handleEventPress(event)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              {event.photos && event.photos.length > 0 ? (
                <Image
                  source={{ uri: event.photos[0] }}
                  style={styles.eventImage}
                />
              ) : (
                <View
                  style={[
                    styles.eventImage,
                    {
                      backgroundColor: colors.gray,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    No Image
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.textContainer}>
              <View style={styles.topContent}>
                <View style={styles.categoryContainer}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{event.type}</Text>
                  </View>
                </View>

                <Text style={styles.eventName}>{event.name}</Text>

                <Text
                  style={styles.eventDescription}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {event?.type !== "VIP Entry" && event?.type !== "Booth"
                    ? event.details
                    : event.address}
                </Text>
              </View>

              {/* Date & Time - Only show for non-Table types */}
              {event.type !== "Table" && event.openingTime && event.startDate && (
                <View style={styles.timeContainer}>
                  <ClockIcon />
                  <Text style={styles.timeText}>
                    {formatDate(event.startDate)} -{" "}
                    {formatTime(event.openingTime)}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditEvent(event)}
              activeOpacity={0.7}
            >
              <EditIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteEvent(event)}
              activeOpacity={0.7}
            >
              <DeleteIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.profileCardBackground}
      statusBarStyle="light-content"
      statusBarBackgroundColor={colors.profileCardBackground}
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <BackButton navigation={navigation} onBackPress={handleBackPress} />
          <Text style={styles.headerTitle}>Manage Availability</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={events}
          renderItem={({ item }) => renderEventCard(item)}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={
            !isLoading ? (
              listEventErr ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 50,
                  }}
                >
                  <Text style={{ color: colors.white, textAlign: "center" }}>
                    Error loading events. Please try again.
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 50,
                  }}
                >
                  <Text style={{ color: colors.white, textAlign: "center" }}>
                    No events available.
                  </Text>
                </View>
              )
            ) : null
          }
          ListFooterComponent={
            isLoading && currentPage > 1 ? (
              <View
                style={{
                  paddingVertical: 20,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color={colors.white} />
                <Text
                  style={{
                    color: colors.white,
                    marginTop: 10,
                    fontSize: 14,
                  }}
                >
                  Loading more events...
                </Text>
              </View>
            ) : null
          }
          refreshing={isLoading && currentPage === 1}
          onRefresh={onRefresh}
          onEndReached={() => {
            console.log("=== ON END REACHED TRIGGERED ===");
            console.log("Current events count:", events.length);
            loadMoreData();
          }}
          onEndReachedThreshold={0.1}
        />
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default ManageAvailability;
