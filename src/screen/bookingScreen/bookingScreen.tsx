import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import locationFavourite from "../../assets/svg/locationFavourite";
import ClockIcon from "../../assets/svg/clockIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";

interface BookingScreenProps {
  navigation?: any;
}

// Sample booking data
const sampleBookings = [
  {
    id: "1",
    name: "Neon Nights",
    category: "DJ Nights",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$500",
    image: {
      uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
    },
    status: "upcoming",
  },
  {
    id: "2",
    name: "Sunset Jazz Fest",
    category: "Live Music",
    location: "Montreal, QC",
    date: "Sept 5",
    time: "4:00 PM",
    price: "$225",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    status: "upcoming",
  },
];

const completedBookings = [
  {
    id: "3",
    name: "Summer Concert",
    category: "Concerts",
    location: "Toronto, ON",
    date: "Aug 15",
    time: "7:00 PM",
    price: "$150",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    },
    status: "completed",
  },
];

const cancelledBookings = [
  {
    id: "4",
    name: "Pool Party",
    category: "Parties",
    location: "Miami, FL",
    date: "Aug 20",
    time: "2:00 PM",
    price: "$80",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    status: "cancelled",
  },
];

const tabs = [
  { id: "upcoming", title: "Upcoming" },
  { id: "completed", title: "Completed" },
  { id: "cancelled", title: "Cancelled" },
];

const BookingCard: React.FC<{
  booking: any;
  onCancel: () => void;
}> = ({ booking, onCancel }) => {
  const getButtonText = () => {
    switch (booking.status) {
      case "completed":
        return "Leave Review";
      case "cancelled":
        return "Book Again";
      default:
        return "Cancel";
    }
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardTopSection}>
        <Image source={booking.image} style={styles.bookingImage} />

        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{booking.category}</Text>
            </View>
            <Text style={styles.priceText}>{booking.price}</Text>
          </View>

          <Text style={styles.eventName}>{booking.name}</Text>

          <View style={styles.detailsRow}>
            <LocationFavourite size={14} color={colors.violate} />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>

          <View style={styles.detailsRow}>
            <ClockIcon size={14} color={colors.violate} />
            <Text style={styles.detailText}>
              {booking.date} - {booking.time}
            </Text>
          </View>
        </View>
      </View>

      {booking.status !== "cancelled" && (
        <>
          <View style={styles.separatorLine} />

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  const handleTabPress = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const handleCancelBooking = (bookingId: string) => {};

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      // Here you would typically fetch fresh data from your API
      // For now, we'll just reset the refreshing state
      setRefreshing(false);
    }, 2000);
  };

  const getBookingsForTab = () => {
    switch (selectedTab) {
      case "upcoming":
        return sampleBookings;
      case "completed":
        return completedBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return [];
    }
  };

  const currentBookings = getBookingsForTab();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.statusBar}></View>
            <Text style={styles.title}>Bookings</Text>
          </View>

          <View style={styles.tabsSection}>
            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    selectedTab === tab.id
                      ? styles.selectedTab
                      : styles.unselectedTab,
                  ]}
                  onPress={() => handleTabPress(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab.id
                        ? styles.selectedTabText
                        : styles.unselectedTabText,
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <ScrollView
            style={styles.bookingsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bookingsContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.violate]} // Android
                tintColor={colors.violate} // iOS
                title="Pull to refresh"
                titleColor={colors.white}
              />
            }
          >
            {currentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default BookingScreen;
