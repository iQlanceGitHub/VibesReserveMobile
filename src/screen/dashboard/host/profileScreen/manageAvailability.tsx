import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
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
import { onListEvent, onDeleteEvent, deleteEventData, deleteEventError } from "../../../../redux/auth/actions";
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
}

interface ManageAvailabilityProps {
  navigation?: any;
}

const ManageAvailability: React.FC<ManageAvailabilityProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { listEvent, listEventErr, deleteEvent, deleteEventErr } = useSelector((state: any) => state.auth);
  const [events, setEvents] = useState<Event[]>([]);

  // Debug Redux state
  useEffect(() => {
    console.log('Full Redux auth state:', { listEvent, listEventErr, deleteEvent, deleteEventErr });
    console.log('deleteEvent type:', typeof deleteEvent);
    console.log('deleteEventErr type:', typeof deleteEventErr);
  }, [listEvent, listEventErr, deleteEvent, deleteEventErr]);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused - reloading events');
      dispatch(onListEvent({ page: 1, limit: 10 }));
    }, [dispatch])
  );

  useEffect(() => {
    if (listEvent?.data && Array.isArray(listEvent.data)) {
      setEvents(listEvent.data);
    } else if (listEvent?.status === 1 && listEvent?.data) {
      setEvents(listEvent.data);
    }
  }, [listEvent, listEventErr]);

  // Handle delete event response
  useEffect(() => {
    console.log('deleteEvent useEffect triggered:', deleteEvent);
    console.log('deleteEventErr:', deleteEventErr);
    
    if (deleteEvent?.status === true || deleteEvent?.status === 'true' || deleteEvent?.status === 1 || deleteEvent?.status === "1") {
      console.log('Delete successful, showing toast and setting timeout');
      showToast('success', 'Event deleted successfully!');
      
      // Clear the delete event state to prevent multiple triggers
      dispatch(deleteEventData(""));
      
      // Reload screen after 10 seconds
      dispatch(onListEvent({ page: 1, limit: 10 }));
    }

    if (deleteEventErr) {
      console.log('Delete error:', deleteEventErr);
      showToast('error', 'Failed to delete event');
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
      'Delete Event',
      `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting event:', event._id);
            console.log('Dispatching onDeleteEvent action...');
            dispatch(onDeleteEvent({ id: event._id }));
            console.log('onDeleteEvent action dispatched');
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
  const formatTime = (timeString: string) => {
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
                  {event.details}
                </Text>
              </View>

              <View style={styles.timeContainer}>
                <ClockIcon />
                <Text style={styles.timeText}>
                  {formatDate(event.startDate)} -{" "}
                  {formatTime(event.openingTime)}
                </Text>
              </View>
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

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {listEventErr ? (
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
          ) : events.length === 0 ? (
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
          ) : (
            events.map((event) => renderEventCard(event))
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default ManageAvailability;
