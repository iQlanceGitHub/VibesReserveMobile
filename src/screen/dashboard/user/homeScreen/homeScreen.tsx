import React, { useState, useEffect } from 'react';
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
import { useCategory } from '../../../../hooks/useCategory';
import { useFacility } from '../../../../hooks/useFacility';


//API
import {
  onHome,
  homeData,
  homeError,
  onFilter,
  filterData,
  filterError,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
} from '../../../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomAlertSingleBtn } from '../../../../components/CustomeAlertDialog';

const categories = [
  { id: "all", name: "🔥 All" },
  { id: "vip", name: "🥂 VIP Clubs" },
  { id: "dj", name: "🎧 DJ Nights" },
  { id: "events", name: "🎟️ Events" },
  { id: "lounge", name: "🍸 Lounge Bars" },
  { id: "live", name: "🎤 Live Music" },
  { id: "dance", name: "🕺 Dance Floors" },
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

  const [featured, setFeatured] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState('');
  const [shouldNavigateToFilter, setShouldNavigateToFilter] = useState(false);

  const dispatch = useDispatch();
  const home = useSelector((state: any) => state.auth.home);
  const homeErr = useSelector((state: any) => state.auth.homeErr);
  const filter = useSelector((state: any) => state.auth.filter);
  const filterErr = useSelector((state: any) => state.auth.filterErr);
  const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
  const togglefavoriteErr = useSelector((state: any) => state.auth.togglefavoriteErr);
  const [msg, setMsg] = useState('');

  // Use the custom hook for category management
  const { categories: apiCategories, fetchCategories } = useCategory();
  const { facilities, isLoading, error, fetchFacilities, refreshFacilities } = useFacility();

  
  // Use the custom hook for home data management
  // Default location coordinates
  const defaultLat = "72.51123340677258";
  const defaultLong = "23.012649201096547";

  // Get user ID from AsyncStorage
  const getUserID = async (): Promise<string | null> => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData?.id || '';
        setUserId(userId);
        return userId;
      }
      return null;
    } catch (error) {
      console.log('Error getting user ID:', error);
      return null;
    }
  };

  // Fetch categories and home data when component mounts
  useEffect(() => {
    fetchCategories();
    getUserID();
  }, [fetchCategories]);

  useEffect(() => {
    fetchFacilities();
    console.log("facilities:->", facilities);
  }, [fetchFacilities]);

  useEffect(() => {
    const callHomeAPI = async () => {
      const userId = await getUserID();
      dispatch(onHome({
        lat: defaultLong,
        long: defaultLat,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      }));
    };
    callHomeAPI();
  }, []);

  // Use API categories if available, otherwise fallback to static categories
  const allCategories = apiCategories.length > 0 ? [
    { _id: "all", name: "🔥 All" },
    ...apiCategories
  ] : categories;


  const handleCategoryPress = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    const userId = await getUserID();
    
    // Refresh home data with new category filter
    if (categoryId !== 'all') {
      const homeParams = {
        lat: defaultLong,
        long: defaultLat,
        categoryid: categoryId,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      };
      dispatch(onHome(homeParams));
    } else {
      // If "All" is selected, fetch without category filter
      const homeParams = {
        lat: defaultLong,
        long: defaultLat,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      };
      dispatch(onHome(homeParams));
    }
  };
  
  const onSearchClose = () => {
    setSearchVal('');
    // Reset to original data when search is cleared
    const callHomeAPI = async () => {
      const userId = await getUserID();
      dispatch(onHome({
        lat: defaultLong,
        long: defaultLat,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      }));
    };
    callHomeAPI();
  };

  const handleSearch = async (searchText: string) => {
    setSearchVal(searchText);
    
    if (searchText.trim().length > 0) {
      const userId = await getUserID();
      dispatch(onHome({
        lat: defaultLong,
        long: defaultLat,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
        search_keyword: searchText.trim(),
      }));
    } else {
      // If search is empty, fetch original data
      const userId = await getUserID();
      dispatch(onHome({
        lat: defaultLong,
        long: defaultLat,
        userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
      }));
    }
  };


  useEffect(() => {
    if (
      home?.status === true ||
      home?.status === 'true' ||
      home?.status === 1 ||
      home?.status === "1"
    ) {
      console.log("home:+>", home);
      console.log("featured data:", home?.data?.featured);
      console.log("nearby data:", home?.data?.nearby);
      
      if (home?.data?.featured) {
        setFeatured(home.data.featured);
      }
      if (home?.data?.nearby) {
        setNearby(home.data.nearby);
      }
      dispatch(homeData(''));
    }

    if (homeErr) {
      console.log("homeErr:+>", homeErr);
      setMsg(homeErr?.message?.toString())
      dispatch(homeError(''));
    }
  }, [home, homeErr, dispatch]);

  // Handle filter API response
  useEffect(() => {
    if (
      filter?.status === true ||
      filter?.status === 'true' ||
      filter?.status === 1 ||
      filter?.status === "1"
    ) {
      console.log("filter response:+>", filter);
      setFilteredData(filter?.data || []);
      dispatch(filterData(''));
    }

    if (filterErr) {
      console.log("filterErr:+>", filterErr);
      setMsg(filterErr?.message?.toString())
      dispatch(filterError(''));
      // Reset navigation flag on error
      setShouldNavigateToFilter(false);
    }
  }, [filter, filterErr, dispatch]);

  // Navigate to FilterListScreen when filter API is successful
  useEffect(() => {
    if (
      shouldNavigateToFilter &&
      (filter?.status === true ||
      filter?.status === 'true' ||
      filter?.status === 1 ||
      filter?.status === "1")
    ) {
      // Navigate to FilterListScreen with filtered data
      (navigation as any).navigate("FilterListScreen", { filteredData: filteredData });
      // Reset the flag
      setShouldNavigateToFilter(false);
    }
  }, [filter, filteredData, navigation, shouldNavigateToFilter]);

  // Handle Toggle Favorite API response
  useEffect(() => {
    const handleToggleFavoriteResponse = async () => {
      if (
        togglefavorite?.status === true ||
        togglefavorite?.status === 'true' ||
        togglefavorite?.status === 1 ||
        togglefavorite?.status === "1"
      ) {
        console.log("togglefavorite response in home:+>", togglefavorite);
        const userId = await getUserID();
        dispatch(onHome({
          lat: defaultLong,
          long: defaultLat,
          userId: userId || "68c17979f763e99ba95a6de4", // fallback userId
        }));
        dispatch(togglefavoriteData(''));
      }

      if (togglefavoriteErr) {
        console.log("togglefavoriteErr in home:+>", togglefavoriteErr);
        setMsg(togglefavoriteErr?.message?.toString());
        dispatch(togglefavoriteError(''));
      }
    };

    handleToggleFavoriteResponse();
  }, [togglefavorite, togglefavoriteErr, dispatch]);
  
  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };
  
  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };
  
  const handleFilterApply = (filterValues: any) => {
    console.log('=== FILTER APPLY CALLED ===');
    console.log('Filter Values:', filterValues);
    
    // Format the filter data according to API requirements
    const filterPayload = {
      lat: "23.0126",
      long: "72.5112",
      categoryId: filterValues?.selectedCategory?.id !== 'all' ? filterValues?.selectedCategory?.id : undefined,
      minPrice: filterValues?.priceRange?.min || 0,
      maxPrice: filterValues?.priceRange?.max || 3000,
      date: filterValues?.selectedDate?.formattedDate || new Date().toISOString().split('T')[0],
      minDistance: filterValues?.distanceRange?.min || 0,
      maxDistance: filterValues?.distanceRange?.max || 20,
      userId: userId || "68c147b05f4b76754d914383" // fallback user ID
    };

    console.log('Filter Payload:', filterPayload);
    
    // Set flag to navigate when filter response is received
    setShouldNavigateToFilter(true);
    
    // Call filter API
    dispatch(onFilter(filterPayload));
  };

  const handleBookNow = (eventId?: string) => {
    console.log('Book Now clicked for event:', eventId);
    // Handle booking logic here
    (navigation as any).navigate("ClubDetailScreen", { clubId: eventId || '68b6eceba9ae1fc590695248' });
  };

  const handleFavorite = (eventId: string) => {
    console.log('Toggling favorite for event ID:', eventId);
    dispatch(onTogglefavorite({ eventId }));
  };

  const handleFavoritePress = (eventId: string) => {
    console.log('Toggling favorite for event ID:', eventId);
    dispatch(onTogglefavorite({ eventId }));
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
              onChangeText={handleSearch}
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
            <TouchableOpacity style={styles.filterButton} onPress={()=> (navigation as any).navigate("ExploreScreen", { nearbyEvents: nearby, featuredEvents: featured })}>
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
        {allCategories.map((category) => {
          const categoryId = (category as any)._id || (category as any).id;
          const categoryTitle = (category as any).name || (category as any).title;
          return (
            <CategoryButton
              key={categoryId}
              title={categoryTitle}
              isSelected={selectedCategory === categoryId}
              onPress={() => handleCategoryPress(categoryId)}
            />
          );
        })}
        </ScrollView>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContent}
      >
        {/* Featured Event */}
        <Text style={styles.sectionTitle}>Featured ({featured.length})</Text>
         <FlatList
         horizontal
          data={featured.length > 0 ? featured : []}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.FeatureEventContainer}
          keyExtractor={(item, index) => (item as any)._id || index.toString()}
          renderItem={({ item }) => {
            return (
              <EventCard
                title={(item as any).name}
                location={(item as any).address}
                date={new Date((item as any).startDate).toLocaleDateString()}
                price={`$${(item as any).entryFee}`}
                tag={(item as any).type}
                image={(item as any).photos?.[0] || ''}
                rating={4.5}
                isFavorite={(item as any).isFavorite}
                onBookNow={() => handleBookNow((item as any)._id)}
                onFavoritePress={() => handleFavoritePress((item as any)._id || (item as any).id)}
                _id={(item as any)._id || (item as any).id}
              />
            );
          }}
        />

        {/* Nearby Events */}
        <View style={styles.nearbyHeaderRow}>
          <Text style={styles.sectionTitle}>Nearby</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate("NearbyEventsSeeAllScreen", { nearbyEvents: nearby })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {nearby.length > 0 ? (
          <FlatList
            data={nearby}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.nearbyEventsContainer}
            keyExtractor={(item, index) => (item as any)._id || (item as any).id || index.toString()}
            renderItem={({ item }) => (
              <NearbyEventCard
                event={item}
                onPress={() => handleBookNow((item as any)._id || (item as any).id)}
                onFavoritePress={() => handleFavoritePress((item as any)._id || (item as any).id)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No nearby events found</Text>
          </View>
        )}
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