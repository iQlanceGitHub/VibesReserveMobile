import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './style';
import { colors } from '../../../../utilis/colors';
import { fonts } from '../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../utilis/appConstant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom Components
import { CustomeTextInput, DatePickerInput } from '../../../../components/textinput';
import DetailsInput from '../../../../components/DetailsInput';
import CustomDropdown from '../../../../components/CustomDropdown';
import { Buttons } from '../../../../components/buttons';
import CustomTimePicker from '../../../../components/CustomTimePicker';
import GoogleAddressAutocomplete from '../../../../components/GoogleAddressAutocomplete';
import ImageSelectionBottomSheet from '../../../../components/ImageSelectionBottomSheet';
import BoothForm from '../../../../screen/dashboard/host/homeScreen/components/BoothForm';
// import EventForm from '../../../homeScreen/components/EventForm';

// Hooks
import { useCategory } from '../../../../hooks/useCategory';
import { useFacility } from '../../../../hooks/useFacility';


// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  onGetDetailEvent,
  getDetailEventData,
  getDetailEventError,
  onUpdateEvent,
  updateEventData,
  updateEventError,
  onDeleteEventPart,
  deleteEventPartData,
  deleteEventPartError,
} from '../../../../redux/auth/actions';

// Utils
import { showToast } from '../../../../utilis/toastUtils';
import { uploadFileToS3 } from '../../../../utilis/s3Upload';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from "react-native-image-picker";
import PermissionManager from '../../../../utilis/permissionUtils';

// SVG Icons
import BackIcon from '../../../../assets/svg/backIcon';
import TimeIcon from '../../../../assets/svg/timeIcon';
import CalendarIcon from '../../../../assets/svg/calendarIcon';
import LocationIcon from '../../../../assets/svg/locationIcon';
import PlusIcon from '../../../../assets/svg/plusIcon';
import GalleryIcon from '../../../../assets/svg/galleryIcon';
import DeleteIconNew from '../../../../assets/svg/deleteIconNew';

// Interfaces
interface BoothType {
  id: string;
  name: string;
}

interface Facility {
  _id: string;
  name: string;
  selected: boolean;
}

interface BoothData {
  id: string;
  boothName: string;
  boothType: string;
  boothPrice: string;
  capacity: string;
  discountedPrice: string;
  boothImages: string[];
}

interface EventData {
  id: string;
  ticketType: string;
  ticketPrice: string;
  capacity: string;
  _id?: string; // API response includes _id
}

const EditDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Hooks for dynamic data
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
  } = useCategory();

  const {
    facilities,
    isLoading: facilitiesLoading,
    error: facilitiesError,
    fetchFacilities,
  } = useFacility();

  // Redux selectors
  const getDetailEvent = useSelector((state: any) => state.auth.getDetailEvent);
  const getDetailEventErr = useSelector((state: any) => state.auth.getDetailEventErr);
  const updateEvent = useSelector((state: any) => state.auth.updateEvent);
  const updateEventErr = useSelector((state: any) => state.auth.updateEventErr);
  const deleteEventPart = useSelector((state: any) => state.auth.deleteEventPart);
  const deleteEventPartErr = useSelector((state: any) => state.auth.deleteEventPartErr);
  const loader = useSelector((state: any) => state.auth.loader);

  // Get club ID from route params
  const clubId = (route?.params as any)?.clubId || '68e66ac81c196abe967b7657';

  // Form state - matching Add Event structure
  const [type, setType] = useState("Event");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [floorLayout, setFloorLayout] = useState(""); // Store image URL for floor layout
  const [coordinates, setCoordinates] = useState({
    type: "Point",
    coordinates: [0, 0],
  });

  // Dynamic form data
  const [booths, setBooths] = useState<BoothData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [deletingTicketIndex, setDeletingTicketIndex] = useState<number | null>(null);

  // UI state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"start" | "end">("start");
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">("start");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<"main" | "booth" | "event" | "floorLayout">("main");
  const [currentBoothIndex, setCurrentBoothIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Optional sections state
  const [enableBooths, setEnableBooths] = useState(false);
  const [enableTickets, setEnableTickets] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: false,
    details: false,
    entryFee: false,
    discountPrice: false,
    eventCapacity: false,
    address: false,
    startDate: false,
    endDate: false,
    floorLayout: false,
  });

  // Types for dropdown
  const types = [
    { id: "1", name: "Club" },
    { id: "2", name: "Booth" },
    { id: "3", name: "Event" },
    { id: "4", name: "VIP Entry" },
    { id: "5", name: "Table" },
  ];

  // Convert categories to booth types format
  const boothTypes: BoothType[] = categories.map((category: any) => ({
    id: category._id,
    name: category.name,
  }));

  // Convert categories to event types format
  const eventTypes = categories.map((category: any) => ({
    _id: category._id,
    name: category.name,
  }));

  // Facilities list with selection state
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);

  // Disable swipe-back gesture on iOS
  useFocusEffect(
    React.useCallback(() => {
      // Keep gestures disabled
      navigation.setOptions({
        gestureEnabled: false,
      });
    }, [navigation])
  );

  // Helper functions
  const formatTimeString = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date to DD/MM/YYYY format (matching add screen)
  const formatDateString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert DD/MM/YYYY format to YYYY-MM-DD for API (matching add screen)
  const convertDateToAPIFormat = (dateString: string): string => {
    if (!dateString) return "";
    try {
      // Handle DD/MM/YYYY format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      }
      // Handle YYYY-MM-DD format (already correct)
      if (dateString.includes("-") && dateString.length === 10) {
        return dateString;
      }
      // Try parsing as date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.error("Error converting date:", error);
      return "";
    }
  };

  // Validate dates - matching add screen logic
  const validateDates = (startDateStr: string, endDateStr: string): boolean => {
    if (!startDateStr || !endDateStr) return true; // Allow empty dates initially

    try {
      // Parse dates from DD/MM/YYYY format
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };

      const startDate = parseDate(startDateStr);
      const endDate = parseDate(endDateStr);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      // Check if end date is same or after start date
      return endDate >= startDate;
    } catch (error) {
      console.log("Error validating dates:", error);
      return false;
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };


  // Event handlers
  const addNewEvent = () => {
    const newEvent: EventData = {
      id: Date.now().toString(),
      ticketType: '',
      ticketPrice: '',
      capacity: '',
    };
    setEvents([...events, newEvent]);
  };

  const updateEventDataLocal = (index: number, updatedEvent: EventData) => {
    const updatedEvents = [...events];
    updatedEvents[index] = updatedEvent;
    setEvents(updatedEvents);
  };

  const removeEvent = (index: number) => {
    const eventToRemove = events[index];
    
    // If the event has no _id (new ticket), delete immediately without confirmation
    if (!eventToRemove._id) {
      console.log('Deleting new ticket from UI only:', eventToRemove.ticketType);
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
      return;
    }
    
    // If the event has an _id (saved ticket), show confirmation and call API
    Alert.alert(
      'Delete Ticket',
      `Are you sure you want to delete "${eventToRemove.ticketType}" ticket?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting saved ticket from API:', eventToRemove._id);
            setDeletingTicketIndex(index); // Store the index for later removal
            dispatch(onDeleteEventPart({
              id: clubId,
              partType: 'ticket',
              partId: eventToRemove._id
            }));
            // Don't remove from UI here - wait for successful API response
          },
        },
      ]
    );
  };

  // Booth handlers
  const addNewBooth = () => {
    const newBooth: BoothData = {
      id: Date.now().toString(),
      boothName: '',
      boothType: '',
      boothPrice: '',
      capacity: '',
      discountedPrice: '',
      boothImages: []
    };
    setBooths([...booths, newBooth]);
  };

  const updateBooth = (id: string, field: keyof BoothData, value: string | string[]) => {
    setBooths(booths.map(booth =>
      booth.id === id ? { ...booth, [field]: value } : booth
    ));
  };

  const removeBooth = (id: string) => {
    setBooths(booths.filter(booth => booth.id !== id));
  };

  // Facility handlers
  const toggleFacility = (facilityId: string) => {
    setFacilitiesList(prevFacilities =>
      prevFacilities.map(facility =>
        facility._id === facilityId
          ? { ...facility, selected: !facility.selected }
          : facility
      )
    );
  };

  // Image handlers
  const handlePhotoUpload = (index: number) => {
    setCurrentImageIndex(index);
    setCurrentImageType("main");
    setShowImagePicker(true);
  };


  const handleImageSelected = (imageUri: string) => {
    if (currentImageType === "main") {
      const updatedPhotos = [...uploadPhotos];
      updatedPhotos[currentImageIndex] = imageUri;
      setUploadPhotos(updatedPhotos);
    } else if (currentImageType === "booth") {
      const updatedBooths = [...booths];
      if (!updatedBooths[currentBoothIndex].boothImages) {
        updatedBooths[currentBoothIndex].boothImages = [];
      }
      updatedBooths[currentBoothIndex].boothImages.push(imageUri);
      setBooths(updatedBooths);
    }
    setShowImagePicker(false);
  };

  // Image picker with permissions
  const handleImagePicker = async (type: 'camera' | 'gallery', imageType: "main" | "booth" | "event" | "floorLayout", boothIndex: number, eventIndex: number) => {
    setCurrentImageType(imageType);
    if (imageType === "booth") {
      setCurrentBoothIndex(boothIndex);
    } else if (imageType === "event") {
      setCurrentEventIndex(eventIndex);
    }

    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.7 as any,
      maxWidth: 800,
      maxHeight: 800,
    };

    const callback = async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        console.log("Image picker cancelled or error:", response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          try {
            setLoading(true);
            
            // Upload to S3
            const fileName = `${imageType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
            const uploadedUrl = await uploadFileToS3(
              imageUri,
              fileName,
              "image/jpeg"
            );

            // Update the appropriate state
            if (imageType === "main") {
              const newPhotos = [...uploadPhotos];
              if (currentImageIndex < newPhotos.length) {
                newPhotos[currentImageIndex] = uploadedUrl;
              } else {
                newPhotos.push(uploadedUrl);
              }
              setUploadPhotos(newPhotos);
            } else if (imageType === "floorLayout") {
              setFloorLayout(uploadedUrl);
              if (errors.floorLayout) {
                setErrors((prev) => ({ ...prev, floorLayout: false }));
              }
            } else if (imageType === "booth") {
              console.log('Updating booth image:', {
                currentBoothIndex,
                boothsLength: booths.length,
                boothExists: booths[currentBoothIndex] ? true : false
              });
              
              if (currentBoothIndex >= 0 && currentBoothIndex < booths.length) {
                const updatedBooths = [...booths];
                if (!updatedBooths[currentBoothIndex].boothImages) {
                  updatedBooths[currentBoothIndex].boothImages = [];
                }
                updatedBooths[currentBoothIndex].boothImages.push(uploadedUrl);
                setBooths(updatedBooths);
                console.log('Booth image added successfully');
              } else {
                console.error('Invalid booth index:', currentBoothIndex);
                showToast("error", "Invalid booth index");
              }
            }

            showToast("success", "Image uploaded successfully");
          } catch (error) {
            console.log("Image upload error:", error);
            showToast("error", "Failed to upload image");
          } finally {
            setLoading(false);
          }
        }
      }
    };

    if (type === "camera") {
      PermissionManager.requestPermissionWithFlow(
        "camera",
        () => {
          launchCamera(options, callback);
        },
        (error) => {
          console.log("Camera permission error:", error);
          showToast("error", "Camera permission denied");
        }
      );
    } else {
      PermissionManager.requestPermissionWithFlow(
        "storage",
        () => {
          launchImageLibrary(options, callback);
        },
        (error) => {
          console.log("Storage permission error:", error);
          showToast("error", "Storage permission denied");
        }
      );
    }
  };

  const handleDeleteImage = (boothIndex: number, imageIndex: number) => {
    const updatedBooths = [...booths];
    updatedBooths[boothIndex].boothImages = updatedBooths[boothIndex].boothImages.filter((_, i) => i !== imageIndex);
    setBooths(updatedBooths);
  };

  const handleDeleteMainImage = (index: number) => {
    const updatedPhotos = uploadPhotos.filter((_, i) => i !== index);
    setUploadPhotos(updatedPhotos);
  };

  // Load categories and facilities on mount
  useEffect(() => {
    fetchCategories();
    fetchFacilities();
  }, [fetchCategories, fetchFacilities]);

  // Clear details error when type changes to Booth or VIP Entry
  useEffect(() => {
    if (type === "Booth" || type === "VIP Entry") {
      setErrors((prev) => ({ ...prev, details: false }));
    }
  }, [type]);

  // Initialize facilities list when facilities are loaded
  useEffect(() => {
    if (facilities && facilities.length > 0) {
      const initialFacilities = facilities.map((facility: any) => ({
        _id: facility._id,
        name: facility.name,
        selected: false, // Will be updated from event data
      }));
      setFacilitiesList(initialFacilities);
    }
  }, [facilities]);

  // Handle facilities selection when both facilities and event data are available
  useEffect(() => {
    if (getDetailEvent?.data?.facilities && facilitiesList.length > 0) {
      const eventFacilities = getDetailEvent.data.facilities;
      console.log('Setting facilities selection:', eventFacilities);
      setFacilitiesList(prevFacilities => 
        prevFacilities.map(facility => ({
          ...facility,
          selected: eventFacilities.some((selectedFacility: any) => 
            selectedFacility._id === facility._id || 
            selectedFacility === facility._id ||
            selectedFacility.name === facility.name
          )
        }))
      );
    }
  }, [getDetailEvent?.data?.facilities, facilitiesList.length]);

  // Handle booth data loading when both categories and event data are available
  useEffect(() => {
    if (getDetailEvent?.data?.booths && categories.length > 0) {
      const eventData = getDetailEvent.data;
      console.log('Loading booth data with categories available:', {
        booths: eventData.booths,
        categories: categories.length,
        boothTypes: boothTypes.length
      });
      
      // Debug the first booth to see all available fields
      if (eventData.booths.length > 0) {
        console.log('First booth raw data:', eventData.booths[0]);
        console.log('First booth keys:', Object.keys(eventData.booths[0]));
      }
      
      const transformedBooths = eventData.booths.map((booth: any, index: number) => {
        console.log(`Booth ${index} processing:`, {
          boothType: booth.boothType,
          boothTypeType: typeof booth.boothType,
          availableTypes: boothTypes.map(bt => ({ id: bt.id, name: bt.name }))
        });
        
        // Check if boothType matches any available category
        const matchingCategory = boothTypes.find(bt => bt.id === booth.boothType);
        console.log(`Booth ${index} matching category:`, matchingCategory);
        
        // Also check by name in case IDs don't match
        const matchingByName = boothTypes.find(bt => bt.name === booth.boothType);
        console.log(`Booth ${index} matching by name:`, matchingByName);
        
        // Try to find the correct booth type ID
        let correctBoothType = booth.boothType;
        
        // Handle case where boothType might be an object with _id
        if (typeof booth.boothType === 'object' && booth.boothType?._id) {
          correctBoothType = booth.boothType._id;
          console.log(`Booth ${index} extracted _id from object:`, correctBoothType);
        }
        
        // Check if the corrected value matches any category
        const finalMatchingCategory = boothTypes.find(bt => bt.id === correctBoothType);
        if (!finalMatchingCategory && matchingByName) {
          correctBoothType = matchingByName.id;
          console.log(`Booth ${index} corrected booth type from name:`, correctBoothType);
        }
        
        // Final fallback: if still no match, try to find "DJ Nights" specifically
        if (!finalMatchingCategory && !matchingByName) {
          const djNightsCategory = boothTypes.find(bt => bt.name === "DJ Nights");
          if (djNightsCategory) {
            correctBoothType = djNightsCategory.id;
            console.log(`Booth ${index} fallback to DJ Nights:`, correctBoothType);
          }
        }
        
        console.log(`Booth ${index} final booth type:`, correctBoothType);
        
        return {
          id: booth._id || `booth_${index}`,
          boothName: booth.boothName || '',
          boothType: correctBoothType || '',
          boothPrice: booth.boothPrice?.toString() || '',
          capacity: booth.capacity?.toString() || '',
          discountedPrice: booth.discountedPrice?.toString() || '',
          boothImages: Array.isArray(booth.boothImage) ? booth.boothImage : []
        };
      });
      
      console.log('Final transformed booths:', transformedBooths);
      setBooths(transformedBooths);
      setEnableBooths(transformedBooths.length > 0);
    }
  }, [getDetailEvent?.data?.booths, categories.length, boothTypes.length]);

  // Load event details on component mount
  useEffect(() => {
    console.log('clubId::===>', clubId);
    if (clubId) {
      const action = onGetDetailEvent({ id: clubId });
      console.log('onGetDetailEvent action:', action);
      dispatch(action);
    }
  }, [clubId, dispatch]);

  // Handle GetDetailEvent API response
  useEffect(() => {
    if (
      getDetailEvent?.status === true ||
      getDetailEvent?.status === 'true' ||
      getDetailEvent?.status === 1 ||
      getDetailEvent?.status === "1"
    ) {
      const eventData = getDetailEvent?.data;
      if (eventData) {
        console.log('Event data loaded:', eventData);
        console.log('Available fields:', Object.keys(eventData));
        console.log('Time-related fields:', {
          openingTime: eventData.openingTime,
          closingTime: eventData.closingTime,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          time: eventData.time,
          times: eventData.times,
          schedule: eventData.schedule,
          timing: eventData.timing
        });
        
        setName(eventData.name || '');
        setDetails(eventData.details || eventData.description || '');
        setAddress(eventData.address || '');
        const startTimeValue = eventData.openingTime || eventData.startTime || eventData.start_time || '';
        console.log('Start time value found:', startTimeValue);
        
        // Try to format the time if it's in a different format
        let formattedStartTime = startTimeValue;
        if (startTimeValue && typeof startTimeValue === 'string') {
          // If it's a full datetime string, extract just the time part
          if (startTimeValue.includes('T') || startTimeValue.includes(' ')) {
            try {
              const date = new Date(startTimeValue);
              formattedStartTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
            } catch (e) {
              console.log('Error parsing start time:', e);
            }
          }
        }
        
        console.log('Formatted start time:', formattedStartTime);
        setStartTime(formattedStartTime);
        
        // Load end time - API uses closeTime
        const endTimeValue = eventData.closeTime || eventData.closingTime || eventData.endTime || eventData.end_time || '';
        console.log('End time value found:', endTimeValue);
        
        // Try to format the time if it's in a different format
        let formattedEndTime = endTimeValue;
        if (endTimeValue && typeof endTimeValue === 'string') {
          // If it's a full datetime string, extract just the time part
          if (endTimeValue.includes('T') || endTimeValue.includes(' ')) {
            try {
              const date = new Date(endTimeValue);
              formattedEndTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
            } catch (e) {
              console.log('Error parsing end time:', e);
            }
          }
        }
        
        console.log('Formatted end time:', formattedEndTime);
        setEndTime(formattedEndTime);
        
        // Load coordinates from API response
        // Swap only if coordinates appear to be in [lng, lat] format
        if (eventData.coordinates && eventData.coordinates.coordinates) {
          console.log('Loading coordinates:', eventData.coordinates);
          const [firstCoord, secondCoord] = eventData.coordinates.coordinates;
          // Check if coordinates might be in [lng, lat] format
          // For India region: lng is typically 68-88, lat is 6-37
          // If first coord is in lng range and larger than second, likely [lng, lat]
          const looksLikeLngLat = firstCoord > 60 && firstCoord < 100 && secondCoord > 0 && secondCoord < 40 && firstCoord > secondCoord;
          setCoordinates({
            type: eventData.coordinates.type || "Point",
            coordinates: looksLikeLngLat ? [secondCoord, firstCoord] : [firstCoord, secondCoord], // Swap if needed to ensure [lat, lng]
          });
        }
        // Format dates properly - use DD/MM/YYYY format (matching add screen)
        if (eventData.startDate) {
          const startDateObj = new Date(eventData.startDate);
          const day = String(startDateObj.getDate()).padStart(2, '0');
          const month = String(startDateObj.getMonth() + 1).padStart(2, '0');
          const year = startDateObj.getFullYear();
          setStartDate(`${day}/${month}/${year}`);
        }
        if (eventData.endDate) {
          const endDateObj = new Date(eventData.endDate);
          const day = String(endDateObj.getDate()).padStart(2, '0');
          const month = String(endDateObj.getMonth() + 1).padStart(2, '0');
          const year = endDateObj.getFullYear();
          setEndDate(`${day}/${month}/${year}`);
        }
        setEntryFee(eventData.entryFee?.toString() || eventData.price?.toString() || eventData.entry_fee?.toString() || '');
        
        // Handle discount price based on event type
        const eventType = eventData.type || 'Event';
        if (eventType === 'Booth' || eventType === 'VIP Entry') {
          // For Booth and VIP Entry, discount price might be in details field
          setDiscountPrice(eventData.discountPrice?.toString() || eventData.discount_price?.toString() || '');
        } else {
          // For other types, use normal discount price fields
          setDiscountPrice(eventData.discountPrice?.toString() || eventData.discount_price?.toString() || '');
        }
        
        setEventCapacity(eventData.capacity?.toString() || eventData.eventCapacity?.toString() || eventData.event_capacity?.toString() || '');
        setFloorLayout(eventData.floorLayout || eventData.floor_layout || '');
        setType(eventType);
        
        // Note: Booth loading is handled in separate useEffect when categories are available
        
        // Load events/tickets if available
        if (eventData.tickets && Array.isArray(eventData.tickets)) {
          console.log('Event tickets from tickets field:', eventData.tickets);
          // Transform ticket data to match our interface
          const transformedTickets = eventData.tickets.map((ticket: any, index: number) => ({
            id: ticket._id || `ticket_${index}`,
            _id: ticket._id, // Keep the API _id for deletion
            ticketType: ticket.ticketType?._id || ticket.ticketType || '',
            ticketPrice: ticket.ticketPrice?.toString() || ticket.price?.toString() || '',
            capacity: ticket.capacity?.toString() || '',
          }));
          setEvents(transformedTickets);
          setEnableTickets(transformedTickets.length > 0);
        } else if (eventData.events && Array.isArray(eventData.events)) {
          // Alternative field name for tickets
          console.log('Event tickets from events field:', eventData.events);
          const transformedTickets = eventData.events.map((ticket: any, index: number) => ({
            id: ticket._id || `ticket_${index}`,
            _id: ticket._id, // Keep the API _id for deletion
            ticketType: ticket.ticketType?._id || ticket.ticketType || '',
            ticketPrice: ticket.ticketPrice?.toString() || ticket.price?.toString() || '',
            capacity: ticket.capacity?.toString() || '',
          }));
          setEvents(transformedTickets);
          setEnableTickets(transformedTickets.length > 0);
        }
        
        // Load photos if available - API uses photos field
        if (eventData.photos && Array.isArray(eventData.photos)) {
          console.log('Event images from photos field:', eventData.photos);
          setUploadPhotos(eventData.photos);
        } else if (eventData.images && Array.isArray(eventData.images)) {
          console.log('Event images from images field:', eventData.images);
          setUploadPhotos(eventData.images);
        } else if (eventData.imageUrls && Array.isArray(eventData.imageUrls)) {
          // Alternative field name for image URLs
          console.log('Event images from imageUrls field:', eventData.imageUrls);
          setUploadPhotos(eventData.imageUrls);
        }
        
        // Load facilities selection
        if (eventData.facilities && Array.isArray(eventData.facilities)) {
          console.log('Event facilities:', eventData.facilities);
          setFacilitiesList(prevFacilities => 
            prevFacilities.map(facility => ({
              ...facility,
              selected: eventData.facilities.some((selectedFacility: any) => 
                selectedFacility._id === facility._id || 
                selectedFacility === facility._id ||
                selectedFacility.name === facility.name
              )
            }))
          );
        }
        
        setIsDataLoaded(true);
      }
      dispatch(getDetailEventData(""));
    }

    if (getDetailEventErr) {
      Alert.alert('Error', 'Failed to load event details');
      dispatch(getDetailEventError(""));
    }
  }, [getDetailEvent, getDetailEventErr, dispatch]);

  // Handle Update Event API response
  useEffect(() => {
    if (
      updateEvent?.status === true ||
      updateEvent?.status === 'true' ||
      updateEvent?.status === 1 ||
      updateEvent?.status === "1"
    ) {
      dispatch(updateEventData(""));
      Alert.alert('Success', 'Event updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
     
      setLoading(false);
      // dispatch(updateEventData({}));
    }

    if (updateEventErr) {
      Alert.alert('Error', 'Failed to update event');
      setLoading(false);
      dispatch(updateEventError(""));
    }
  }, [updateEvent, updateEventErr, dispatch, navigation]);

  // Handle Delete Event Part API response
  useEffect(() => {
    if (
      deleteEventPart?.status === true ||
      deleteEventPart?.status === 'true' ||
      deleteEventPart?.status === 1 ||
      deleteEventPart?.status === "1"
    ) {
      console.log('Ticket deleted successfully:', deleteEventPart);
      showToast('success', 'Ticket deleted successfully!');
      
      // Remove the deleted ticket from UI after successful API response
      if (deletingTicketIndex !== null) {
        setEvents(prevEvents => prevEvents.filter((_, i) => i !== deletingTicketIndex));
        setDeletingTicketIndex(null);
      }
      
      dispatch(deleteEventPartData(""));
    }

    if (deleteEventPartErr) {
      console.log('Delete ticket error:', deleteEventPartErr);
      showToast('error', 'Failed to delete ticket');
      setDeletingTicketIndex(null); // Clear the deleting index on error
      dispatch(deleteEventPartError(""));
    }
  }, [deleteEventPart, deleteEventPartErr, dispatch]);

  // Time picker handlers
  const handleTimePicker = (mode: "start" | "end") => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    const timeString = formatTimeString(selectedTime);
    if (timePickerMode === "start") {
      setStartTime(timeString);
    } else {
      setEndTime(timeString);
    }
    setShowTimePicker(false);
  };

  // Date picker handlers
  const handleDatePicker = (mode: "start" | "end") => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = formatDateString(selectedDate);
      if (datePickerMode === "start") {
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }
    }
  };

  // Address handler
  const handleAddressSelect = (addressResult: any) => {
    const selectedAddress = addressResult.formatted_address || addressResult.address || '';
    setAddress(selectedAddress);
    if (addressResult.geometry && addressResult.geometry.location) {
      setCoordinates({
        type: "Point",
        coordinates: [addressResult.geometry.location.lat, addressResult.geometry.location.lng],
      });
    }
    setShowAddressModal(false);
  };

  const handleSave = () => {
    // Debug logging for all form fields
    console.log("=== FORM VALIDATION DEBUG ===");
    console.log("Type:", type);
    console.log("Name:", name, "- Empty:", !name.trim());
    console.log("Details:", details, "- Empty:", !details.trim());
    console.log("Entry Fee:", entryFee, "- Empty:", !entryFee.trim());
    console.log("Discount Price:", discountPrice, "- Empty:", !discountPrice.trim());
    console.log("Event Capacity:", eventCapacity, "- Empty:", !eventCapacity.trim());
    console.log("Address:", address, "- Empty:", !address.trim());
    console.log("Start Date:", startDate, "- Empty:", !startDate.trim());
    console.log("End Date:", endDate, "- Empty:", !endDate.trim());
    console.log("Upload Photos:", uploadPhotos, "- Count:", uploadPhotos.length);
    console.log("Booths:", booths, "- Count:", booths.length);
    console.log("Events:", events, "- Count:", events.length);
    console.log("Enable Booths:", enableBooths);
    console.log("Enable Tickets:", enableTickets);

    // Validation - matching add screen validation logic
    // Details optional for Booth/VIP Entry, required for Club/Event
    // Discount price is optional for all types
    
    // Set errors for field highlighting (matching add screen approach)
    setErrors({
      name: !name.trim(),
      details: (type === "Club" || type === "Event" || type === "Table") ? !details.trim() : false,
      entryFee: !entryFee.trim() || isNaN(Number(entryFee)),
      discountPrice: false, // Always optional
      eventCapacity: !eventCapacity.trim() || isNaN(Number(eventCapacity)) || Number(eventCapacity) <= 0,
      address: !address.trim(),
      startDate: !startDate.trim(),
      endDate: !endDate.trim(),
      floorLayout: type === "Table" ? !floorLayout : false, // Required for Table type (image URL)
    });

    // Check basic required fields - matching add screen logic
    const missingFields = [];

    // Different validation based on type (matching add screen)
    if (type === "Booth" || type === "VIP Entry") {
      if (!name.trim()) missingFields.push("Name");
      if (!entryFee.trim() || isNaN(Number(entryFee))) missingFields.push("Price"); // Use "Price" for Booth/VIP Entry (matching add screen)
      if (!eventCapacity.trim() || isNaN(Number(eventCapacity)) || Number(eventCapacity) <= 0) {
        missingFields.push("Capacity"); // Use "Capacity" for Booth/VIP Entry (matching add screen)
      }
      // Discount price is optional - no validation required
    } else if (type === "Table") {
      if (!name.trim()) missingFields.push("Table Name");
      if (!details.trim()) missingFields.push("Details");
      if (!entryFee.trim() || isNaN(Number(entryFee))) missingFields.push("Table Fee");
      if (!eventCapacity.trim() || isNaN(Number(eventCapacity)) || Number(eventCapacity) <= 0) {
        missingFields.push("Seating Capacity");
      }
      if (!floorLayout) missingFields.push("Floor Layout");
    } else {
      if (!name.trim()) missingFields.push("Name");
      if (!details.trim()) missingFields.push("Details"); // Required for Club/Event types
      if (!entryFee.trim() || isNaN(Number(entryFee))) missingFields.push("Entry Fee");
      if (!eventCapacity.trim() || isNaN(Number(eventCapacity)) || Number(eventCapacity) <= 0) {
        missingFields.push("Event Capacity");
      }
    }

    // Common fields for all types (except Table)
    if (type !== "Table") {
      if (!startTime.trim()) missingFields.push("Start Time");
      if (!endTime.trim()) missingFields.push("End Time");
      if (!startDate.trim()) missingFields.push("Start Date");
      if (!endDate.trim()) missingFields.push("End Date");
    }
    // Address and photos required for all types
    if (!address.trim()) missingFields.push("Address");
    if (uploadPhotos.length === 0) missingFields.push("Upload Photos");

    // Validate date constraints (only for non-Table types)
    if (type !== "Table" && startDate.trim() && endDate.trim() && !validateDates(startDate, endDate)) {
      showToast("error", "End date must be same or after start date");
      setErrors((prev) => ({ ...prev, endDate: true }));
      return;
    }

    // Check for missing booths/tickets based on type and enabled state (matching add screen)
    if (type === "Club") {
      if (enableBooths && booths.length === 0) missingFields.push("Booths");
    }
    if (type === "Event") {
      if (enableTickets && events.length === 0) missingFields.push("Tickets");
    }

    if (missingFields.length > 0) {
      console.log("=== MISSING FIELDS ===");
      console.log("Missing fields:", missingFields);
      console.log("Type:", type);
      
      Alert.alert('Error', `Please fill in all required fields. Missing: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    
    // Transform booths to match API structure exactly
    const transformedBooths = enableBooths ? booths.map(booth => ({
      boothName: booth.boothName || '',
      boothType: booth.boothType || '',
      boothPrice: parseInt(booth.boothPrice || '0'),
      capacity: parseInt(booth.capacity || '0'),
      discountedPrice: parseInt(booth.discountedPrice || '0'),
      boothImage: Array.isArray(booth.boothImages) ? booth.boothImages : []
    })) : [];
    
    // Transform events/tickets to match API structure
        const transformedTickets = enableTickets ? events.map(event => ({
          ticketType: event.ticketType || '',
          ticketPrice: parseInt(event.ticketPrice || '0'),
          capacity: parseInt(event.capacity || '0')
        })) : [];
        
        // Handle details field based on event type
        let detailsField = details;
        if ((type === 'Booth' || type === 'VIP Entry') && discountPrice) {
          // For Booth and VIP Entry, put discount price in details field
          detailsField = discountPrice;
        }

        // Convert dates from DD/MM/YYYY to YYYY-MM-DD format for API (only for non-Table types)
        const formattedStartDate = type !== "Table" ? convertDateToAPIFormat(startDate) : "";
        const formattedEndDate = type !== "Table" ? convertDateToAPIFormat(endDate) : "";

        const payload: any = {
          id: clubId,
          type,
          name,
          details: detailsField,
          entryFee: parseInt(entryFee || '0'),
          discountPrice: parseInt(discountPrice || '0'),
          eventCapacity: eventCapacity,
          address,
          coordinates,
          photos: uploadPhotos,
          booths: transformedBooths,
          tickets: transformedTickets,
        };

        // Add date/time fields only for non-Table types
        if (type !== "Table") {
          payload.openingTime = startTime;
          payload.closeTime = endTime;
          payload.startDate = formattedStartDate;
          payload.endDate = formattedEndDate;
          payload.facilities = facilitiesList.filter(f => f.selected).map(f => f._id);
        }

        // Add floorLayout for Table type
        if (type === "Table") {
          payload.floorLayout = floorLayout;
        }
    
    console.log('Update payload:', JSON.stringify(payload, null, 2));
    const updateAction = onUpdateEvent(payload);
    console.log('onUpdateEvent action:', updateAction);
    dispatch(updateAction);
  };

  if (!isDataLoaded && loader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violate} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Event</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <CustomDropdown
              label="Type*"
              placeholder="Select type"
              options={types}
              selectedValue={type}
              onSelect={(value) => {
                showToast("error", 'You can not change the type of the event');
                // setType(typeof value === "string" ? value : value.name);
                // if (errors.name) {
                //   setErrors((prev) => ({ ...prev, name: false }));
                // }
              }}
              error={
                !type ||
                (type !== "Club" &&
                  type !== "Event" &&
                  type !== "VIP Entry" &&
                  type !== "Booth" &&
                  type !== "Table")
              }
              message={
                !type ||
                  (type !== "Club" &&
                    type !== "Event" &&
                    type !== "VIP Entry" &&
                    type !== "Booth" &&
                    type !== "Table")
                  ? "Please select a type"
                  : ""
              }
            />

            {/* Show different fields based on type */}
            {type !== "Booth" && type !== "VIP Entry" && type !== "Table" && (
              <>
                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Name*"
                    placeholder="Enter name"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: false }));
                      }
                    }}
                    error={errors.name}
                    message={errors.name ? "Name is required" : ""}
                    leftImage=""
                    kType="default"
                  />
                </View>

                <DetailsInput
                  label="Details*"
                  placeholder="Enter here"
                  value={details}
                  onChangeText={(text) => {
                    setDetails(text);
                    if (errors.details) {
                      setErrors((prev) => ({ ...prev, details: false }));
                    }
                  }}
                  error={errors.details}
                  message={errors.details ? "Details are required" : ""}
                  required={false}
                />

                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Entry Fee*"
                    placeholder="Enter fee"
                    value={entryFee}
                    onChangeText={(text) => {
                      setEntryFee(text);
                      if (errors.entryFee) {
                        setErrors((prev) => ({ ...prev, entryFee: false }));
                      }
                    }}
                    error={errors.entryFee}
                    message={errors.entryFee ? "Valid entry fee is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Event Capacity*"
                    placeholder="Enter capacity"
                    value={eventCapacity}
                    onChangeText={(text) => {
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({ ...prev, eventCapacity: false }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={errors.eventCapacity ? "Event capacity is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>
              </>
            )}

            {/* Show name field for Booth and VIP Entry types */}
            {(type === "Booth" || type === "VIP Entry") && (
              <View style={styles.formElement}>
                <CustomeTextInput
                  label="Name*"
                  placeholder="Enter name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: false }));
                    }
                  }}
                  error={errors.name}
                  message={errors.name ? "Name is required" : ""}
                  leftImage=""
                  kType="default"
                />
              </View>
            )}

            {/* Show Details field for Booth and VIP Entry types */}
            {(type === "Booth" || type === "VIP Entry") && (
              <DetailsInput
                label="Details*"
                placeholder="Enter here"
                value={details}
                onChangeText={(text) => {
                  setDetails(text);
                  if (errors.details) {
                    setErrors((prev) => ({ ...prev, details: false }));
                  }
                }}
                error={errors.details}
                message={errors.details ? "Details are required" : ""}
                required={false}
              />
            )}

            {/* Table-specific fields */}
            {type === "Table" && (
              <>
                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Table Name*"
                    placeholder="Enter table name"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: false }));
                      }
                    }}
                    error={errors.name}
                    message={errors.name ? "Table name is required" : ""}
                    leftImage=""
                    kType="default"
                  />
                </View>

                <DetailsInput
                  label="Details*"
                  placeholder="Enter here"
                  value={details}
                  onChangeText={(text) => {
                    setDetails(text);
                    if (errors.details) {
                      setErrors((prev) => ({ ...prev, details: false }));
                    }
                  }}
                  error={errors.details}
                  message={errors.details ? "Details are required" : ""}
                  required={false}
                />

                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Table Fee*"
                    placeholder="Enter table fee"
                    value={entryFee}
                    onChangeText={(text) => {
                      setEntryFee(text);
                      if (errors.entryFee) {
                        setErrors((prev) => ({ ...prev, entryFee: false }));
                      }
                    }}
                    error={errors.entryFee}
                    message={errors.entryFee ? "Valid table fee is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Seating Capacity*"
                    placeholder="Enter seating capacity"
                    value={eventCapacity}
                    onChangeText={(text) => {
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({ ...prev, eventCapacity: false }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={errors.eventCapacity ? "Valid seating capacity is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={styles.formElement}>
                  <Text style={styles.sectionLabel}>
                    Floor Layout*
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={styles.floorLayoutImageBox}
                      onPress={() => {
                        if (floorLayout) {
                          Alert.alert("Error", "Floor layout image already exists. Please delete it first.");
                          return;
                        }
                        setCurrentImageIndex(0);
                        setCurrentImageType("floorLayout");
                        setShowImagePicker(true);
                      }}
                    >
                      {floorLayout ? (
                        <Image
                          source={{ uri: floorLayout }}
                          style={styles.floorLayoutImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <GalleryIcon />
                      )}
                    </TouchableOpacity>
                    {floorLayout && (
                      <TouchableOpacity
                        style={[styles.deleteButton, { top: verticalScale(5), right: horizontalScale(5) }]}
                        onPress={() => {
                          Alert.alert("Delete Image", "Are you sure you want to delete this floor layout image?", [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                setFloorLayout("");
                                if (errors.floorLayout) {
                                  setErrors((prev) => ({ ...prev, floorLayout: false }));
                                }
                                showToast("success", "Floor layout image deleted");
                              },
                            },
                          ]);
                        }}
                      >
                        <DeleteIconNew width={20} height={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.floorLayout && (
                    <Text style={styles.errorText}>
                      Floor layout image is required
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* Date and Time fields - not shown for Table type */}
            {type !== "Table" && (
              <>
                {/* Date Pickers */}
                <View style={styles.formElement}>
                  <DatePickerInput
                    label="Start Date *"
                    placeholder="Select date"
                    value={startDate}
                    onChangeText={(text) => {
                      setStartDate(text);
                      if (errors.startDate) {
                        setErrors((prev) => ({ ...prev, startDate: false }));
                      }
                    }}
                    error={errors.startDate}
                    message={errors.startDate ? "Start date is required" : ""}
                    leftImage=""
                    style={styles.datePickerWrapper}
                    allowFutureDates={true}
                    minDate={new Date()}
                    maxDate={new Date(2035, 11, 31)}
                  />
                </View>

                <View style={styles.formElement}>
                  <DatePickerInput
                    label="End Date *"
                    placeholder="Select date"
                    value={endDate}
                    onChangeText={(text) => {
                      setEndDate(text);
                      if (errors.endDate) {
                        setErrors((prev) => ({ ...prev, endDate: false }));
                      }
                    }}
                    error={errors.endDate}
                    message={errors.endDate ? "End date is required" : ""}
                    leftImage=""
                    style={styles.datePickerWrapper}
                    allowFutureDates={true}
                    minDate={new Date()}
                    maxDate={new Date(2035, 11, 31)}
                  />
                </View>

                {/* Time Pickers */}
                <View style={styles.formElement}>
                  <Text style={styles.label}>Start Time*</Text>
                  <TouchableOpacity
                    style={styles.timeInputButton}
                    onPress={() => handleTimePicker("start")}
                  >
                    <Text
                      style={
                        startTime
                          ? styles.timeInputText
                          : styles.timeInputPlaceholder
                      }
                    >
                      {startTime || "Select time"}
                    </Text>
                    <TimeIcon />
                  </TouchableOpacity>
                </View>

                <View style={styles.formElement}>
                  <Text style={styles.label}>End Time*</Text>
                  <TouchableOpacity
                    style={styles.timeInputButton}
                    onPress={() => handleTimePicker("end")}
                  >
                    <Text
                      style={
                        endTime
                          ? styles.timeInputText
                          : styles.timeInputPlaceholder
                      }
                    >
                      {endTime || "Select time"}
                    </Text>
                    <TimeIcon />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Address */}
            <View style={styles.formElement}>
              <Text style={styles.label}>Address*</Text>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => setShowAddressModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={[
                      styles.addressInput,
                      errors.address && { borderColor: colors.red },
                    ]}
                    placeholder="Tap to select address"
                    placeholderTextColor={colors.textColor}
                    value={address}
                    editable={false}
                    multiline={true}
                    pointerEvents="none"
                  />
                  <View style={styles.locationIconContainer}>
                    <LocationIcon
                      width={20}
                      height={20}
                      color={colors.violate}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {errors.address && (
                <Text style={styles.errorText}>
                  Address is required
                </Text>
              )}
            </View>

            {/* Booth-specific fields for Booth and VIP Entry types */}
            {(type === "Booth" || type === "VIP Entry") && (
              <>
                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Price*"
                    placeholder="Enter price"
                    value={entryFee}
                    onChangeText={(text) => {
                      setEntryFee(text);
                      if (errors.entryFee) {
                        setErrors((prev) => ({ ...prev, entryFee: false }));
                      }
                    }}
                    error={errors.entryFee}
                    message={errors.entryFee ? "Valid price is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

               

                {/* <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Discount Price"
                    placeholder="Enter discount price"
                    value={discountPrice}
                    onChangeText={(text) => {
                      setDiscountPrice(text);
                      if (errors.discountPrice) {
                        setErrors((prev) => ({ ...prev, discountPrice: false }));
                      }
                    }}
                    error={errors.discountPrice}
                    message={errors.discountPrice ? "Valid discount price is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View> */}

                <View style={styles.formElement}>
                  <CustomeTextInput
                    label="Capacity*"
                    placeholder="Enter capacity"
                    value={eventCapacity}
                    onChangeText={(text) => {
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({ ...prev, eventCapacity: false }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={errors.eventCapacity ? "Valid capacity is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>
              </>
            )}

            {/* Dynamic Booth Forms for Club only */}
            {type === "Club" && (
              <>
                <View style={styles.formElement}>
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>
                      Enable Booths (Optional)
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        enableBooths && styles.toggleButtonActive,
                      ]}
                      onPress={() => {
                        setEnableBooths(!enableBooths);
                        if (enableBooths) {
                          setBooths([]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          enableBooths && styles.toggleButtonTextActive,
                        ]}
                      >
                        {enableBooths ? "Enabled" : "Disabled"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {enableBooths && (
                  <>
                    {booths.map((booth, index) => (
                      <BoothForm
                        key={booth.id}
                        booth={booth}
                        boothIndex={index}
                        onUpdate={updateBooth}
                        onRemove={removeBooth}
                        onImagePicker={handleImagePicker}
                        onDeleteImage={handleDeleteImage}
                        boothTypes={boothTypes}
                      />
                    ))}
                    <TouchableOpacity
                      style={styles.addNewButton}
                      onPress={addNewBooth}
                    >
                      <PlusIcon />
                      <Text style={styles.addNewButtonText}>
                        Add New Booth
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {/* Dynamic Ticket Forms for Event */}
            {type === "Event" && (
              <>
                <View style={styles.formElement}>
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>
                      Enable Tickets (Optional)
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        enableTickets && styles.toggleButtonActive,
                      ]}
                      onPress={() => {
                        setEnableTickets(!enableTickets);
                        if (enableTickets) {
                          setEvents([]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          enableTickets && styles.toggleButtonTextActive,
                        ]}
                      >
                        {enableTickets ? "Enabled" : "Disabled"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {enableTickets && (
                  <>
                    {events.map((event, index) => (
                      <View key={event.id} style={styles.eventContainer}>
                        <View style={styles.eventHeader}>
                          <Text style={styles.eventTitle}>Ticket {index + 1}</Text>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeEvent(index)}
                          >
                            <Text style={styles.removeButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.categorySection}>
                          <Text style={styles.categoryLabel}>Ticket Type*</Text>
                          <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScrollView}
                            contentContainerStyle={styles.categoryContainer}
                          >
                            {eventTypes.map((category) => (
                              <TouchableOpacity
                                key={category._id}
                                style={[
                                  styles.categoryButton,
                                  event.ticketType === category._id && styles.categoryButtonSelected
                                ]}
                                onPress={() => {
                                  const updatedEvent = { ...event, ticketType: category._id };
                                  updateEventDataLocal(index, updatedEvent);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={[
                                  styles.categoryButtonText,
                                  event.ticketType === category._id && styles.categoryButtonTextSelected
                                ]}>
                                  {category.name}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>

                        <View style={styles.inputRow}>
                          <View style={styles.inputHalf}>
                            <CustomeTextInput
                              label="Ticket Price*"
                              placeholder="Enter price"
                              value={event.ticketPrice}
                              onChangeText={(text) => {
                                const updatedEvent = { ...event, ticketPrice: text };
                                updateEventDataLocal(index, updatedEvent);
                              }}
                              kType="numeric"
                              error={false}
                              message=""
                              leftImage=""
                            />
                          </View>
                          <View style={styles.inputHalf}>
                            <CustomeTextInput
                              label="Capacity*"
                              placeholder="Enter capacity"
                              value={event.capacity}
                              onChangeText={(text) => {
                                const updatedEvent = { ...event, capacity: text };
                                updateEventDataLocal(index, updatedEvent);
                              }}
                              kType="numeric"
                              error={false}
                              message=""
                              leftImage=""
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                    
                    <TouchableOpacity
                      style={styles.addNewButton}
                      onPress={addNewEvent}
                    >
                      <PlusIcon />
                      <Text style={styles.addNewButtonText}>
                        Add New Ticket
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {/* Upload Photos */}
            <View style={styles.formElement}>
              <Text style={styles.sectionLabel}>
                Upload Photos ({uploadPhotos.length}/3)
              </Text>
              <View style={styles.uploadPhotosRow}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={styles.imageContainer}
                  >
                    <TouchableOpacity
                      style={styles.imageUploadBox}
                      onPress={() => {
                        if (uploadPhotos.length < 3 || uploadPhotos[index]) {
                          handlePhotoUpload(index);
                        } else {
                          Alert.alert("Error", "Maximum 3 images allowed");
                        }
                      }}
                    >
                      {uploadPhotos[index] ? (
                        <Image
                          source={{ uri: uploadPhotos[index] }}
                          style={styles.uploadedImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <GalleryIcon />
                      )}
                    </TouchableOpacity>
                    {uploadPhotos[index] && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMainImage(index)}
                      >
                        <DeleteIconNew width={20} height={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Facilities section - not shown for Booth, VIP Entry, and Table types, and only show if facilities exist */}
            {type !== "Booth" && type !== "VIP Entry" && type !== "Table" && facilitiesList && facilitiesList.length > 0 && (
              <View style={styles.formElement}>
                <Text style={styles.sectionLabel}>
                  Facilities
                </Text>
                {facilitiesLoading ? (
                  <Text style={styles.loadingText}>
                    Loading facilities...
                  </Text>
                ) : (
                  <View style={styles.facilitiesGrid}>
                    {facilitiesList.map((facility) => (
                      <TouchableOpacity
                        key={facility._id}
                        style={styles.facilityCheckboxContainer}
                        onPress={() => toggleFacility(facility._id)}
                      >
                        <View
                          style={[
                            styles.facilityCheckbox,
                            facility.selected && styles.facilityCheckedBox,
                          ]}
                        >
                          {facility.selected && (
                            <Text style={styles.facilityCheckmark}>
                              ✓
                            </Text>
                          )}
                        </View>
                        <Text style={styles.facilityCheckboxText}>
                          {facility.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.formElement}>
              <Buttons
                title={loading ? "Updating..." : "Update Event"}
                onPress={handleSave}
                style={styles.saveButton}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Time Picker Modal */}
      {showTimePicker && Platform.OS === "ios" && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.timePickerModal}>
            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerHeader}>
                <Text style={styles.timePickerTitle}>
                  Select {timePickerMode === "start" ? "Opening" : "Closing"} Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={styles.timePickerCloseButton}
                >
                  <Text style={styles.timePickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeDisplayContainer}>
                <Text style={styles.timeDisplayText}>
                  {formatTimeString(selectedTime)}
                </Text>
              </View>

              <CustomTimePicker
                initialTime={selectedTime}
                onTimeChange={setSelectedTime}
                mode={timePickerMode}
              />

              <View style={styles.timePickerButtons}>
                <TouchableOpacity
                  style={styles.timePickerCancelButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.timePickerCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timePickerConfirmButton}
                  onPress={handleTimeConfirm}
                >
                  <Text style={styles.timePickerConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={(() => {
            try {
              if (datePickerMode === "start" && startDate) {
                // Parse DD/MM/YYYY format
                const [day, month, year] = startDate.split("/");
                return new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day)
                );
              } else if (datePickerMode === "end" && endDate) {
                // Parse DD/MM/YYYY format
                const [day, month, year] = endDate.split("/");
                return new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day)
                );
              }
              return new Date();
            } catch (error) {
              return new Date();
            }
          })()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          textColor={colors.white}
          themeVariant="dark"
          minimumDate={(() => {
            try {
              if (datePickerMode === "end" && startDate) {
                // Parse DD/MM/YYYY format
                const [day, month, year] = startDate.split("/");
                return new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day)
                );
              }
              return new Date();
            } catch (error) {
              return new Date();
            }
          })()}
          maximumDate={new Date(2035, 11, 31)} // Allow dates up to 2035
        />
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <GoogleAddressAutocomplete
          visible={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSelect={handleAddressSelect}
        />
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImageSelectionBottomSheet
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onCameraPress={() => {
            console.log("Camera pressed for", currentImageType);
            if (currentImageType === "floorLayout") {
              handleImagePicker("camera", currentImageType, -1, -1);
            } else {
              handleImagePicker("camera", currentImageType, currentBoothIndex, currentEventIndex);
            }
          }}
          onGalleryPress={() => {
            console.log("Gallery pressed for", currentImageType);
            if (currentImageType === "floorLayout") {
              handleImagePicker("gallery", currentImageType, -1, -1);
            } else {
              handleImagePicker("gallery", currentImageType, currentBoothIndex, currentEventIndex);
            }
          }}
        />
      )}
    </View>
  );
};

export default EditDetailScreen;
