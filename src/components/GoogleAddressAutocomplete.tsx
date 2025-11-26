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

  // Google Places API key
  const GOOGLE_MAPS_API_KEY = 'AIzaSyANTuJKviWz3jnUFMiqr_1FgghfAAek0q8';

  // Real Google Places API call
  const searchAddresses = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&types=geocode&components=country:us|country:ca|country:gb|country:au|country:in`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        const predictions = data.predictions.map((prediction: any) => ({
          formatted_address: prediction.description,
          geometry: {
            location: {
              lat: 0, // Will be fetched separately
              lng: 0
            }
          },
          place_id: prediction.place_id,
        }));
        setPredictions(predictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Get place details with coordinates
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry,formatted_address`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      }
    } catch (error) {
    }
    return null;
  };

  const handleSelect = async (address: AddressResult) => {
    // Get full place details with coordinates
    const details = await getPlaceDetails(address.place_id);
    if (details) {
      const fullAddress = {
        ...address,
        formatted_address: details.formatted_address || address.formatted_address,
        geometry: {
          location: {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng
          }
        }
      };
      onSelect(fullAddress);
    } else {
      onSelect(address);
    }
    setSearchQuery('');
    setPredictions([]);
  };

  const renderAddressItem = ({ item }: { item: AddressResult }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => handleSelect(item)}
    >
      <LocationIcon width={20} height={20} color={colors.gray} />
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

