import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import ClockIcon from "../../../../assets/svg/clockIcon";
import styles from "./manageAvailabityStyle";

interface Event {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string;
  time: string;
  image: any;
}

interface ManageAvailabilityProps {
  navigation?: any;
}

const ManageAvailability: React.FC<ManageAvailabilityProps> = ({
  navigation,
}) => {
  const [events] = useState<Event[]>([
    {
      id: "1",
      name: "Neon Nights",
      category: "DJ Nights",
      description:
        "Experience electrifying beats and vibrant lights at Neon Nights enjoying the Montreal sunset.",
      date: "Aug 29",
      time: "10:00 PM",
      image: {
        uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      },
    },
    {
      id: "2",
      name: "Sunset Jazz Fest",
      category: "Live Music",
      description: "Chill to smooth jazz while enjoying the Montreal sunset.",
      date: "Sept 5",
      time: "4:00 PM",
      image: {
        uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      },
    },
    {
      id: "3",
      name: "Electric Pulse",
      category: "Pub",
      description: "Feel the city's heartbeat with EDM and craft cocktails.",
      date: "Aug 29",
      time: "10:00 PM",
      image: {
        uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      },
    },
    {
      id: "4",
      name: "Midnight Madness",
      category: "Club",
      description: "Turn your night into a wild dance party.",
      date: "Aug 29",
      time: "10:00 PM",
      image: {
        uri: "https://images.unsplash.com/photo-1571266028243-e68c76670109?w=400&h=300&fit=crop",
      },
    },
  ]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleEventPress = (event: Event) => {
  };

  const renderEventCard = (event: Event) => {
    return (
      <TouchableOpacity
        key={event.id}
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
              <Image source={event.image} style={styles.eventImage} />
            </View>

            <View style={styles.textContainer}>
              <View style={styles.topContent}>
                <View style={styles.categoryContainer}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                  </View>
                </View>

                <Text style={styles.eventName}>{event.name}</Text>

                <Text
                  style={styles.eventDescription}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {event.description}
                </Text>
              </View>

              <View style={styles.timeContainer}>
                <ClockIcon />
                <Text style={styles.timeText}>
                  {event.date} - {event.time}
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
          {events.map((event) => renderEventCard(event))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default ManageAvailability;
