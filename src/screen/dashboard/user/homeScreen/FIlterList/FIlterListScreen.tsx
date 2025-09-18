import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

interface FilterListScreenProps {
  route: {
    params: {
      filteredData: any[];
    };
  };
}

const FilterListScreen: React.FC<FilterListScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [events, setEvents] = useState<any[]>([]);
  
  // Get filtered data from navigation params
  const { filteredData = [] } = (route.params as any) || {};

  // Set events from filtered data when component mounts or filteredData changes
  useEffect(() => {
    if (filteredData && Array.isArray(filteredData) && filteredData.length > 0) {
      setEvents(filteredData);
    } else {
      setEvents([]);
    }
  }, [filteredData]);

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
       {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>New York, USA</Text>
        <View style={styles.headerSpacer} />
      </View> */}
      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item, index) => (item as any)._id || (item as any).id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your filters to find more events
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FilterListScreen;
