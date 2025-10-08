import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./clubProfileStyle";
import { colors } from "../../../../../utilis/colors";
import { BackButton } from "../../../../../components/BackButton";
import LocationFavourite from "../../../../../assets/svg/locationFavourite";
import ArrowRightIcon from "../../../../../assets/svg/arrowRightIcon";
import MessageIcon from "../../../../../assets/svg/messageIcon";
import PhoneIcon from "../../../../../assets/svg/phoneIcon";
import EditIcon from "../../../../../assets/svg/editIcon";
import {
  onHostProfile,
  hostProfileData,
  hostProfileError,
} from "../../../../../redux/auth/actions";

const clubProfileData = {
  id: "1",
  name: "Neon Nights",
  category: "DJ Nights",
  location: "New York, USA",
  address: "123 Broadway, New York, NY 10001",
  rating: 4.8,
  image:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
  description:
    "Premier electronic music venue featuring world-class DJs and immersive lighting experiences.",
  capacity: "500",
  openingHours: "9:00 PM - 4:00 AM",
  amenities: ["VIP Bottle Service", "Dance Floor", "Sound System", "Parking"],
};

const ClubProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { clubId, hostData, eventsData } = route.params as {
    clubId: string;
    hostData?: any;
    eventsData?: any[];
  };

  const [activeTab, setActiveTab] = useState("Club");
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [hostEvents, setHostEvents] = useState<any[]>([]);

  // Redux state
  const hostProfileRedux = useSelector((state: any) => state.auth.hostProfile);
  const hostProfileErr = useSelector((state: any) => state.auth.hostProfileErr);

  const tabs = ["Club", "Booth", "Event", "VIP"];

  // Log the received data
  useEffect(() => {
    console.log("ClubProfileScreen loaded with:");
    console.log("clubId:", clubId);
    console.log("hostData:", hostData);
    console.log("eventsData:", eventsData);
  }, [clubId, hostData, eventsData]);

  // Call hostprofile API when component mounts
  useEffect(() => {
    if (clubId) {
      console.log("Calling hostprofile API with clubId:", clubId);
      dispatch(onHostProfile({ hostId: clubId }));
    }
  }, [clubId, dispatch]);

  // Handle hostprofile API response
  useEffect(() => {
    if (
      hostProfileRedux?.status === true ||
      hostProfileRedux?.status === "true" ||
      hostProfileRedux?.status === 1 ||
      hostProfileRedux?.status === "1"
    ) {
      console.log(
        "HostProfile API response in ClubProfileScreen:",
        hostProfileRedux
      );
      console.log("Host data:", hostProfileRedux?.host);
      console.log("Events data:", hostProfileRedux?.events);

      setHostProfile(hostProfileRedux?.host);
      setHostEvents(hostProfileRedux?.events || []);

      dispatch(hostProfileData(""));
    }

    if (hostProfileErr) {
      console.log("HostProfile error in ClubProfileScreen:", hostProfileErr);
      dispatch(hostProfileError(""));
    }
  }, [hostProfileRedux, hostProfileErr, dispatch]);

  const handleNextPress = (event: any) => {
    // Check if data is still loading
    if (!hostProfile) {
      Alert.alert(
        "Please Wait",
        "Club details are still loading. Please wait a moment and try again.",
        [{ text: "OK" }]
      );
      return;
    }

    // Check if data failed to load
    if (!event) {
      Alert.alert(
        "Data Not Available",
        "Unable to load event details. Please try again or go back and select a different event.",
        [
          {
            text: "Try Again",
            onPress: () => {
              // Retry loading data
              dispatch(onHostProfile({ hostId: clubId }));
            },
          },
          { text: "Go Back", onPress: () => navigation.goBack() },
        ]
      );
      return;
    }

    let selectedData: any = null;
    let isBooth = false;

    // Check if this is a booth or VIP event
    if (event.type === "Booth" || event.type === "VIP Entry") {
      // For booth and VIP events, we need to check if they have booth/VIP data
      // This would typically come from the event's booths or tickets array
      if (event.booths && event.booths.length > 0) {
        selectedData = event.booths[0]; // Use first booth if available
        isBooth = true;
      } else if (event.tickets && event.tickets.length > 0) {
        selectedData = event.tickets[0]; // Use first ticket if available
        isBooth = false;
      }
    }

    console.log("selectedData:=>", selectedData);
    console.log("event:=>", event);

    // If no booth/ticket selected, use entryFee as the price
    const entryFee = event?.entryFee || 0;

    // Combine event data with selected information
    const baseEventData = event || {};
    const combinedEventData = {
      ...baseEventData,
      selectedTicket: selectedData, // Keep the same name for consistency
      // If no selection, don't include booth/ticket specific fields
      ...(selectedData
        ? {
            [isBooth ? "booths" : "tickets"]: [
              {
                [isBooth ? "boothType" : "ticketType"]: {
                  _id: selectedData.id || selectedData._id || "",
                  name:
                    selectedData.title ||
                    selectedData.name ||
                    (isBooth ? "Selected Booth" : "Selected Ticket"),
                },
                [isBooth ? "boothPrice" : "ticketPrice"]:
                  selectedData.price ||
                  selectedData.boothPrice ||
                  selectedData.ticketPrice ||
                  0,
                capacity: selectedData.capacity || 1,
                _id: selectedData.id || selectedData._id || "",
                // Add booth-specific fields if it's a booth
                ...(isBooth
                  ? {
                      boothName:
                        selectedData.name ||
                        selectedData.title ||
                        selectedData.boothName,
                      discountedPrice:
                        selectedData.discountedPrice ||
                        selectedData.price ||
                        selectedData.boothPrice,
                      boothImage: selectedData.image
                        ? [selectedData.image]
                        : selectedData.boothImage || [],
                    }
                  : {}),
              },
            ],
          }
        : {
            // When no booth/ticket selected, use entryFee and don't include booth/ticket specific fields
            entryFee: entryFee,
            // Don't include boothCost, boothType, boothId, ticketCost, ticketType, ticketid
          }),
    };

    console.log("Combined event data for booking:", combinedEventData);
    (navigation as any).navigate("ClubBookingScreen", {
      eventData: combinedEventData,
    });
  };

  const renderTabButton = (tab: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.activeTabButtonText,
        ]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderClubContent = () => {
    // Get only Club type events
    const clubEvents = hostEvents.filter((event) => event.type === "Club");

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Club Events ({clubEvents.length})
        </Text>
        {clubEvents.length > 0 ? (
          clubEvents.map((event, index) => (
            <TouchableOpacity
              onPress={() =>
                (navigation as any).navigate("ClubDetailScreen", {
                  clubId: event._id,
                })
              }
              key={event._id || index}
              style={styles.boothCard}
            >
              <View style={styles.boothInfo}>
                <View style={styles.boothHeader}>
                  <Text style={styles.boothName}>
                    {event.name || "Club Event"}
                  </Text>
                  <Text style={styles.categoryTag}>{event.type}</Text>
                </View>
                <View style={styles.boothDetails}>
                  <Text style={styles.boothCapacity}>
                    Entry Fee: ${event.entryFee}
                  </Text>
                  <View style={styles.boothPriceContainer}>
                    <Text style={styles.boothPrice}>
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : "TBD"}
                    </Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No club events available</Text>
        )}
      </View>
    );
  };

  const renderBoothContent = () => {
    // Get only Booth type events
    const boothEvents = hostEvents.filter((event) => event.type === "Booth");

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Booth Events ({boothEvents.length})
        </Text>
        {boothEvents.length > 0 ? (
          boothEvents.map((event, index) => (
            <TouchableOpacity
              onPress={() => handleNextPress(event)}
              key={event._id || index}
              style={styles.boothCard}
            >
              <View style={styles.boothInfo}>
                <View style={styles.boothHeader}>
                  <Text style={styles.boothName}>
                    {event.name || "Booth Event"}
                  </Text>
                  <Text style={styles.categoryTag}>{event.type}</Text>
                </View>
                <View style={styles.boothDetails}>
                  <Text style={styles.boothCapacity}>
                    Entry Fee: ${event.entryFee}
                  </Text>
                  <View style={styles.boothPriceContainer}>
                    <Text style={styles.boothPrice}>
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : "TBD"}
                    </Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No booth events available</Text>
        )}
      </View>
    );
  };

  const renderEventTicketsContent = () => {
    // Get only Event type events
    const eventTypeEvents = hostEvents.filter(
      (event) => event.type === "Event"
    );

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Event Services ({eventTypeEvents.length})
        </Text>

        {eventTypeEvents.length > 0 ? (
          eventTypeEvents.map((event, index) => (
            <TouchableOpacity
              key={event._id || index}
              style={styles.eventCard}
              onPress={() =>
                (navigation as any).navigate("ClubDetailScreen", {
                  clubId: event._id,
                })
              }
            >
              <View style={styles.eventInfo}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName}>{event.name || "Event"}</Text>
                  <Text style={styles.categoryTag}>{event.type}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventCapacity}>
                    Entry Fee: ${event.entryFee}
                  </Text>
                  <View style={styles.eventPriceContainer}>
                    <Text style={styles.eventPrice}>
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : "TBD"}
                    </Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No event tickets available</Text>
        )}
      </View>
    );
  };

  const renderVipContent = () => {
    // Get VIP type events
    const vipEvents = hostEvents.filter((event) => event.type === "VIP Entry");

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>VIP Events ({vipEvents.length})</Text>

        {vipEvents.length > 0 ? (
          vipEvents.map((event, index) => (
            <TouchableOpacity
              key={event._id || index}
              style={styles.boothCard}
              onPress={() => handleNextPress(event)}
            >
              <View style={styles.boothInfo}>
                <View style={styles.boothHeader}>
                  <Text style={styles.boothName}>
                    {event.name || "VIP Event"}
                  </Text>
                  <Text style={styles.categoryTag}>{event.type}</Text>
                </View>
                <View style={styles.boothDetails}>
                  <Text style={styles.boothCapacity}>
                    Entry Fee: ${event.entryFee}
                  </Text>
                  <View style={styles.boothPriceContainer}>
                    <Text style={styles.boothPrice}>
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : "TBD"}
                    </Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No VIP events available</Text>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Club":
        return renderClubContent();
      case "Booth":
        return renderBoothContent();
      case "Event":
        return renderEventTicketsContent();
      case "VIP":
        return renderVipContent();
      default:
        return renderClubContent();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.profileCardContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  hostProfile?.businessPicture || hostProfile?.profilePicture,
              }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>
              {hostProfile?.businessName ||
                hostProfile?.fullName ||
                clubProfileData.name}
            </Text>

            <View style={styles.locationRow}>
              <LocationFavourite size={14} color={colors.violate} />
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.locationText}
              >
                {hostProfile?.address}
              </Text>
            </View>
            <Text
              style={styles.descriptionText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {hostProfile?.businessDescription}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.smallContainer}>
        <Text style={styles.smallContainerText}>Contact Info</Text>
        <Text style={styles.hostNameContainerText}>
          {hostProfile?.fullName}
        </Text>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MessageIcon width={20} height={20} color={colors.violate} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <PhoneIcon width={20} height={20} color={colors.violate} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>{tabs.map(renderTabButton)}</View>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default ClubProfileScreen;
