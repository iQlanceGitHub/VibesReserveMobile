import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import ClockIcon from "../../../../assets/svg/clockIcon";
import { onListEvent } from "../../../../redux/auth/actions";
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
  const { listEvent, listEventErr } = useSelector((state: any) => state.auth);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch events when component mounts
    dispatch(onListEvent({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (listEvent?.data && Array.isArray(listEvent.data)) {
      setEvents(listEvent.data);
    } else if (listEvent?.status === 1 && listEvent?.data) {
      setEvents(listEvent.data);
    }
  }, [listEvent, listEventErr]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleEventPress = (event: Event) => {};

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
      <TouchableOpacity
        key={event._id}
        style={styles.eventCard}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#1F0045", "#120128"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
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
          </View>
        </LinearGradient>
      </TouchableOpacity>
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
