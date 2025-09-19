import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from './styles';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';
import ArrowDownIcon from '../../../../../../assets/svg/arrowDownIcon';

interface LocationDropdownProps {
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

const locations = [
  'New York, USA',
  'Toronto, Canada',
  'Los Angeles, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Berlin, Germany',
  'Mumbai, India',
  'Dubai, UAE',
];

const LocationDropdown: React.FC<LocationDropdownProps> = ({ 
  selectedLocation, 
  onLocationSelect 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    setIsVisible(false);
  };

  const renderLocationItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.locationItem,
        selectedLocation === item && styles.locationItemSelected
      ]}
      onPress={() => handleLocationSelect(item)}
    >
      <Text
        style={[
          styles.locationItemText,
          selectedLocation === item && styles.locationItemTextSelected
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
  style={styles.locationButton} 
  onPress={() => setIsVisible(true)}
>
  <Text style={styles.locationText}>{selectedLocation}</Text>
  <ArrowDownIcon size={16} color={colors.white} />
</TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={locations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default LocationDropdown;
