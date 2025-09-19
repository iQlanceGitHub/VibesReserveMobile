import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { horizontalScale, verticalScale, fontScale } from '../utilis/appConstant';
import LocationIcon from '../assets/svg/locationIcon';
import BackIcon from '../assets/svg/backIcon';

interface AddressResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

interface GoogleAddressAutocompleteProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: AddressResult) => void;
}

const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock Google Places API - Replace with actual Google Places API
  const searchAddresses = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    
    // Mock data - Replace with actual Google Places API call
    const mockPredictions: AddressResult[] = [
      {
        formatted_address: `${query}, Toronto, ON, Canada`,
        geometry: {
          location: {
            lat: 43.6532,
            lng: -79.3832,
          },
        },
        place_id: '1',
      },
      {
        formatted_address: `${query} Street, Toronto, ON, Canada`,
        geometry: {
          location: {
            lat: 43.6532,
            lng: -79.3832,
          },
        },
        place_id: '2',
      },
      {
        formatted_address: `${query} Avenue, Toronto, ON, Canada`,
        geometry: {
          location: {
            lat: 43.6532,
            lng: -79.3832,
          },
        },
        place_id: '3',
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (address: AddressResult) => {
    onSelect(address);
    setSearchQuery('');
    setPredictions([]);
  };

  const renderAddressItem = ({ item }: { item: AddressResult }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => handleSelect(item)}
    >
      <LocationIcon size={20} color={colors.gray} />
      <Text style={styles.addressText} numberOfLines={2}>
        {item.formatted_address}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <BackIcon size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Address</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for address..."
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {loading && (
            <ActivityIndicator
              size="small"
              color={colors.BtnBackground}
              style={styles.loadingIndicator}
            />
          )}
        </View>

        {/* Results */}
        <FlatList
          data={predictions}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.place_id}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && searchQuery ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No addresses found</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.BtnBackground,
  },
  backButton: {
    padding: horizontalScale(5),
  },
  headerTitle: {
    color: colors.white,
    fontSize: fontScale(18),
    fontWeight: '600',
    fontFamily: fonts.semiBold,
  },
  placeholder: {
    width: horizontalScale(34),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.BtnBackground,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: horizontalScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.BtnBackground,
  },
  loadingIndicator: {
    marginLeft: horizontalScale(10),
  },
  resultsList: {
    flex: 1,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.BtnBackground,
  },
  addressText: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    marginLeft: horizontalScale(12),
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
  },
  emptyText: {
    color: colors.gray,
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
  },
});

export default GoogleAddressAutocomplete;

