import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./clubBarListStyle";
import { colors } from "../../../../../utilis/colors";
import LocationFavourite from "../../../../../assets/svg/locationFavourite";
import ArrowRightIcon from "../../../../../assets/svg/arrowRightIcon";
import { BackButton } from "../../../../../components/BackButton";

const clubBarData = [
  {
    id: "1",
    name: "Neon Nights",
    location: "New York, USA",
    address: "123 Broadway, New York, NY 10001",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$500",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
    events: [
      {
        id: "e1",
        name: "Electronic Music Fest",
        date: "Sep 6",
        time: "9:00 PM",
        price: "$120",
        type: "event",
      },
      {
        id: "e2",
        name: "Live DJ Performance",
        date: "Sep 8",
        time: "10:00 PM",
        price: "$100",
        type: "event",
      },
    ],
    parties: [
      {
        id: "p1",
        name: "Friday Night Party",
        date: "Sep 4",
        time: "10:00 PM",
        price: "$80",
        type: "party",
      },
      {
        id: "p2",
        name: "DJ Battle Night",
        date: "Sep 5",
        time: "11:00 PM",
        price: "$100",
        type: "party",
      },
      {
        id: "p3",
        name: "Neon Glow Party",
        date: "Sep 7",
        time: "10:30 PM",
        price: "$90",
        type: "party",
      },
    ],
    expanded: false,
  },
  {
    id: "2",
    name: "Aurora Lounge",
    location: "New York, USA",
    address: "456 5th Avenue, New York, NY 10018",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$550",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    events: [
      {
        id: "e3",
        name: "Live Acoustic Session",
        date: "Sep 6",
        time: "9:00 PM",
        price: "$50",
        type: "event",
      },
      {
        id: "e4",
        name: "Jazz Performance",
        date: "Sep 8",
        time: "8:00 PM",
        price: "$60",
        type: "event",
      },
    ],
    parties: [
      {
        id: "p4",
        name: "Cocktail Masterclass",
        date: "Sep 5",
        time: "7:00 PM",
        price: "$75",
        type: "party",
      },
      {
        id: "p5",
        name: "Wine Tasting Evening",
        date: "Sep 7",
        time: "6:30 PM",
        price: "$85",
        type: "party",
      },
    ],
    expanded: false,
  },
  {
    id: "3",
    name: "Opulence Club",
    location: "New York, USA",
    address: "789 Park Avenue, New York, NY 10021",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$600",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    events: [
      {
        id: "e5",
        name: "Celebrity Meet & Greet",
        date: "Sep 5",
        time: "9:00 PM",
        price: "$300",
        type: "event",
      },
    ],
    parties: [
      {
        id: "p6",
        name: "VIP Bottle Service Night",
        date: "Sep 4",
        time: "10:00 PM",
        price: "$200",
        type: "party",
      },
      {
        id: "p7",
        name: "Private Room Experience",
        date: "Sep 6",
        time: "11:00 PM",
        price: "$500",
        type: "party",
      },
      {
        id: "p8",
        name: "Luxury Champagne Night",
        date: "Sep 7",
        time: "10:30 PM",
        price: "$400",
        type: "party",
      },
    ],
    expanded: false,
  },
  {
    id: "4",
    name: "Vibe Nation",
    location: "New York, USA",
    address: "321 Times Square, New York, NY 10036",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$625",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    events: [
      {
        id: "e6",
        name: "Garba Night",
        date: "Sep 4",
        time: "8:00 PM",
        price: "$50",
        type: "event",
      },
      {
        id: "e7",
        name: "Bollywood Dance Party",
        date: "Sep 5",
        time: "9:00 PM",
        price: "$60",
        type: "event",
      },
      {
        id: "e8",
        name: "Latin Dance Night",
        date: "Sep 7",
        time: "9:30 PM",
        price: "$65",
        type: "event",
      },
    ],
    parties: [
      {
        id: "p9",
        name: "Hip Hop Battle",
        date: "Sep 6",
        time: "10:00 PM",
        price: "$70",
        type: "party",
      },
    ],
    expanded: false,
  },
  {
    id: "5",
    name: "Sunset Jazz Bar",
    location: "New York, USA",
    address: "654 Greenwich Village, New York, NY 10014",
    date: "Sep 4",
    time: "8:00 PM",
    price: "$350",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop",
    events: [
      {
        id: "e9",
        name: "Jazz Fusion Night",
        date: "Sep 4",
        time: "8:00 PM",
        price: "$40",
        type: "event",
      },
      {
        id: "e10",
        name: "Blues & Soul Session",
        date: "Sep 5",
        time: "9:00 PM",
        price: "$45",
        type: "event",
      },
      {
        id: "e11",
        name: "Acoustic Guitar Night",
        date: "Sep 6",
        time: "7:30 PM",
        price: "$35",
        type: "event",
      },
      {
        id: "e12",
        name: "Smooth Jazz Evening",
        date: "Sep 7",
        time: "8:30 PM",
        price: "$50",
        type: "event",
      },
    ],
    parties: [],
    expanded: false,
  },
  {
    id: "6",
    name: "Electric Dreams",
    location: "New York, USA",
    address: "987 SoHo, New York, NY 10012",
    date: "Sep 4",
    time: "11:00 PM",
    price: "$450",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    events: [
      {
        id: "e13",
        name: "Electronic Music Festival",
        date: "Sep 4",
        time: "11:00 PM",
        price: "$80",
        type: "event",
      },
      {
        id: "e14",
        name: "Techno Night",
        date: "Sep 5",
        time: "10:00 PM",
        price: "$70",
        type: "event",
      },
      {
        id: "e15",
        name: "EDM Party",
        date: "Sep 6",
        time: "11:30 PM",
        price: "$90",
        type: "event",
      },
    ],
    parties: [
      {
        id: "p10",
        name: "House Music Night",
        date: "Sep 7",
        time: "10:30 PM",
        price: "$75",
        type: "party",
      },
    ],
    expanded: false,
  },
];

const ClubBarListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params as { eventId?: string };
  const [clubs, setClubs] = useState(clubBarData);

  // Log the eventId when component mounts
  React.useEffect(() => {
    if (eventId) {
    }
  }, [eventId]);

  const handleViewProfile = (clubId: string) => {
    (navigation as any).navigate("ClubProfileScreen", { clubId });
  };

  const renderClubCard = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleViewProfile(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.clubImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.clubName}>{item.name}</Text>
          <View style={styles.detailsRow}>
            <LocationFavourite size={14} color={colors.violate} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewProfile(item.id)}
          >
            <ArrowRightIcon size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.headerTitle}>Clubs & Bars</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>New York, USA</Text>
      </View>

      <FlatList
        data={clubs}
        renderItem={renderClubCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ClubBarListScreen;
