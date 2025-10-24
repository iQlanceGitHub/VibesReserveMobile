import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Linking,
    Platform,
    Alert,
    Share,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './style';
import { colors } from '../../../../utilis/colors';
import { fonts } from '../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../utilis/appConstant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//API
import {
    onViewdetails,
    viewdetailsData,
    viewdetailsError,
    onGetDetailEvent,
    getDetailEventData,
    getDetailEventError,
    onTogglefavorite,
    togglefavoriteData,
    togglefavoriteError,
} from '../../../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleRestrictedAction } from '../../../../utilis/userPermissionUtils';
import CustomAlert from '../../../../components/CustomAlert';

// SVG Icons
import BackArrowIcon from '../../../../assets/svg/backIcon';
import ShareIcon from '../../../../assets/svg/shareIcon';
import BookmarkIcon from '../../../../assets/svg/bookmarkIcon';
import HeartIcon from '../../../../assets/svg/heartIcon';
import FavouriteIcon from '../../../../assets/svg/favouriteIcon';
import StarIcon from '../../../../assets/svg/starIcon';
import LocationFavourite from '../../../../assets/svg/locationFavourite';
import ClockIcon from '../../../../assets/svg/clockIcon';
import MessageIcon from '../../../../assets/svg/messageIcon';
import PhoneIcon from '../../../../assets/svg/phoneIcon';
import CocktailIcon from '../../../../assets/svg/cocktailIcon';
import MapView, { Marker } from 'react-native-maps';
import { useLocation, LocationProvider } from '../../../../contexts/LocationContext';
import ClubDetailScreen from '../../user/homeScreen/clubBooking/clubDetails/clubDetailScreen';

const DetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { locationData } = useLocation();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [selectedLounge, setSelectedLounge] = useState('');
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [viewedMap, setViewedMap] = useState(false);
    const [clubDetails, setClubDetails] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [msg, setMsg] = useState('');
    const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        primaryButtonText: '',
        secondaryButtonText: '',
        onPrimaryPress: () => { },
        onSecondaryPress: () => { },
    });

    // Get safe area insets for Android 15 compatibility
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch();
    const viewdetails = useSelector((state: any) => state.auth.viewdetails);
    const getDetailEvent = useSelector((state: any) => state.auth.getDetailEvent);

    // Debug: Log viewdetails to see if it's populated
    console.log("ClubDetailScreen viewdetails from Redux:", viewdetails);
    console.log("ClubDetailScreen getDetailEvent from Redux:", getDetailEvent);

    // Disable swipe-back gesture on iOS
    useFocusEffect(
        React.useCallback(() => {
            // Disable gesture when screen is focused
            navigation.setOptions({
                gestureEnabled: false,
            });

            // Re-enable gesture when screen is unfocused (optional)
            return () => {
                navigation.setOptions({
                    gestureEnabled: true,
                });
            };
        }, [navigation])
    );
    const viewdetailsErr = useSelector((state: any) => state.auth.viewdetailsErr);
    const getDetailEventErr = useSelector((state: any) => state.auth.getDetailEventErr);
    const togglefavorite = useSelector((state: any) => state.auth.togglefavorite);
    const togglefavoriteErr = useSelector((state: any) => state.auth.togglefavoriteErr);

    // Get club ID from route params
    const clubId = (route?.params as any)?.clubId; // fallback ID
    console.log('DetailScreen route params:', route?.params);
    console.log('DetailScreen clubId:', clubId);

    // Bookmark storage key
    const BOOKMARKS_STORAGE_KEY = 'user_bookmarks';

    // Load bookmarks from storage on component mount
    useEffect(() => {
        loadBookmarks();
    }, []);

    // Debug state changes
    useEffect(() => {
        console.log('State updated:', {
            clubId,
            isLiked,
            isBookmarked,
            allBookmarks: Array.from(bookmarks),
            isClubBookmarked: isClubBookmarked(clubId)
        });
    }, [isLiked, isBookmarked, bookmarks, clubId]);

    // Load bookmarks from AsyncStorage
    const loadBookmarks = async () => {
        try {
            const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
            if (storedBookmarks) {
                const bookmarkArray = JSON.parse(storedBookmarks);
                setBookmarks(new Set(bookmarkArray));
                console.log('Loaded bookmarks:', bookmarkArray);
            }
        } catch (error) {
            console.log('Error loading bookmarks:', error);
        }
    };

    // Save bookmarks to AsyncStorage
    const saveBookmarks = async (newBookmarks: Set<string>) => {
        try {
            const bookmarkArray = Array.from(newBookmarks);
            await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkArray));
            console.log('Saved bookmarks:', bookmarkArray);
        } catch (error) {
            console.log('Error saving bookmarks:', error);
        }
    };

    // Check if club is bookmarked
    const isClubBookmarked = (clubId: string) => {
        return bookmarks.has(clubId);
    };

    // Toggle bookmark for a club
    const toggleBookmark = async (clubId: string) => {
        const newBookmarks = new Set(bookmarks);
        if (newBookmarks.has(clubId)) {
            newBookmarks.delete(clubId);
            console.log('Removed bookmark for club:', clubId);
        } else {
            newBookmarks.add(clubId);
            console.log('Added bookmark for club:', clubId);
        }
        setBookmarks(newBookmarks);
        await saveBookmarks(newBookmarks);
        return newBookmarks.has(clubId);
    };

    // Get all bookmarked club IDs
    const getAllBookmarkedClubs = () => {
        return Array.from(bookmarks);
    };

    // Clear all bookmarks (useful for testing or user preference)
    const clearAllBookmarks = async () => {
        setBookmarks(new Set());
        await saveBookmarks(new Set());
        console.log('Cleared all bookmarks');
    };

    // Call onGetDetailEvent API when component mounts
    useEffect(() => {
        if (clubId) {
            console.log('Calling onGetDetailEvent with ID:', clubId);
            setIsDataLoading(true);
            setIsDataLoaded(false);

            // Call API with only the event ID
            dispatch(onGetDetailEvent({ id: clubId }));
        }
    }, [clubId, dispatch]);

    // Handle GetDetailEvent API response
    useEffect(() => {
        console.log("GetDetailEvent useEffect triggered with:", getDetailEvent);
        console.log("GetDetailEvent status:", getDetailEvent?.status);
        console.log("GetDetailEvent data:", getDetailEvent?.data);

        if (
            getDetailEvent?.status === true ||
            getDetailEvent?.status === 'true' ||
            getDetailEvent?.status === 1 ||
            getDetailEvent?.status === "1"
        ) {
            console.log("getDetailEvent response:+>", getDetailEvent);
            setClubDetails(getDetailEvent?.data);
            setIsDataLoading(false);
            setIsDataLoaded(true);

            // Set like state from server response using isFavorite field
            const serverLike = getDetailEvent?.data?.isFavorite || false;
            setIsLiked(serverLike);

            // Check local bookmarks
            const localBookmark = isClubBookmarked(clubId);
            setIsBookmarked(localBookmark);

            dispatch(getDetailEventData(''));
        }

        if (getDetailEventErr) {
            console.log("getDetailEventErr:+>", getDetailEventErr);
            setMsg(getDetailEventErr?.message?.toString());
            setIsDataLoading(false);
            setIsDataLoaded(false);
            dispatch(getDetailEventError(''));
        } else {
            console.log("No getDetailEvent error, but status not recognized:", getDetailEvent?.status);
        }
    }, [getDetailEvent, getDetailEventErr, dispatch, clubId, bookmarks]);

    // Handle Toggle Favorite API response (if using server sync)
    useEffect(() => {
        if (
            togglefavorite?.status === true ||
            togglefavorite?.status === 'true' ||
            togglefavorite?.status === 1 ||
            togglefavorite?.status === "1"
        ) {
            console.log("togglefavorite response:+>", togglefavorite);

            // Update like state based on server response
            if (togglefavorite?.data?.isFavorite !== undefined) {
                const newLikeState = togglefavorite.data.isFavorite;
                setIsLiked(newLikeState);
                console.log('Like state updated from server:', newLikeState);
            }

            dispatch(togglefavoriteData(''));
        }

        if (togglefavoriteErr) {
            console.log("togglefavoriteErr:+>", togglefavoriteErr);
            setMsg(togglefavoriteErr?.message?.toString());
            dispatch(togglefavoriteError(''));
        }
    }, [togglefavorite, togglefavoriteErr, dispatch, clubId, bookmarks]);

    // Get facilities from API data or use default facilities
    const facilities = (clubDetails as any)?.facilities?.map((facility: any, index: number) => ({
        id: facility._id || `facility_${index}`,
        title: facility.name || 'Facility',
        icon: <CocktailIcon size={16} color={colors.white} />
    })) || [

        ];

    // Get coordinates from API data or use user's current location
    const location = {
        latitude: (clubDetails as any)?.coordinates?.coordinates?.[1] || locationData?.latitude || 23.012649201096547,
        longitude: (clubDetails as any)?.coordinates?.coordinates?.[0] || locationData?.longitude || 72.51123340677258,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    // Get lounges from API data or use empty array
    const lounges = (clubDetails as any)?.booths?.map((booth: any, index: number) => ({
        id: booth._id || `booth_${index}`,
        name: booth.boothName || 'Booth',
        title: booth.boothName || 'Booth', // Add title for consistency
        type: booth.boothType?.name || 'VIP Booth',
        capacity: booth.capacity || 6, // Remove "People" suffix for consistency
        originalPrice: booth.boothPrice || 1000,
        discountedPrice: booth.discountedPrice || 800,
        price: booth.discountedPrice || booth.boothPrice || 800, // Use discounted price as main price
        image: booth.boothImage?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        boothType: booth.boothType, // Keep original booth type data
    })) || [];

    const transformedTickets = (clubDetails as any)?.tickets?.map((ticket: any, index: number) => ({
        id: ticket._id || `ticket_${index}`,
        name: ticket.ticketType?.name || 'General Admission',
        title: ticket.ticketType?.name || 'General Admission', // Add title for consistency
        type: ticket.ticketType?.name || 'General',
        capacity: ticket.capacity || 0, // Remove "People" suffix for consistency
        price: ticket.ticketPrice || 45,
        originalPrice: ticket.ticketPrice || 45,
        discountedPrice: ticket.ticketPrice || 45,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        ticketType: ticket.ticketType, // Keep original ticket type data
    })) || [];


    const mapStyle = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#1a1a2e"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1a1a2e"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0e1621"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#1a1a2e"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2a2a2a"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        }
    ];

    const handleLoungeSelect = (loungeId: string) => {
        // Toggle selection: if already selected, unselect; otherwise select
        setSelectedLounge(prevSelected =>
            prevSelected === loungeId ? '' : loungeId
        );
    };

    const handleFacilityToggle = (facilityId: string) => {
        setSelectedFacilities(prev =>
            prev.includes(facilityId)
                ? prev.filter(id => id !== facilityId)
                : [...prev, facilityId]
        );
    };

    const handleMapView = () => {
        setViewedMap(true);
        console.log('Map viewed by user');
    };

    const openInMapApp = () => {
        if (!clubDetails) {
            Alert.alert('Error', 'Location data not available');
            return;
        }

        const latitude = (clubDetails as any)?.coordinates?.coordinates?.[0];
        const longitude = (clubDetails as any)?.coordinates?.coordinates?.[1];
        const address = (clubDetails as any)?.address;

        if (!latitude || !longitude) {
            Alert.alert('Error', 'Coordinates not available');
            return;
        }

        const mapUrl = Platform.select({
            ios: `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`,
            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(address || 'Club Location')})`,
        });

        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        if (mapUrl) {
            Linking.canOpenURL(mapUrl).then((supported) => {
                if (supported) {
                    Linking.openURL(mapUrl);
                } else {
                    // Fallback to web version
                    Linking.openURL(webUrl);
                }
            }).catch((err) => {
                console.error('Error opening map:', err);
                // Fallback to web version
                Linking.openURL(webUrl);
            });
        } else {
            // Fallback to web version
            Linking.openURL(webUrl);
        }
    };

    const handleShare = async () => {
        if (!clubDetails) {
            Alert.alert('Error', 'Club details not available');
            return;
        }

        const clubName = (clubDetails as any)?.name || 'Amazing Club';
        const clubAddress = (clubDetails as any)?.address || 'Great Location';
        const clubDetails_text = (clubDetails as any)?.details || 'Experience the best nightlife';
        const clubType = (clubDetails as any)?.type || 'Club';
        const entryFee = (clubDetails as any)?.entryFee || 'Free';

        // Create trendy share content
        const shareMessage = `🎉 Check out ${clubName}! 🎉

📍 ${clubAddress}

${clubDetails_text}

🏷️ Type: ${clubType}
💰 Entry: ₹${entryFee}

#Nightlife #Party #${clubType} #VibesReserve #Fun #Entertainment

Download VibesReserve app to discover more amazing venues! 🚀`;

        try {
            const result = await Share.share({
                message: shareMessage,
                title: `Discover ${clubName} on VibesReserve`,
            });

            if (result.action === Share.sharedAction) {
                console.log('Content shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'Failed to share content');
        }
    };

    // Handle Like/Favorite toggle (server-based)


    // Handle Bookmark toggle (local storage-based)
    const handleToggleBookmark = async () => {
        if (!clubDetails) {
            Alert.alert('Error', 'Club details not available');
            return;
        }

        const eventId = (clubDetails as any)?._id;
        if (!eventId) {
            Alert.alert('Error', 'Event ID not available');
            return;
        }

        // Check if user has permission to bookmark
        const hasPermission = await handleRestrictedAction('canBookmark', navigation, 'bookmark this club');

        if (!hasPermission) {
            // Show custom alert for login required
            setAlertConfig({
                title: 'Login Required',
                message: 'Please sign in to bookmark this club. You can explore the app without an account, but some features require login.',
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
            return;
        }

        try {
            // Toggle local bookmark state immediately for better UX
            const newBookmarkState = await toggleBookmark(eventId);
            setIsBookmarked(newBookmarkState);

            console.log('Bookmark toggled locally. New state:', newBookmarkState);

        } catch (error) {
            console.log('Error toggling bookmark:', error);
            Alert.alert('Error', 'Failed to update bookmark');
        }
    };

    const getTotalPrice = () => {
        // If no lounge is selected, return entryFee
        if (!selectedLounge) {
            return (clubDetails as any)?.entryFee || 0;
        }

        // Check both tickets and booths for the selected item
        let selectedData = null;

        // First check tickets
        if (transformedTickets && transformedTickets.length > 0) {
            selectedData = transformedTickets.find((ticket: any) => ticket.id === selectedLounge);
        }

        // If not found in tickets, check booths
        if (!selectedData && lounges && lounges.length > 0) {
            selectedData = lounges.find((lounge: any) => lounge.id === selectedLounge);
        }

        return selectedData ? selectedData.price : ((clubDetails as any)?.entryFee || 0);
    };





    const handleBookNow = () => {
        // Collect all selected values (allow entryFee-only bookings)
        const selectedLoungeData = selectedLounge ? lounges.find((lounge: any) => lounge.id === selectedLounge) : null;
        const selectedTicketData = selectedLounge ? transformedTickets.find((ticket: any) => ticket.id === selectedLounge) : null;
        const selectedFacilitiesData = facilities.filter((facility: any) => selectedFacilities.includes(facility.id));

        // Handle booking logic here
        console.log("ClubDetailScreen viewdetails (booking):", viewdetails);
        console.log("ClubDetailScreen viewdetails type:", typeof viewdetails);
        console.log("ClubDetailScreen viewdetails keys:", viewdetails ? Object.keys(viewdetails) : 'viewdetails is null/undefined');

        // Pass the actual event data (either from viewdetails.data or viewdetails itself)
        const baseEventData = viewdetails?.data || viewdetails || clubDetails;

        // Combine event data with selected ticket information
        const combinedEventData = {
            ...(baseEventData || {}),
            selectedTicket: selectedTicketData,
            // If no ticket selected, use entryFee and don't include ticket-specific fields
            ...(selectedTicketData ? {
                // Override capacity and pricing with selected ticket data
                tickets: [{
                    ticketType: {
                        _id: selectedTicketData.id || '',
                        name: selectedTicketData.title || selectedTicketData.name || 'Selected Ticket'
                    },
                    ticketPrice: selectedTicketData.price || 0,
                    capacity: selectedTicketData.capacity || 1,
                    _id: selectedTicketData.id || ''
                }]
            } : {
                // When no ticket selected, use entryFee and don't include ticket-specific fields
                entryFee: (baseEventData as any)?.entryFee || 0,
                // Don't include ticketCost, ticketType, ticketid
            })
        };

        console.log("ClubDetailScreen combinedEventData:", combinedEventData);
        console.log("ClubDetailScreen navigating to ClubBookingScreen with (booking):", { eventData: combinedEventData });
        (navigation as any).navigate("ClubBookingScreen", { eventData: combinedEventData });
    };

    const handleEditEvent = () => {
        (navigation as any).navigate("EditDetailScreen", { clubId: clubId });
    };

    const handleFavorite = (isFavorite: boolean) => {
        console.log('Favorite status:', isFavorite);
        // Handle favorite logic here
    };

    const handleNextPress = () => {
        // Check if data is still loading
        if (isDataLoading) {
            Alert.alert(
                'Please Wait',
                'Club details are still loading. Please wait a moment and try again.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Check if data failed to load
        if (!isDataLoaded || !clubDetails) {
            Alert.alert(
                'Data Not Available',
                'Unable to load club details. Please try again or go back and select a different club.',
                [
                    {
                        text: 'Try Again', onPress: () => {
                            // Retry loading data
                            setIsDataLoading(true);
                            setIsDataLoaded(false);
                            dispatch(onGetDetailEvent({ id: clubId }));
                        }
                    },
                    { text: 'Go Back', onPress: () => navigation.goBack() }
                ]
            );
            return;
        }

        let selectedData: any = null;
        let isBooth = false;

        // Check if a booth or ticket is selected
        if (selectedLounge) {
            // Check both tickets and booths for the selected item
            if (transformedTickets && transformedTickets.length > 0) {
                selectedData = transformedTickets.find((ticket: any) => ticket.id === selectedLounge);
            }

            if (!selectedData && lounges && lounges.length > 0) {
                selectedData = lounges.find((lounge: any) => lounge.id === selectedLounge);
            }

            // Determine if this is a booth or ticket based on the data structure
            isBooth = selectedData?.boothType !== undefined;
        }

        console.log("selectedData:=>", selectedData);
        console.log("clubDetails:=>", clubDetails);

        // If no booth/ticket selected, use entryFee as the price
        const entryFee = (clubDetails as any)?.entryFee || 0;

        // Combine event data with selected information
        const baseEventData = clubDetails as any || {};
        const combinedEventData = {
            ...baseEventData,
            selectedTicket: selectedData, // Keep the same name for consistency
            // If no selection, don't include booth/ticket specific fields
            ...(selectedData ? {
                [isBooth ? 'booths' : 'tickets']: [{
                    [isBooth ? 'boothType' : 'ticketType']: {
                        _id: selectedData.id || '',
                        name: selectedData.title || selectedData.name || (isBooth ? 'Selected Booth' : 'Selected Ticket')
                    },
                    [isBooth ? 'boothPrice' : 'ticketPrice']: selectedData.price || 0,
                    capacity: selectedData.capacity || 1,
                    _id: selectedData.id || '',
                    // Add booth-specific fields if it's a booth
                    ...(isBooth ? {
                        boothName: selectedData.name || selectedData.title,
                        discountedPrice: selectedData.discountedPrice || selectedData.price,
                        boothImage: selectedData.image ? [selectedData.image] : []
                    } : {})
                }]
            } : {
                // When no booth/ticket selected, use entryFee and don't include booth/ticket specific fields
                entryFee: entryFee,
                // Don't include boothCost, boothType, boothId, ticketCost, ticketType, ticketid
            })
        };

        console.log("Combined event data for booking:", combinedEventData);
        (navigation as any).navigate('ClubBookingScreen', { eventData: combinedEventData });
    };

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

            {/* Header with Club Image */}
            <View style={styles.headerContainer}>
                <Image
                    source={{
                        uri: (clubDetails as any)?.photos[0]
                    }}
                    style={styles.headerImage}
                    resizeMode="cover"
                />

                {/* Overlay Gradient */}
                <View style={styles.imageOverlay} />

                {/* Top Navigation */}
                <View style={styles.topNavigation}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrowIcon size={24} color={colors.white} />
                    </TouchableOpacity>


                </View>


            </View>

            <View style={styles.eventCardNew}>
                {/* Loading Overlay */}
                {/* {isDataLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.violate} />
            <Text style={styles.loadingText}>Loading club details...</Text>
          </View>
        )} */}

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Event Details Card */}
                    <View style={styles.eventCard}>
                        <View style={styles.eventHeader}>
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>{(clubDetails as any)?.type || 'Club'}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <StarIcon size={16} color={colors.yellow} />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                        </View>

                        <Text style={styles.eventTitle}>{(clubDetails as any)?.name || 'Loading...'}</Text>

                        <View style={styles.eventDetails}>
                            <View style={styles.detailRow}>
                                <LocationFavourite size={16} color={colors.violate} />
                                <Text style={styles.detailText}>{(clubDetails as any)?.address || 'Loading...'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <ClockIcon size={16} color={colors.violate} />
                                <Text style={styles.detailText}>
                                    {clubDetails ?
                                        `${new Date((clubDetails as any).startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${(clubDetails as any).openingTime}` :
                                        'Loading...'
                                    }
                                </Text>
                            </View>
                        </View>

                        {(clubDetails as any)?.type !== 'VIP Entry' && (clubDetails as any)?.type !== 'Booth' && (
                            <View style={styles.aboutSection}>
                                <Text style={styles.aboutTitle}>About</Text>
                                <Text style={styles.aboutText}>
                                    {(clubDetails as any)?.details}
                                </Text>
                            </View>
                        )}

                        {/* Booking Options */}
                        <View style={styles.section}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.loungesContainer}
                            >
                                {lounges.map((lounge: any) => (
                                    <TouchableOpacity
                                        key={lounge.id}
                                        style={[
                                            styles.loungeCard,
                                            selectedLounge === lounge.id && styles.loungeCardSelected
                                        ]}
                                        onPress={() => console.log("lounge:=>", lounge)}
                                    >
                                        <Image source={{ uri: lounge.image }} style={styles.loungeImage} />
                                        <View style={styles.loungeContent}>
                                            <Text style={styles.loungeName}>{lounge.name}</Text>
                                            <Text style={styles.loungeDetails}>
                                                <Text style={styles.loungeTitle}>Booth Type: </Text>
                                                <Text style={styles.loungeDetails}>{lounge.type}</Text>
                                                {'\n'}
                                                <Text style={styles.loungeTitle}>Capacity: </Text>
                                                <Text style={styles.loungeDetails}>{lounge.capacity}</Text>
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                               
                                                <View style={styles.priceContainer}>
                                                    <Text style={styles.originalPrice}>${lounge.originalPrice}</Text>
                                                    <Text style={styles.discountedPrice}>${lounge.discountedPrice}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {transformedTickets.map((ticket: any) => (
                                    <TouchableOpacity
                                        key={ticket.id}
                                        style={[
                                            styles.ticketCard,
                                            selectedLounge === ticket.id && styles.loungeCardSelected
                                        ]}
                                        onPress={() => console.log("ticket:=>", ticket)}
                                    >

                                        <View style={styles.loungeContent}>

                                            <Text style={styles.loungeDetails}>
                                                <Text style={styles.loungeTitle}>Ticket Type: </Text>
                                                <Text style={styles.loungeDetails}>{ticket.type}</Text>
                                                {'\n'}
                                                <Text style={styles.loungeTitle}>Capacity: </Text>
                                                <Text style={styles.loungeDetails}>{ticket.capacity}</Text>
                                            </Text>
                                            <View style={styles.priceContainer}>
                                                <Text style={styles.discountedPrice}>${ticket.price}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {/* <TouchableOpacity
                        style={[
                          styles.selectButton,
                          selectedLounge === ticket.id && styles.selectButtonSelected
                        ]}
                        onPress={() => handleLoungeSelect(ticket.id)}
                      >
                        <Text style={[
                          styles.selectButtonText,
                          selectedLounge === ticket.id && styles.selectButtonTextSelected
                        ]}>
                          {selectedLounge === ticket.id ? 'Selected' : 'Select'}
                        </Text>
                      </TouchableOpacity> */}

                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                ))}

                            </ScrollView>
                        </View>

                      
                        {/* Organizations */}
                        {/* <View style={[styles.section, { marginTop: (clubDetails as any)?.type === 'VIP Entry' || (clubDetails as any)?.type === 'Booth' ? verticalScale(-24) : verticalScale(20) }]}>
                            <Text style={styles.sectionTitle}>Organizations</Text>
                            <View style={styles.organizationCard}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                                    style={styles.organizerAvatar}
                                />
                                <View style={styles.organizerInfo}>
                                    <Text style={styles.organizerName}>{(clubDetails as any)?.userId?.fullName}</Text>
                                    <Text style={styles.organizerRole}>Organize Team</Text>
                                </View>
                                <View style={styles.contactIcons}>
                                    <TouchableOpacity style={styles.contactButton} onPress={() => (navigation as any).navigate("ChatScreen", {
                                        otherUserId: (clubDetails as any)?.userId?._id,
                                        otherUserName: (clubDetails as any)?.userId?.fullName,
                                        otherUserProfilePicture: (clubDetails as any)?.userId?.profilePicture,
                                        conversationId: (clubDetails as any)?.userId?.conversationId,
                                    })}>
                                        <MessageIcon width={20} height={20} color={colors.violate} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.contactButton}>
                                        <PhoneIcon width={20} height={20} color={colors.violate} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> */}

                        {/* Address */}
                        <View style={[styles.section, { marginTop: (clubDetails as any)?.type === 'VIP Entry' || (clubDetails as any)?.type === 'Booth' ? verticalScale(-24) : verticalScale(20) }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(16) }}>
                                <Text style={styles.sectionTitle}>Address</Text>
                                <TouchableOpacity style={styles.mapButton} onPress={openInMapApp}>
                                    <Text style={styles.mapButtonText}>View on Map</Text>
                                </TouchableOpacity></View>

                            <View style={styles.addressRow}>
                                <LocationFavourite size={16} color={colors.violate} />
                                <Text style={styles.addressText}>{(clubDetails as any)?.address || 'Loading address...'}</Text>
                            </View>


                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={location}
                                    customMapStyle={mapStyle} // Apply custom styling
                                    scrollEnabled={false} // Disable scrolling if you want it to be static
                                    zoomEnabled={false} // Disable zoom if you want it to be static
                                    userInterfaceStyle="dark"
                                    tintColor={colors.violate}
                                    mapType="standard"
                                    showsUserLocation={false}
                                    showsMyLocationButton={false}
                                    showsCompass={false}
                                    showsScale={false}
                                    showsBuildings={true}
                                    showsTraffic={false}
                                    showsIndoors={false}
                                >
                                    <Marker
                                        coordinate={location}
                                        pinColor={colors.violate}
                                    >
                                        <View style={styles.mapPin}>
                                            <LocationFavourite size={24} color={colors.white} />
                                        </View>
                                    </Marker>
                                </MapView>
                            </View>
                        </View>
                        {/* Facilities */}
                        {(clubDetails as any)?.type !== 'VIP Entry' && (clubDetails as any)?.type !== 'Booth' ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Facilities</Text>
                            <View style={styles.facilitiesContainer}>
                                {facilities.map((facility: any) => (
                                    <TouchableOpacity
                                        key={facility.id}
                                        style={[
                                            styles.facilityButton,
                                            selectedFacilities.includes(facility.id) && styles.facilityButtonSelected
                                        ]}
                                        onPress={() => handleFacilityToggle(facility.id)}
                                    >
                                        {/* {facility.icon} */}
                                        <Text style={[
                                            styles.facilityText,
                                            selectedFacilities.includes(facility.id) && styles.facilityTextSelected
                                        ]}>
                                            {facility.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        ) : null}
                    </View>
                    <View style={{ marginTop: verticalScale(100) }}></View>
                </ScrollView>
            </View>

            {/* Edit Button */}
            <View style={styles.editButtonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditEvent}
                >
                    <Text style={styles.editButtonText}>Edit Event</Text>
                </TouchableOpacity>
            </View>

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

export default DetailScreen;
