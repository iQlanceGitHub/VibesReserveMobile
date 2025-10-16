import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { colors } from '../../../../../utilis/colors';
import CategoryButton from '../../../../../components/CategoryButton';
import PriceRangeSlider from './components/PriceRangeSlider';
import DistanceSlider from './components/DistanceSlider';
import DateButton from './components/DateButton';
import GoogleAddressAutocomplete from '../../../../../components/GoogleAddressAutocomplete';
import { useCategory } from '../../../../../hooks/useCategory';

interface FilterScreenProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filterValues: any) => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ visible, onClose, onApply }) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [priceRange, setPriceRange] = useState([1, 5000]);
  const [distanceRange, setDistanceRange] = useState([0, 20]);
  const [selectedLocation, setSelectedLocation] = useState('Search Location');
  const [address, setAddress] = useState('Search Location');
  const [coordinates, setCoordinates] = useState({
    type: "Point",
    coordinates: [0, 0]
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userId, setUserId] = useState('');

  // Use the custom hook for category management
  const { categories, isLoading, error, fetchCategories } = useCategory();

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser.id || '');
        }
      } catch (e) {
        console.error("Failed to fetch the user.", e);
      }
    };
    getUser();
  }, []);

  // Add "All" category at the beginning and fallback to static categories
  const allCategories = [
    { _id: "all", name: "All" },
    ...(categories.length > 0 ? categories : [
    ])
  ];

 // Generate dates for next 15 days
 const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    
    const id = i === 0 ? 'today' : `day_${i}`;
    const dayText = i === 0 ? 'Today' : dayName;
    const dateText = `${day} ${month}`;
    
    dates.push({
      id,
      dayText,
      dateText,
      date: date,
      formattedDate: date.toISOString().split('T')[0] // YYYY-MM-DD format
    });
  }
  
  return dates;
};

const dates = generateDates();

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleDatePress = useCallback((dateId: string) => {
    setSelectedDate(dateId);
  }, []);

  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
  }, []);

  const handleDistanceRangeChange = useCallback((value: [number, number]) => {
    setDistanceRange(value);
  }, []);

  const handleAddressSelect = useCallback((selectedAddress: any) => {
    setAddress(selectedAddress.formatted_address);
    setSelectedLocation(selectedAddress.formatted_address);
    setCoordinates({
      type: "Point",
      coordinates: [selectedAddress.geometry.location.lat, selectedAddress.geometry.location.lng]
    });
    setShowAddressModal(false);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setSelectedDate('today');
    setPriceRange([1, 5000]);
    setDistanceRange([0, 20]);
    setSelectedLocation('Search Location');
    setAddress('Search Location');
    setCoordinates({
      type: "Point",
      coordinates: [0, 0]
    });
  }, []);

  const handleApply = useCallback(() => {
    // Collect all selected filter values
    const selectedCategoryData = allCategories.find(cat => (cat as any).id === selectedCategory || (cat as any)._id === selectedCategory);
    const selectedDateData = dates.find(date => date.id === selectedDate);
    
    // Format data according to API requirements
    const apiFilterData = {
      lat: coordinates.coordinates[0]?.toString() || "23.0126", // Default coordinates if not selected
      long: coordinates.coordinates[1]?.toString() || "72.5112",
      categoryId: selectedCategory === 'all' ? '' : selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      date: selectedDateData?.formattedDate || new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      minDistance: distanceRange[0],
      maxDistance: distanceRange[1],
      userId: userId
    };

    // Also keep the original format for backward compatibility
    const filterValues = {
      selectedCategory: {
        id: selectedCategory,
        data: selectedCategoryData
      },
      selectedDate: {
        id: selectedDate,
        data: selectedDateData,
        formattedDate: selectedDateData?.formattedDate || new Date().toISOString().split('T')[0]
      },
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
        range: priceRange
      },
      distanceRange: {
        min: distanceRange[0],
        max: distanceRange[1],
        range: distanceRange
      },
      selectedLocation: selectedLocation,
      address: address,
      coordinates: coordinates,
      userId: userId,
      apiData: apiFilterData, // Include the API-formatted data
      timestamp: new Date().toISOString()
    };


    onApply(filterValues);
    onClose();
  }, [onApply, onClose, selectedCategory, selectedDate, priceRange, distanceRange, selectedLocation, address, coordinates, userId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
        <View style={styles.filterContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter</Text>
            <TouchableOpacity 
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }} 
              onPress={onClose}
            >
              <Text style={{
                fontSize: 18,
                color: colors.white,
                fontWeight: 'bold',
              }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Location Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => setShowAddressModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.locationText}>{address}</Text>
                <Text style={styles.locationIcon}>📍</Text>
              </TouchableOpacity>
            </View>

            {/* Categories Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                  {allCategories.map((category) => (
                    <CategoryButton
                      key={(category as any)._id || (category as any).id}
                      title={(category as any).name}
                      isSelected={selectedCategory === ((category as any)._id || (category as any).id)}
                      onPress={() => handleCategoryPress((category as any)._id || (category as any).id)}
                    />
                  ))}
              </ScrollView>
            </View>

            {/* Price Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
            <PriceRangeSlider
              value={priceRange as [number, number]}
              onValueChange={handlePriceRangeChange}
            />
            </View>

            {/* Distance Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
            <DistanceSlider
              value={distanceRange as [number, number]}
              onValueChange={handleDistanceRangeChange}
            />
            </View>

            {/* Date Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesContainer}
              >
               {dates.map((date) => (
                  <DateButton
                    key={date.id}
                    dayText={date.dayText}
                    dateText={date.dateText}
                    isSelected={selectedDate === date.id}
                    onPress={() => handleDatePress(date.id)}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Address Selection Modal */}
      <GoogleAddressAutocomplete
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={handleAddressSelect}
      />
    </Modal>
  );
};

export default FilterScreen;
