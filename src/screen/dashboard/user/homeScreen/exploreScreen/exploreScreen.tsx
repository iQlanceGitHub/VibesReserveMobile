import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import EventCard from '../../../../../screen/dashboard/user/homeScreen/card/featuredEvent/featuredEvent';
import BackIcon from '../../../../../assets/svg/backIcon';
import SearchIcon from '../../../../../assets/svg/searchIcon';
import { colors } from '../../../../../utilis/colors';
import Filtericon from '../../../../../assets/svg/filtericon';
import Blox from '../../../../../assets/svg/blox';
import { BackButton } from '../../../../../components/BackButton';

// Sample data for floating avatars (people/events)
const nearbyPeople = [
  {
    id: '1',
    name: 'DJ Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format',
    distance: '2.8 km',
    position: { latitude: 45.516, longitude: -73.556 },
    type: 'dj'
  },
  {
    id: '2',
    name: 'Mike Events',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    distance: '4.5 km',
    position: { latitude: 45.518, longitude: -73.558 },
    type: 'event'
  },
  {
    id: '3',
    name: 'Singer Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
    distance: '1.5 km',
    position: { latitude: 45.514, longitude: -73.560 },
    type: 'singer',
    isHighlighted: true
  },
  {
    id: '4',
    name: 'Club Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
    distance: '3.4 km',
    position: { latitude: 45.512, longitude: -73.562 },
    type: 'manager'
  },
  {
    id: '5',
    name: 'Party Host',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    distance: '1.1 km',
    position: { latitude: 45.520, longitude: -73.564 },
    type: 'host'
  }
];

// Sample featured events data
const featuredEvents = [
  {
    id: "1",
    name: "Friday Night Party",
    category: "DJ Nights",
    location: "Bartonfort, Canada",
    date: "Aug 29",
    time: "10:00 PM",
    price: "$120",
    image: {
      uri: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Echoe",
    category: "Live Music",
    location: "Montreal, QC",
    date: "Sept 2",
    time: "9:00 PM",
    price: "$99",
    image: {
      uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format",
    },
    isFavorite: false,
    rating: 4.5,
  }
];

// Custom dark purple map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#8d34ff" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#3d015d" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#b983ff" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2d014d" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#1a0037" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b983ff" }
    ]
  }
];

const ExploreScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [searchVal, setSearchVal] = useState('');
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 45.515,
    longitude: -73.558,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to location to show events on map',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleBookNow = () => {
    console.log('Book Now clicked');
  };

  const handleFavorite = (isFavorite: boolean) => {
    console.log('Favorite status:', isFavorite);
  };

  const onSearchClose = () => {
    setSearchVal('');
  };

  const renderAvatarMarker = (person: any) => (
    <Marker
      key={person.id}
      coordinate={person.position}
      onPress={() => console.log('Avatar pressed:', person.name)}
    >
      <View style={[
        styles.avatarMarker,
        person.isHighlighted && styles.highlightedAvatarMarker
      ]}>
        <Image source={{ uri: person.avatar }} style={styles.avatarImage} />
        <Text style={styles.distanceText}>{person.distance}</Text>
      </View>
    </Marker>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Full Screen Map */}
      {!mapReady && (
        <View style={styles.mapLoadingContainer}>
          <Text style={styles.mapLoadingText}>Loading Map...</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.fullScreenMap}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={currentLocation}
        customMapStyle={mapStyle}
        onMapReady={() => {
          console.log('Map is ready');
          setMapReady(true);
        }}
        onMapLoaded={() => {
          console.log('Map loaded');
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        loadingEnabled={true}
        loadingIndicatorColor={colors.violate}
        loadingBackgroundColor={colors.gradient_dark_purple}
      >
        {/* User Location Marker */}
        <Marker 
          coordinate={currentLocation} 
          title="Your Location"
          description="You are here"
        >
          <View style={styles.userLocationMarker}>
            <View style={styles.userLocationInner} />
          </View>
        </Marker>
        
        {/* Floating Avatar Markers */}
        {nearbyPeople.map(renderAvatarMarker)}
      </MapView>

      {/* Overlay Content */}
      <View style={styles.overlayContainer}>
        {/* Top Section - Search Bar */}
        <View style={styles.topSection}>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton}>
            <BackButton navigation={navigation} onBackPress={()=> navigation.goBack()} />
            </TouchableOpacity>
          
          </View>
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
            <TouchableOpacity style={styles.filterButton}>
              <Filtericon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
             <Blox />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Featured Events Carousel */}
      <View style={styles.featuredSection}>
        <Text style={styles.featuredTitle}>Featured</Text>
        <FlatList
          data={featuredEvents}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredEventsContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              title={item.name}
              location={item.location}
              date={`${item.date} - ${item.time}`}
              price={item.price}
              tag={item.category}
              image={item.image.uri}
              rating={item.rating}
              onBookNow={handleBookNow}
              onFavoritePress={handleFavorite}
            />
          )}
        />
      </View>
    </View>
  );
};

export default ExploreScreen;