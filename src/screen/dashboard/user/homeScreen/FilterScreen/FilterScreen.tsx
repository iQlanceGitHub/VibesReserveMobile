import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import CategoryButton from '../../../../../components/CategoryButton';
import PriceRangeSlider from './components/PriceRangeSlider';
import DistanceSlider from './components/DistanceSlider';
import DateButton from './components/DateButton';
import LocationDropdown from './components/LocationDropdown';

interface FilterScreenProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ visible, onClose, onApply }) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [distanceRange, setDistanceRange] = useState([0, 20]);
  const [selectedLocation, setSelectedLocation] = useState('New York, USA');

  const categories = [
    { id: "all", title: "🔥 All" },
    { id: "vip", title: "🥂 VIP Clubs" },
    { id: "dj", title: "🎧 DJ Nights" },
    { id: "events", title: "🎉 Events" },
    { id: "lounge", title: "🍸 Lounge Bars" },
    { id: "live", title: "🎤 Live Music" },
    { id: "dance", title: "🕺 Dance Floors" },
  ];

  const dates = [
    { id: "today", title: "Today 4 Sep" },
    { id: "mon", title: "Mon 5 Sep" },
    { id: "tue", title: "Tue 6 Sep" },
    { id: "wed", title: "Wed 7 Sep" },
    { id: "thu", title: "Thu 8 Sep" },
  ];

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
    onApply();
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
                {categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    title={category.title}
                    isSelected={selectedCategory === category.id}
                    onPress={() => handleCategoryPress(category.id)}
                    style={styles.categoryButton}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Price Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <PriceRangeSlider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
              />
            </View>

            {/* Distance Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <DistanceSlider
                value={distanceRange}
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
                    title={date.title}
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
