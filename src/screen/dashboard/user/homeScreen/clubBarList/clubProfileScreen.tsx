import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./clubProfileStyle";
import { colors } from "../../../../../utilis/colors";
import { BackButton } from "../../../../../components/BackButton";
import LocationFavourite from "../../../../../assets/svg/locationFavourite";
import ArrowRightIcon from "../../../../../assets/svg/arrowRightIcon";
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

  const tabs = ["Club", "Pub", "Event"];

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

  const renderBoothsContent = () => {
    // Get only Club type events
    const clubEvents = hostEvents.filter((event) => event.type === "Club");
    const allBooths = clubEvents.flatMap((event) => event.booths || []);

  
    return (
      console.log('allBooths::===>', clubEvents),
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Club Services ({allBooths.length})
        </Text>

        {allBooths.length > 0 ? (
          allBooths.map((booth, index) => (
            console.log('booth::===>', booth),
            <TouchableOpacity onPress={() => (navigation as any).navigate("ClubDetailScreen", {
              clubId:clubEvents[index]._id,
            })} key={booth._id || index} style={styles.boothCard}>
              <View style={styles.boothInfo}>
                <View style={styles.boothHeader}>
                  <Text style={styles.boothName}>{booth.boothName}</Text>
                  {booth.boothTypeName && (
                    <Text style={styles.categoryTag}>
                      {booth.boothTypeName}
                    </Text>
                  )}
                </View>
                <View style={styles.boothDetails}>
                  <Text style={styles.boothCapacity}>
                    Capacity: {booth.capacity} people
                  </Text>
                  <View style={styles.boothPriceContainer}>
                    <Text style={styles.boothPrice}>
                      {booth.discountedPrice
                        ? `$${booth.discountedPrice}`
                        : `$${booth.boothPrice}`}
                    </Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No booths available</Text>
        )}
      </View>
    );
  };

  const renderEventTicketsContent = () => {
    // Get only Event type events
    const eventTypeEvents = hostEvents.filter(
      (event) => event.type === "Event"
    );
    const allTickets = eventTypeEvents.flatMap((event) => event.tickets || []);

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Event Services ({allTickets.length})
        </Text>

        {allTickets.length > 0 ? (
          allTickets.map((ticket, index) => (
            <TouchableOpacity
              key={ticket._id || index}
              style={styles.eventCard}
              onPress={() => (navigation as any).navigate("ClubDetailScreen", {
                clubId:eventTypeEvents[index]._id,
              })}
            >
              <View style={styles.eventInfo}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName}>{ticket.ticketTypeName}</Text>
                  <Text style={styles.categoryTag}>Event</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventCapacity}>
                    Capacity: {ticket.capacity} people
                  </Text>
                  <View style={styles.eventPriceContainer}>
                    <Text style={styles.eventPrice}>${ticket.ticketPrice}</Text>
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

  const renderPubsContent = () => {
    // Get only Pub type events
    const pubTypeEvents = hostEvents.filter((event) => event.type === "Pub");

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          Pub Services ({pubTypeEvents.length})
        </Text>

        {pubTypeEvents.length > 0 ? (
          pubTypeEvents.map((event, index) => (
            <TouchableOpacity key={event._id || index} style={styles.pubCard}
            onPress={() => (navigation as any).navigate("ClubDetailScreen", {
              clubId:hostEvents[index]._id,
            })}>
              <View style={styles.pubInfo}>
                <View style={styles.pubHeader}>
                  <Text style={styles.pubName}>{event.name}</Text>
                  <Text style={styles.categoryTag}>{event.type}</Text>
                </View>
                <Text
                  style={styles.pubDescription}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {event.details}
                </Text>
                <View style={styles.pubDetails}>
                  <Text style={styles.pubAvailability}>
                    {event.openingTime} - {event.closeTime}
                  </Text>
                  <View style={styles.pubPriceContainer}>
                    <Text style={styles.pubPrice}>${event.entryFee}</Text>
                    <ArrowRightIcon size={16} color={colors.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No pub services available</Text>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Club":
        return renderBoothsContent();
      case "Pub":
        return renderPubsContent();
      case "Event":
        return renderEventTicketsContent();
      default:
        return renderBoothsContent();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.clubInfoContainer}>
        <Image
          source={{
            uri: hostProfile?.businessPicture,
          }}
          style={styles.clubImage}
        />
        <View style={styles.clubDetails}>
          <Text style={styles.clubName}>
            {hostProfile?.businessName ||
              hostProfile?.fullName ||
              clubProfileData.name}
          </Text>
          <View style={styles.locationRow}>
            <LocationFavourite size={14} color={colors.violate} />
            <Text style={styles.locationText}>{hostProfile?.address}</Text>
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
