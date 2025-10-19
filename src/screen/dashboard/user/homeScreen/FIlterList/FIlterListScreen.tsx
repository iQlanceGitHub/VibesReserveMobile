import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import NearbyEventCard from '../card/nearbyEvent/nearbyEvent';
import { BackButton } from '../../../../../components/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import { onTogglefavorite } from '../../../../../redux/auth/actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handleRestrictedAction } from '../../../../../utilis/userPermissionUtils';
import CustomAlert from '../../../../../components/CustomAlert';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../../../../utilis/appConstant';
import styles from './styles';

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
  const dispatch = useDispatch();
  const [events, setEvents] = useState<any[]>([]);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });
  
  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();
  
  // Get filter data from Redux store
  const filterResponse = useSelector((state: any) => state.auth?.filter || {});
  const filterError = useSelector((state: any) => state.auth?.filterErr || null);
  
  // Extract the actual data from the response object
  let filterData = filterResponse?.data || [];
  
  // Fallback: Check route params if Redux data is empty
  const routeParams = (route.params as any) || {};
  const routeFilterData = routeParams.filteredData || [];
  
  if (filterData.length === 0 && routeFilterData.length > 0) {
    console.log('Using route params as fallback for filter data');
    filterData = routeFilterData;
  }
  
  // Debug: Check if filterResponse has the expected structure
  if (filterResponse && Object.keys(filterResponse).length > 0) {
    console.log('FilterResponse structure:', {
      hasStatus: 'status' in filterResponse,
      hasMessage: 'message' in filterResponse,
      hasData: 'data' in filterResponse,
      status: filterResponse.status,
      message: filterResponse.message,
      dataLength: filterResponse.data?.length || 0
    });
  }
  
  console.log('Final filterData to use:', filterData);
  
  // Use refs to track previous values and prevent unnecessary updates
  const prevFilterDataRef = useRef<any>(null);
  const prevFilterErrorRef = useRef<any>(null);
  
  console.log('FilterListScreen - Redux filter response:', filterResponse);
  console.log('FilterListScreen - Extracted filter data:', filterData);
  console.log('FilterListScreen - Redux filter error:', filterError);

  // Set events from Redux filter data when component mounts or filterData changes
  useEffect(() => {
    console.log('=== useEffect triggered ===');
    console.log('filterResponse:', filterResponse);
    console.log('filterError:', filterError);
    console.log('filterData:', filterData);
    
    // Check if data has actually changed to prevent infinite loops
    const filterDataChanged = JSON.stringify(prevFilterDataRef.current) !== JSON.stringify(filterData);
    const filterErrorChanged = prevFilterErrorRef.current !== filterError;
    
    if (!filterDataChanged && !filterErrorChanged) {
      console.log('No changes detected, skipping update');
      return;
    }
    
    console.log('useEffect triggered - filterData changed:', filterDataChanged, 'filterError changed:', filterErrorChanged);
    
    // Update refs
    prevFilterDataRef.current = filterData;
    prevFilterErrorRef.current = filterError;
    
    if (filterError) {
      console.log('Filter error occurred:', filterError);
      setEvents([]);
    } else if (filterData && Array.isArray(filterData) && filterData.length > 0) {
      console.log('Setting events from Redux filter data:', filterData);
      setEvents(filterData);
    } else {
      console.log('No Redux filter data available, setting empty array');
      setEvents([]);
    }
  }, [filterResponse, filterError]);

  const handleBookNow = (eventId?: string) => {
    console.log('Book Now clicked for event:', eventId);
    (navigation as any).navigate("ClubDetailScreen", { clubId: eventId });
  };

  const handleFavoritePress = async (eventId: string) => {
    console.log('Toggling favorite for event ID:', eventId);
    
    // Check if user has permission to like/favorite
    const hasPermission = await handleRestrictedAction('canLike', navigation, 'like this event');
    
    if (hasPermission) {
      dispatch(onTogglefavorite({ eventId }));
    } else {
      // Show custom alert for login required
      setAlertConfig({
        title: 'Login Required',
        message: 'Please sign in to like this event. You can explore the app without an account, but some features require login.',
        primaryButtonText: 'Sign In',
        secondaryButtonText: 'Continue Exploring',
        onPrimaryPress: () => {
          setShowCustomAlert(false);
          (navigation as any).navigate('SignInScreen');
        },
        onSecondaryPress: () => {
          setShowCustomAlert(false);
        },
      });
      setShowCustomAlert(true);
    }
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <NearbyEventCard
      event={item}
      //onPress={() => handleBookNow((item as any)._id || (item as any).id)}
      onPress={() => (navigation as any).navigate("ClubProfileScreen", {
        clubId:item._id,
      })}
      onFavoritePress={() => handleFavoritePress((item as any)._id || (item as any).id)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === 'android' && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: 'transparent',
        })}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton
          navigation={navigation}
          onBackPress={() => navigation?.goBack()}
        />
        <Text style={styles.headerTitle}>Filtered Events</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item, index) => (item as any)._id || (item as any).id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + verticalScale(20) }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {filterError ? '⚠️' : '🔍'}
            </Text>
            <Text style={styles.emptyTitle}>
              {filterError ? 'Filter Error' : 'No Events Found'}
            </Text>
            <Text style={styles.emptyMessage}>
              {filterError 
                ? 'There was an error loading filtered events. Please try again.' 
                : 'Try adjusting your filters to find more events'
              }
            </Text>
          </View>
        }
      />
      
      <CustomAlert
        visible={showCustomAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText={alertConfig.primaryButtonText}
        secondaryButtonText={alertConfig.secondaryButtonText}
        onPrimaryPress={alertConfig.onPrimaryPress}
        onSecondaryPress={alertConfig.onSecondaryPress}
        onClose={() => setShowCustomAlert(false)}
      />
    </View>
  );
};

export default FilterListScreen;
