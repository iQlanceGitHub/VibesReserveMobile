import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { colors } from "../../../../utilis/colors";
import PeopleIcon from "../../../../assets/svg/peopleIcon";
import ChatIcon from "../../../../assets/svg/chatIcon";
import ClockIcon from "../../../../assets/svg/clockIcon";
import LocationFavourite from "../../../../assets/svg/locationFavourite";
import CloseIcon from "../../../../assets/svg/closeIcon";
import PhoneIcon from "../../../../assets/svg/phoneIcon";
import MusicIcon from "../../../../assets/svg/musicIcon";
import styles from "./hostBookingStyles";

interface BookingData {
  id: string;
  userName: string;
  userImage: any;
  category: string;
  eventName: string;
  location: string;
  date: string;
  time: string;
  people: string;
  price: string;
  rejectionReason?: string;
}

const HostBookingScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"accepted" | "rejected">(
    "accepted"
  );

  // Sample data for accepted bookings
  const acceptedBookings: BookingData[] = [
    {
      id: "1",
      userName: "Mike Hussey",
      userImage: {
        uri: "https://via.placeholder.com/60x60/8D34FF/FFFFFF?text=MH",
      },
      category: "Lounge",
      eventName: "DJ Night Party",
      location: "Los Angeles, CA",
      date: "Aug 03 to 06",
      time: "10:00 PM",
      people: "4 Person",
      price: "$2025.00",
    },
    {
      id: "2",
      userName: "John Miller",
      userImage: {
        uri: "https://via.placeholder.com/60x60/8D34FF/FFFFFF?text=JM",
      },
      category: "Lounge",
      eventName: "DJ Night Party",
      location: "Los Angeles, CA",
      date: "Aug 03 to 06",
      time: "10:00 PM",
      people: "4 Person",
      price: "$2025.00",
    },
  ];

  // Sample data for rejected bookings
  const rejectedBookings: BookingData[] = [
    {
      id: "3",
      userName: "Eve Leroy",
      userImage: {
        uri: "https://via.placeholder.com/60x60/8D34FF/FFFFFF?text=EL",
      },
      category: "Lounge",
      eventName: "DJ Night Party",
      location: "Los Angeles, CA",
      date: "Aug 03 to 06",
      time: "10:00 PM",
      people: "2 Person",
      price: "$1025.00",
      rejectionReason: "No available seats/tables.",
    },
    {
      id: "4",
      userName: "Lyle Kauffman",
      userImage: {
        uri: "https://via.placeholder.com/60x60/8D34FF/FFFFFF?text=LK",
      },
      category: "Lounge",
      eventName: "DJ Night Party",
      location: "Los Angeles, CA",
      date: "Aug 07 to 09",
      time: "11:30 PM",
      people: "3 Person",
      price: "$1525.00",
      rejectionReason: "Selected timing no longer available.",
    },
  ];

  const currentBookings =
    selectedTab === "accepted" ? acceptedBookings : rejectedBookings;

  const handleCall = (bookingId: string) => {
    console.log("Call booking:", bookingId);
    // Implement call functionality
  };

  const handleChat = (bookingId: string) => {
    console.log("Chat booking:", bookingId);
    // Implement chat functionality
  };

  const handleAccept = (bookingId: string) => {
    console.log("Accept booking:", bookingId);
    // Implement accept functionality
  };

  const renderBookingCard = (booking: BookingData) => (
    <View
      key={booking.id}
      style={
        selectedTab === "rejected"
          ? styles.rejectedBookingCard
          : styles.bookingCard
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Image source={booking.userImage} style={styles.profileImage} />
        </View>

        <View style={styles.rightSection}>
          <View style={styles.headerRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{booking.category}</Text>
            </View>
            {selectedTab === "accepted" && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(booking.id)}
                >
                  <PhoneIcon size={16} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleChat(booking.id)}
                >
                  <ChatIcon size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{booking.userName}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MusicIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.eventName}</Text>
            </View>

            <View style={styles.detailRow}>
              <LocationFavourite width={14} height={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <ClockIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>
                {booking.date} - {booking.time}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <PeopleIcon size={14} color={colors.white} />
              <Text style={styles.detailText}>{booking.people}</Text>
              <Text style={styles.priceText}>{booking.price}</Text>
            </View>
          </View>
        </View>
      </View>

      {selectedTab === "rejected" && (
        <View style={styles.rejectionRow}>
          <CloseIcon size={14} color={colors.red} />
          <Text style={styles.rejectionText}>
            Reason: {booking.rejectionReason || "No reason provided"}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "accepted" && styles.activeTab]}
          onPress={() => setSelectedTab("accepted")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "accepted" && styles.activeTabText,
            ]}
          >
            Accepted
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "rejected" && styles.activeTab]}
          onPress={() => setSelectedTab("rejected")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "rejected" && styles.activeTabText,
            ]}
          >
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {currentBookings.map(renderBookingCard)}
      </ScrollView>
    </View>
  );
};

export default HostBookingScreen;
