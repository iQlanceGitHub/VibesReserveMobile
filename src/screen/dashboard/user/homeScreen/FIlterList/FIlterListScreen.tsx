import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NearbyEventCard from '../card/nearbyEvent/nearbyEvent';
import { BackButton } from '../../../../../components/BackButton';
import styles from './styles';

// Sample filtered events data
const filteredEvents = [
  {
    id: "1",
    name: "Neon Nights",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$500",
    image: {
      uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: false,
  },
  {
    id: "2",
    name: "Aurora Lounge",
    category: "Lounge Bars",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$550",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    isFavorite: false,
  },
  {
    id: "3",
    name: "Opulence Club",
    category: "VIP Clubs",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$600",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    },
    isFavorite: false,
  },
  {
    id: "4",
    name: "Vibe Nation",
    category: "Dance Floors",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$625",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    },
    isFavorite: false,
  },
  {
    id: "5",
    name: "Aurora Lounge",
    category: "Lounge Bars",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$550",
    image: {
      uri: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    },
    isFavorite: false,
  },
  {
    id: "6",
    name: "Neon Nights",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$500",
    image: {
      uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: false,
  },
];

const FilterListScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState(filteredEvents);

  const handleFavoritePress = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, isFavorite: !event.isFavorite }
          : event
      )
    );
  };

  const handleEventPress = (event: any) => {
    console.log('Event pressed:', event.name);
    // Navigate to event details screen
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <NearbyEventCard
      event={item}
      onPress={() => handleEventPress(item)}
      onFavoritePress={() => handleFavoritePress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton navigation={navigation} onBackPress={() => navigation.goBack()} />
      
      </View>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>New York, USA</Text>
        <View style={styles.headerSpacer} />
      </View>
      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
      />
    </SafeAreaView>
  );
};

export default FilterListScreen;
