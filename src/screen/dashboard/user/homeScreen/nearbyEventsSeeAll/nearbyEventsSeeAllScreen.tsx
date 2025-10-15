import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from '../../../../../utilis/appConstant';
import NearbyEventCard from '../card/nearbyEvent/nearbyEvent';
import { BackButton } from '../../../../../components/BackButton';
import { useDispatch } from 'react-redux';
import { onTogglefavorite } from '../../../../../redux/auth/actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handleRestrictedAction } from '../../../../../utilis/userPermissionUtils';
import CustomAlert from '../../../../../components/CustomAlert';

interface NearbyEventsSeeAllScreenProps {
  route: {
    params: {
      nearbyEvents: any[];
    };
  };
}

const NearbyEventsSeeAllScreen: React.FC<NearbyEventsSeeAllScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { nearbyEvents = [] } = (route.params as any) || {};
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
  
  const handleNearbyBookNow = (eventId?: string) => {
    // Navigate to ClubProfileScreen for profile details (Nearby events)
    (navigation as any).navigate("ClubProfileScreen", {
      clubId: eventId,
    });
  };

  const handleFavoritePress = async (eventId: string) => {

    // Check if user has permission to like/favorite
    const hasPermission = await handleRestrictedAction(
      "canLike",
      navigation,
      "like this event"
    );

    if (hasPermission) {
      dispatch(onTogglefavorite({ eventId }));
    } else {
      // Show custom alert for login required
      setAlertConfig({
        title: "Login Required",
        message:
          "Please sign in to like this event. You can explore the app without an account, but some features require login.",
        primaryButtonText: "Sign In",
        secondaryButtonText: "Continue Exploring",
        onPrimaryPress: () => {
          setShowCustomAlert(false);
          (navigation as any).navigate("SignInScreen");
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
    onPress={() =>
      handleNearbyBookNow((item as any)._id || (item as any).id)
    }
    onFavoritePress={() =>
      handleFavoritePress((item as any)._id || (item as any).id)
    }
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
        <Text style={styles.headerTitle}>Nearby Events</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Events List */}
      <FlatList
        data={nearbyEvents}
        renderItem={renderEventItem}
        keyExtractor={(item, index) => (item as any)._id || (item as any).id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + verticalScale(20) }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No nearby events found</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    // Remove default padding as we're handling it with useSafeAreaInsets
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20), // Reduced since we're adding paddingTop to container
    paddingBottom: verticalScale(20),
    backgroundColor: colors.backgroundColor,
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
  },
  placeholder: {
    width: horizontalScale(24), // Same width as back button for centering
  },
  listContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(100),
  },
  emptyText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: 'center',
  },
});

export default NearbyEventsSeeAllScreen;
