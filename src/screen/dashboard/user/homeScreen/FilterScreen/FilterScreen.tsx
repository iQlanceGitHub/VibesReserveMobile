import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import CategoryButton from '../../../../../components/CategoryButton';
import PriceRangeSlider from './components/PriceRangeSlider';
import DistanceSlider from './components/DistanceSlider';
import DateButton from './components/DateButton';
import LocationDropdown from './components/LocationDropdown';
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
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [distanceRange, setDistanceRange] = useState([0, 20]);
  const [selectedLocation, setSelectedLocation] = useState('New York, USA');

  // Use the custom hook for category management
  const { categories, isLoading, error, fetchCategories } = useCategory();

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Add "All" category at the beginning and fallback to static categories
  const allCategories = [
    { _id: "all", name: "🔥 All" },
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

  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setSelectedDate('today');
    setPriceRange([0, 3000]);
    setDistanceRange([0, 20]);
    setSelectedLocation('New York, USA');
  }, []);

  const handleApply = useCallback(() => {
    // Collect all selected filter values
        const selectedCategoryData = allCategories.find(cat => (cat as any).id === selectedCategory || (cat as any)._id === selectedCategory);
    const selectedDateData = dates.find(date => date.id === selectedDate);
    
    const filterValues = {
      selectedCategory: {
        id: selectedCategory,
        data: selectedCategoryData
      },
      selectedDate: {
        id: selectedDate,
        data: selectedDateData,
        formattedDate: selectedDateData?.formattedDate || new Date().toISOString().split('T')[0] // YYYY-MM-DD format
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
      timestamp: new Date().toISOString()
    };

    console.log('=== FILTER SCREEN - APPLIED VALUES ===');
    console.log('Filter Applied at:', filterValues.timestamp);
    console.log('Selected Category:', filterValues.selectedCategory);
    console.log('Selected Date:', filterValues.selectedDate);
    console.log('Formatted Date (YYYY-MM-DD):', filterValues.selectedDate.formattedDate);
    console.log('Price Range:', filterValues.priceRange);
    console.log('Distance Range:', filterValues.distanceRange);
    console.log('Selected Location:', filterValues.selectedLocation);
    console.log('=====================================');

    onApply(filterValues);
    onClose();
  }, [onApply, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Location Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <LocationDropdown
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
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
    </Modal>
  );
};

export default FilterScreen;
