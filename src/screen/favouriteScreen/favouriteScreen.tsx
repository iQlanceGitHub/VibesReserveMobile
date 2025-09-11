import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import CategoryButton from "../../components/CategoryButton";
import EventCard from "../../components/EventCard";
import styles from "./styles";

interface FavouriteScreenProps {
  navigation?: any;
}

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
  {
    id: "5",
    name: "Elite VIP Lounge",
    category: "VIP Clubs",
    location: "Toronto, ON",
    date: "Sept 2",
    time: "9:00 PM",
    price: "$120",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "6",
    name: "Summer Concert Series",
    category: "Events",
    location: "Vancouver, BC",
    date: "Sept 8",
    time: "7:00 PM",
    price: "$65",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "7",
    name: "Rock Festival 2024",
    category: "Concerts",
    location: "Calgary, AB",
    date: "Sept 15",
    time: "6:00 PM",
    price: "$95",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "8",
    name: "Pool Party Bash",
    category: "Parties",
    location: "Miami, FL",
    date: "Sept 12",
    time: "2:00 PM",
    price: "$45",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
  {
    id: "9",
    name: "Music Festival",
    category: "Festivals",
    location: "Austin, TX",
    date: "Sept 20",
    time: "12:00 PM",
    price: "$150",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    isFavorite: true,
  },
];

const categories = [
  { id: "all", title: "All" },
  {
    id: "vip",
    title: "VIP Clubs",
  },
  {
    id: "dj",
    title: "DJ Nights",
  },
  {
    id: "events",
    title: "Events",
  },
  {
    id: "lounge",
    title: "Lounge Bars",
  },
  {
    id: "live",
    title: "Live Music",
  },
  {
    id: "dance",
    title: "Dance Floors",
  },
];

const FavouriteScreen: React.FC<FavouriteScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState(sampleEvents);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleEventPress = (eventId: string) => {
    console.log("Event pressed:", eventId);
    // Navigate to event details
  };

  const handleFavoritePress = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, isFavorite: !event.isFavorite }
          : event
      )
    );
  };

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => {
          switch (selectedCategory) {
            case "vip":
              return event.category === "VIP Clubs";
            case "dj":
              return event.category === "DJ Nights";
            case "events":
              return event.category === "Events";
            case "lounge":
              return event.category === "Lounge Bars";
            case "live":
              return event.category === "Live Music";
            case "dance":
              return event.category === "Dance Floors";
            default:
              return true;
          }
        });

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
            <Text style={styles.title}>Favourite</Text>
          </View>

          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  title={category.title}
                  isSelected={selectedCategory === category.id}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.eventsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eventsContent}
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
                onFavoritePress={() => handleFavoritePress(event.id)}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default FavouriteScreen;
