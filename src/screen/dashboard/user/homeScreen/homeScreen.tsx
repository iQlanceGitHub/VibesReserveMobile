import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // or your icon lib
import AppleIcon from "../../../../assets/svg/appleIcon";
import CategoryButton from '../../../../components/CategoryButton';
 import EventCard from './card/featuredEvent/featuredEvent';
 import LocationFavouriteWhiteIcon from '../../../../assets/svg/locationFavouriteWhiteIcon';
 import NotificationUnFillIcon from '../../../../assets/svg/notificationUnFillIcon';


import NearbyEventCard from './card/nearbyEvent/nearbyEvent';
import { colors } from '../../../../utilis/colors';
import Filtericon from '../../../../assets/svg/filtericon';
import Blox from '../../../../assets/svg/blox';
import SearchIcon from '../../../../assets/svg/searchIcon';
import FilterScreen from './FilterScreen/FilterScreen';

const categories = [
  { id: "all", title: "🔥 All" },
  { id: "vip", title: "🥂 VIP Clubs" },
  { id: "dj", title: "🎧 DJ Nights" },
  { id: "events", title: "🎟️ Events" },
  { id: "lounge", title: "🍸 Lounge Bars" },
  { id: "live", title: "🎤 Live Music" },
  { id: "dance", title: "🕺 Dance Floors" },
];

const featuredEvent = {
  image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  title: 'Friday Night Party',
  location: 'Bartonfort, Canada',
  date: 'Aug 29 - 10:00 PM',
  rating: 4.8,
  price: 120,
  tag: 'DJ Nights',
};

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
 
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState(sampleEvents);
  const [searchVal, setSearchVal] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const onSearchClose = () => {
    setSearchVal('');
  };
  
  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };
  
  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };
  
  const handleFilterApply = () => {
    // Navigate to FilterListScreen when Apply is pressed
    navigation.navigate("FilterListScreen" as never);
  };

  const handleBookNow = () => {
    console.log('Book Now clicked');
    // Handle booking logic here
    navigation.navigate("ClubDetailScreen" as never);
  };

  const handleFavorite = (isFavorite: boolean) => {
    console.log('Favorite status:', isFavorite);
    // Handle favorite logic here
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

  return (
    <View style={styles.container}>
      {/* Top Section: Location & Search */}
      <View style={styles.topSection}>
        <View style={styles.locationRow}>
        <LocationFavouriteWhiteIcon size={18} color={colors.violate} />
        <Text style={styles.locationText}>Toronto, Canada.</Text>
        <TouchableOpacity
          style={styles.mapIcon}
          onPress={() => navigation.navigate("FilterListScreen" as never)}
        >
          <NotificationUnFillIcon />
        </TouchableOpacity>
        </View>
        {/* <View style={styles.searchBar}>
          <AppleIcon />
          <TextInput
            placeholder="Search clubs, events, Bars..."
            placeholderTextColor="#B983FF"
            style={styles.searchInput}
          />
        </View> */}
       
        
      </View>
       <View style={styles.topSection}>
         
          <View style={styles.inputContainer}>
            <SearchIcon size={18} color={colors.violate} />
            <TextInput
              value={searchVal}
              onChangeText={setSearchVal}
              style={styles.input}
              placeholder="Search clubs, events, Bars,..."
              placeholderTextColor={'#9CA3AF'}
            />
            {searchVal && (
              <TouchableOpacity onPress={onSearchClose}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
              <Filtericon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={()=> navigation.navigate("ExploreScreen" as never)}>
             <LocationFavouriteWhiteIcon />
            </TouchableOpacity>
          </View>
        </View>

        
      {/* Categories */}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContent}
      >
        {/* Featured Event */}
        <Text style={styles.sectionTitle}>Featured</Text>
       
         <FlatList
         horizontal
          data={sampleEvents}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.FeatureEventContainer}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <EventCard
          onBookNow={handleBookNow}
          onFavoritePress={handleFavorite}
        />
          )}
        />

        {/* Nearby Events */}
        <View style={styles.nearbyHeaderRow}>
          <Text style={styles.sectionTitle}>Nearby</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>
        <FlatList
          data={sampleEvents}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.nearbyEventsContainer}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <NearbyEventCard
              event={item}
              onPress={() => console.log('Nearby event pressed:', item.name)}
              onFavoritePress={() => handleFavoritePress(item.id)}
            />
          )}
        />
      </ScrollView>
      
      {/* Filter Modal */}
      <FilterScreen
        visible={isFilterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />
      
      {/* Bottom navigation is assumed to be handled by your navigator */}
    </View>
  );
};

export default HomeScreen;