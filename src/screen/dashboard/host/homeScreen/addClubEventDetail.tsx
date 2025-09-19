import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CustomeTextInput,
  DatePickerInput,
} from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import DetailsInput from "../../../../components/DetailsInput";
import CustomDropdown from "../../../../components/CustomDropdown";
import ImageSelectionBottomSheet from "../../../../components/ImageSelectionBottomSheet";
import CategoryButton from "../../../../components/CategoryButton";
import addClubEventDetailStyle from "./addClubEventDetailStyle";
import TimeIcon from "../../../../assets/svg/timeIcon";
import CalendarIcon from "../../../../assets/svg/calendarIcon";
import ArrowDownIcon from "../../../../assets/svg/arrowDownIcon";
import PlusIcon from "../../../../assets/svg/plusIcon";
import GalleryIcon from "../../../../assets/svg/galleryIcon";
import BackIcon from "../../../../assets/svg/backIcon";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from 'react-redux';
import {
  onCreateevent,
  createeventData,
  createeventError,
} from '../../../../redux/auth/actions';
import { showToast } from '../../../../utilis/toastUtils';
import { uploadFileToS3 } from '../../../../utilis/s3Upload';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { fetchGet } from '../../../../redux/services';
import BoothForm from './components/BoothForm';
import EventForm from './components/EventForm';
import { useCategory } from '../../../../hooks/useCategory';
import { useFacility } from '../../../../hooks/useFacility';
import LocationIcon from '../../../../assets/svg/locationIcon';
import GoogleAddressAutocomplete from '../../../../components/GoogleAddressAutocomplete';
import TicketDisplay from './components/TicketDisplay';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAuNmySs9bQau79bffjocK1CM-neMrXdaY';

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
  eventName: string;
  eventType: string;
  eventPrice: string;
  capacity: string;
}

interface AddClubDetailScreenProps {
  navigation?: any;
}

const AddClubDetailScreen: React.FC<AddClubDetailScreenProps> = ({
  navigation,
}) => {
  const route = useRoute();
  // Hooks for dynamic data
  const { categories, isLoading: categoriesLoading, error: categoriesError, fetchCategories } = useCategory();
  const { facilities, isLoading: facilitiesLoading, error: facilitiesError, fetchFacilities } = useFacility();

  // Form data
  const [type, setType] = useState("Event");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    type: "Point",
    coordinates: [0, 0] // Default coordinates
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">("start");
  
  // State for existing event data (for display mode)
  const [existingEventData, setExistingEventData] = useState<any>(null);
  const [isDisplayMode, setIsDisplayMode] = useState(false);

  // Dynamic form data
  const [booths, setBooths] = useState<BoothData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);

  // UI state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"start" | "end">("start");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<"main" | "booth" | "event">("main");
  const [currentBoothIndex, setCurrentBoothIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  

  // Validation errors
  const [errors, setErrors] = useState({
    name: false,
    details: false,
    entryFee: false,
    // Remove date/time error fields since we're using fallback values
    address: false,
    uploadPhotos: false,
  });

  // Redux
  const dispatch = useDispatch();
  const createevent = useSelector((state: any) => state.auth.createevent);
  const createeventErr = useSelector((state: any) => state.auth.createeventErr);

  const types: BoothType[] = [
    { id: "1", name: "Club" },
    { id: "2", name: "Pub" },
    { id: "3", name: "Event" },
  ];

  // Convert categories to booth types format (use all categories)
  const boothTypes: BoothType[] = categories.map((category: any) => ({
    id: category._id,
    name: category.name
  }));

  // Convert categories to event types format (use all categories)
  const eventTypes: BoothType[] = categories.map((category: any) => ({
    id: category._id,
    name: category.name
  }));


  // Convert facilities from hook to local state with selection
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchFacilities();
  }, [fetchCategories, fetchFacilities]);

  // Handle address selection from GoogleAddressAutocomplete
  const handleAddressSelect = (selectedAddress: any) => {
    setAddress(selectedAddress.formatted_address);
    setCoordinates({
      type: "Point",
      coordinates: [selectedAddress.geometry.location.lat, selectedAddress.geometry.location.lng]
    });
    setShowAddressModal(false);
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: false }));
    }
  };

  // Check if we're in display mode (existing event data passed)
  useEffect(() => {
    const params = route?.params as any;
    console.log('Route params:', params);
    if (params?.eventData) {
      console.log('Existing event data received:', params.eventData);
      setExistingEventData(params.eventData);
      setIsDisplayMode(true);
      
      // Populate form with existing data
      const eventData = params.eventData;
      setType(eventData.type || "Event");
      setName(eventData.name || "");
      setDetails(eventData.details || "");
      setEntryFee(eventData.entryFee?.toString() || "");
      setStartTime(eventData.openingTime || "");
      setEndTime(eventData.closeTime || "");
      setStartDate(eventData.startDate ? new Date(eventData.startDate).toLocaleDateString('en-GB') : "");
      setEndDate(eventData.endDate ? new Date(eventData.endDate).toLocaleDateString('en-GB') : "");
      setAddress(eventData.address || "");
      
      if (eventData.coordinates) {
        setCoordinates(eventData.coordinates);
      }
      
      if (eventData.photos && eventData.photos.length > 0) {
        setUploadPhotos(eventData.photos);
      }
      
      // Handle facilities
      if (eventData.facilities && eventData.facilities.length > 0) {
        setFacilitiesList(prev => 
          prev.map(facility => ({
            ...facility,
            selected: eventData.facilities.some((f: any) => f._id === facility._id)
          }))
        );
      }
    }
  }, [route?.params]);

  // Debug logging
  useEffect(() => {
    console.log('Event type:', type, 'isDisplayMode:', isDisplayMode, 'existingEventData:', existingEventData, 'tickets:', existingEventData?.tickets);
  }, [type, isDisplayMode, existingEventData]);

  // Convert facilities from hook to local state with selection
  useEffect(() => {
    if (facilities && facilities.length > 0) {
      const facilitiesWithSelection = facilities.map((facility: any) => ({
        _id: facility._id,
        name: facility.name,
        selected: false
      }));
      setFacilitiesList(facilitiesWithSelection);
      console.log('Facilities loaded from hook:', facilitiesWithSelection);
    }
  }, [facilities]);

  // Validation function
  const validateForm = () => {
    console.log('=== VALIDATION DEBUG ===');
    console.log('Type:', type);
    console.log('Name:', name);
    console.log('Details:', details);
    console.log('Entry Fee:', entryFee);
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Address:', address);
    console.log('Upload Photos:', uploadPhotos);
    console.log('Booths:', booths);
    console.log('Events:', events);

    const newErrors = {
      name: !name.trim(),
      details: !details.trim(),
      entryFee: !entryFee.trim() || isNaN(Number(entryFee)),
      // Remove date/time validation since we're using fallback values
      address: !address.trim(),
      // Remove ticket validation - tickets are handled in dynamic forms
      uploadPhotos: (type === "Club" || type === "Pub") ? uploadPhotos.length === 0 : false, // Only require photos for Club/Pub
    };

    // Check if type is selected
    if (!type || (type !== "Club" && type !== "Pub" && type !== "Event")) {
      showToast("error", "Please select a type (Club, Pub, or Event)");
      return false;
    }

    // Check basic required fields
    const missingFields = [];
    if (!name.trim()) missingFields.push("Name");
    if (!details.trim()) missingFields.push("Details");
    if (!entryFee.trim() || isNaN(Number(entryFee))) missingFields.push("Entry Fee");
    if (!startTime.trim()) missingFields.push("Start Time");
    if (!endTime.trim()) missingFields.push("End Time");
    if (!startDate.trim()) missingFields.push("Start Date");
    if (!endDate.trim()) missingFields.push("End Date");
    if (!address.trim()) missingFields.push("Address");

    if (missingFields.length > 0) {
      showToast("error", `Please fill in: ${missingFields.join(", ")}`);
      setErrors(newErrors);
      return false;
    }

    // Validate booths if type is Club or Pub
    if (type === "Club" || type === "Pub") {
      if (booths.length === 0) {
        showToast("error", "Please add at least one booth");
        return false;
      }
      
      const boothErrors = booths.some(booth => 
        !booth.boothName.trim() || 
        !booth.boothType.trim() || 
        !booth.boothPrice.trim() || 
        isNaN(Number(booth.boothPrice)) ||
        !booth.capacity.trim() || 
        isNaN(Number(booth.capacity)) ||
        booth.boothImages.length === 0
      );
      if (boothErrors) {
        showToast("error", "Please fill all booth fields and add at least one image for each booth");
        return false;
      }
    }

    // Validate tickets if type is Event
    if (type === "Event") {
      if (events.length === 0) {
        showToast("error", "Please add at least one ticket");
        return false;
      }
      
      const eventErrors = events.some(event => 
        !event.eventName.trim() || 
        !event.eventType.trim() || 
        !event.eventPrice.trim() || 
        isNaN(Number(event.eventPrice)) ||
        !event.capacity.trim() || 
        isNaN(Number(event.capacity))
      );
      if (eventErrors) {
        showToast("error", "Please fill all ticket fields");
        return false;
      }
    }

    // Check main photos
    if (uploadPhotos.length === 0) {
      showToast("error", "Please upload at least one main photo");
      return false;
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Add new booth
  const addNewBooth = () => {
    const newBooth: BoothData = {
      id: Date.now().toString(),
      boothName: "",
      boothType: "",
      boothPrice: "",
      capacity: "",
      discountedPrice: "",
      boothImages: [],
    };
    setBooths([...booths, newBooth]);
  };

  // Add new event
  const addNewEvent = () => {
    const newEvent: EventData = {
      id: Date.now().toString(),
      eventName: "",
      eventType: "",
      eventPrice: "",
      capacity: "",
    };
    setEvents([...events, newEvent]);
  };

  // Update booth data
  const updateBooth = (id: string, field: keyof BoothData, value: string | string[]) => {
    setBooths(booths.map(booth => 
      booth.id === id ? { ...booth, [field]: value } : booth
    ));
  };

  // Update event data
  const updateEvent = (id: string, field: keyof EventData, value: string | string[]) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  // Remove booth
  const removeBooth = (id: string) => {
    setBooths(booths.filter(booth => booth.id !== id));
  };

  // Remove event
  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Image handling functions
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission to access photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = (type: 'camera' | 'gallery', imageType: "main" | "booth" | "event" = "main", boothIndex: number = 0, eventIndex: number = 0) => {
    setShowImagePicker(false);
    
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 0, // Allow multiple selection
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets.length > 0) {
        handleMultipleImageUpload(response.assets, imageType, boothIndex, eventIndex);
      }
    };

    if (type === 'camera') {
      requestCameraPermission().then(hasPermission => {
        if (hasPermission) {
          launchCamera(options, callback);
        } else {
          showToast('error', 'Camera permission denied');
        }
      });
    } else {
      requestStoragePermission().then(hasPermission => {
        if (hasPermission) {
          launchImageLibrary(options, callback);
        } else {
          showToast('error', 'Storage permission denied');
        }
      });
    }
  };

  const handleMultipleImageUpload = async (assets: any[], imageType: "main" | "booth" | "event", boothIndex: number = 0, eventIndex: number = 0) => {
    try {
      setLoading(true);
      
      console.log('handleMultipleImageUpload called with:', {
        imageType,
        boothIndex,
        eventIndex,
        assetsCount: assets.length
      });
      
      // Check current image count and limit to 3 total
      let currentImages: string[] = [];
      if (imageType === "main") {
        currentImages = uploadPhotos;
        console.log('Processing main photos, current count:', currentImages.length);
      } else if (imageType === "booth" && boothIndex >= 0 && booths[boothIndex]) {
        currentImages = booths[boothIndex].boothImages || [];
        console.log('Processing booth images, booth index:', boothIndex, 'current count:', currentImages.length);
      }
      
      const remainingSlots = 3 - currentImages.length;
      if (remainingSlots <= 0) {
        showToast('error', 'Maximum 3 images allowed');
        return;
      }
      
      // Limit the number of assets to upload based on remaining slots
      const assetsToUpload = assets.slice(0, remainingSlots);
      
      if (assetsToUpload.length < assets.length) {
        showToast('warning', `Only ${assetsToUpload.length} images will be uploaded (max 3 total)`);
      }
      
      const uploadPromises = assetsToUpload.map(async (asset, index) => {
        const fileName = `${imageType}_${Date.now()}_${index}.jpg`;
        return await uploadFileToS3(asset.uri, fileName, 'image/jpeg');
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (imageType === "main") {
        console.log('Adding to main photos:', uploadedUrls);
        setUploadPhotos([...uploadPhotos, ...uploadedUrls]);
      } else if (imageType === "booth" && boothIndex >= 0 && booths[boothIndex]) {
        console.log('Adding to booth images, booth index:', boothIndex, 'urls:', uploadedUrls);
        const updatedBooths = [...booths];
        updatedBooths[boothIndex].boothImages = [...updatedBooths[boothIndex].boothImages, ...uploadedUrls];
        setBooths(updatedBooths);
      }
      
      showToast('success', `${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.log('Image upload error:', error);
      showToast('error', 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setLoading(true);
      const fileName = `event_${Date.now()}.jpg`;
      const uploadedUrl = await uploadFileToS3(imageUri, fileName, 'image/jpeg');
      
      const newPhotos = [...uploadPhotos];
      if (currentImageIndex < newPhotos.length) {
        newPhotos[currentImageIndex] = uploadedUrl;
      } else {
        newPhotos.push(uploadedUrl);
      }
      setUploadPhotos(newPhotos);
      
      showToast('success', 'Image uploaded successfully');
    } catch (error) {
      console.log('Image upload error:', error);
      showToast('error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    console.log('handleTimeChange called:', { 
      event: event.type, 
      selectedTime, 
      timePickerMode,
      platform: Platform.OS 
    });
    
    // Always hide the picker first
    setShowTimePicker(false);
    
    // Handle the selection
    if (event.type === 'set' && selectedTime) {
      const timeString = selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      console.log('Time selected:', timeString, 'for mode:', timePickerMode);
      
      if (timePickerMode === "start") {
        setStartTime(timeString);
        console.log('Set startTime to:', timeString);
      } else {
        setEndTime(timeString);
        console.log('Set endTime to:', timeString);
      }
    } else if (event.type === 'dismissed') {
      // Handle case where user dismissed without selecting
      console.log('Time picker dismissed without selection');
    }
  };
  const showTimePickerModal = (mode: "start" | "end") => {
    console.log('showTimePickerModal called with mode:', mode);
    setTimePickerMode(mode);
    setShowTimePicker(true);
    console.log('Time picker should now be visible');
  };

  // Function to trigger date picker for calendar icons
  const triggerDatePicker = (dateType: "start" | "end") => {
    console.log('Calendar icon clicked for', dateType, 'date');
    setDatePickerMode(dateType);
    setShowDatePicker(true);
  };

  // Handle date picker change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      if (datePickerMode === "start") {
        setStartDate(formattedDate);
      } else {
        setEndDate(formattedDate);
      }
    }
  };
  const toggleFacility = (id: string) => {
    setFacilitiesList((prev) =>
      prev.map((facility) =>
        facility._id === id
          ? { ...facility, selected: !facility.selected }
          : facility
      )
    );
  };


  const handleSave = () => {
    if (!validateForm()) {
      showToast('error', 'Please fill in all required fields correctly');
      return;
    }

    // Get selected facilities
    const selectedFacilities = facilitiesList
      .filter(facility => facility.selected)
      .map(facility => facility._id);

    // Use dynamic coordinates from address selection

    // Format dates to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
      console.log('formatDate called with:', JSON.stringify(dateString));
      if (!dateString) {
        console.log('Empty date string, returning empty string');
        return '';
      }
      
      try {
        let date: Date;
        
        // Handle DD/MM/YYYY format from DatePickerInput
        if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          console.log('Parsing DD/MM/YYYY:', { day, month, year });
          
          // Validate the parts
          if (!day || !month || !year) {
            console.warn('Invalid date parts:', { day, month, year });
            return '';
          }
          
          // Create date with month-1 because Date constructor expects 0-based months
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          console.log('Created date object:', date);
        } else {
          // Handle other date formats
          console.log('Parsing other date format:', dateString);
          date = new Date(dateString);
        }
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date string:', dateString, 'Created date:', date);
          return '';
        }
        
        // Check if date is within reasonable bounds (not too far in past/future)
        const now = new Date();
        const year = date.getFullYear();
        const currentYear = now.getFullYear();
        
        if (year < 1900 || year > currentYear + 10) {
          console.warn('Date out of reasonable bounds:', dateString, 'Year:', year);
          return '';
        }
        
        const formattedDate = date.toISOString().split('T')[0];
        console.log('Formatted date result:', formattedDate);
        return formattedDate; // Returns YYYY-MM-DD
      } catch (error) {
        console.error('Error formatting date:', dateString, error);
        return '';
      }
    };

    // Format time to HH:MM format (24-hour)
    const formatTime = (timeString: string) => {
      console.log('formatTime called with:', JSON.stringify(timeString));
      if (!timeString) {
        console.log('Empty time string, returning empty string');
        return '';
      }
      
      try {
        // If time is in 12-hour format, convert to 24-hour
        if (timeString.includes('AM') || timeString.includes('PM')) {
          console.log('Parsing 12-hour format:', timeString);
          const [time, period] = timeString.split(' ');
          if (!time || !period) {
            console.warn('Invalid time format:', timeString);
            return '';
          }
          
          const [hours, minutes] = time.split(':');
          if (!hours || !minutes) {
            console.warn('Invalid time format:', timeString);
            return '';
          }
          
          let hour24 = parseInt(hours);
          const mins = parseInt(minutes);
          
          console.log('Parsed time parts:', { hours, minutes, period, hour24, mins });
          
          // Validate hour and minute ranges
          if (isNaN(hour24) || isNaN(mins) || hour24 < 1 || hour24 > 12 || mins < 0 || mins > 59) {
            console.warn('Invalid time values:', timeString);
            return '';
          }
          
          if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
          } else if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
          }
          
          const result = `${hour24.toString().padStart(2, '0')}:${minutes}`;
          console.log('Formatted time result:', result);
          return result;
        }
        
        // Validate 24-hour format
        console.log('Parsing 24-hour format:', timeString);
        const [hours, minutes] = timeString.split(':');
        if (!hours || !minutes) {
          console.warn('Invalid time format:', timeString);
          return '';
        }
        
        const hour24 = parseInt(hours);
        const mins = parseInt(minutes);
        
        if (isNaN(hour24) || isNaN(mins) || hour24 < 0 || hour24 > 23 || mins < 0 || mins > 59) {
          console.warn('Invalid time values:', timeString);
          return '';
        }
        
        console.log('Formatted time result (24-hour):', timeString);
        return timeString; // Already in 24-hour format
      } catch (error) {
        console.error('Error formatting time:', timeString, error);
        return '';
      }
    };

    // Add static fallback values for missing date/time fields
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Use static values if fields are empty
    const finalStartDate = formatDate(startDate) || getCurrentDate();
    const finalEndDate = formatDate(endDate) || getCurrentDate();
    const finalStartTime = formatTime(startTime) || "09:00";
    const finalEndTime = formatTime(endTime) || "18:00";

    console.log('Using fallback values:', {
      startDate: finalStartDate,
      endDate: finalEndDate,
      startTime: finalStartTime,
      endTime: finalEndTime
    });

    let eventData: any = {
      type: type,
      name: name,
      details: details,
      entryFee: Number(entryFee),
      openingTime: finalStartTime,
      closeTime: finalEndTime,
      startDate: finalStartDate,
      endDate: finalEndDate,
      address: address,
      coordinates: coordinates,
      photos: (type === "Club" || type === "Pub") ? uploadPhotos : [], // Only include photos for Club/Pub
      facilities: selectedFacilities,
    };

    // Add booth or ticket specific data
    if (type === "Club" || type === "Pub") {
      eventData.booths = booths.map(booth => ({
        boothName: booth.boothName,
        boothType: booth.boothType, // Use dynamic category ID
        boothPrice: Number(booth.boothPrice),
        capacity: Number(booth.capacity),
        discountedPrice: Number(booth.discountedPrice),
        boothImage: booth.boothImages
      }));
    } else if (type === "Event") {
      eventData.tickets = events.map(event => ({
        ticketType: event.eventType, // Use dynamic category ID
        ticketPrice: Number(event.eventPrice),
        capacity: Number(event.capacity)
      }));
    }

    console.log('=== DEBUGGING DATE/TIME VALUES ===');
    console.log('Raw state values:');
    console.log('- startTime:', JSON.stringify(startTime));
    console.log('- endTime:', JSON.stringify(endTime));
    console.log('- startDate:', JSON.stringify(startDate));
    console.log('- endDate:', JSON.stringify(endDate));
    
    console.log('Formatted values:');
    console.log('- startTime formatted:', formatTime(startTime));
    console.log('- endTime formatted:', formatTime(endTime));
    console.log('- startDate formatted:', formatDate(startDate));
    console.log('- endDate formatted:', formatDate(endDate));
    
    console.log('Formatted event data to be sent:', JSON.stringify(eventData, null, 2));
    
    // Note: Using fallback values for date/time, so no need to validate them
    
    dispatch(onCreateevent(eventData));
  };

  const handleBack = () => {
    navigation?.goBack();
  };



  // Handle API responses
  useEffect(() => {
    if (
      createevent?.status === true ||
      createevent?.status === 'true' ||
      createevent?.status === 1 ||
      createevent?.status === "1"
    ) {
      showToast('success', 'Event created successfully!');
      dispatch(createeventData(''));
      navigation?.goBack();
    }
    if (createeventErr) {
      showToast('error', createeventErr?.message || 'Failed to create event');
      dispatch(createeventError(''));
    }
  }, [createevent, createeventErr, dispatch, navigation]);

  // Debug time picker state changes
  useEffect(() => {
    console.log('Time picker state changed - showTimePicker:', showTimePicker, 'timePickerMode:', timePickerMode);
  }, [showTimePicker, timePickerMode]);

  // Update image upload handlers
  const handlePhotoUpload = (index: number) => {
    if (uploadPhotos.length >= 3 && !uploadPhotos[index]) {
      showToast('error', 'Maximum 3 images allowed');
      return;
    }
    console.log('handlePhotoUpload called for main photos, index:', index);
    setCurrentImageIndex(index);
    setCurrentImageType("main");
    // Reset booth and event indices for main photos
    setCurrentBoothIndex(-1);
    setCurrentEventIndex(-1);
    setShowImagePicker(true);
    console.log('Set currentImageType to main, boothIndex to -1, eventIndex to -1');
  };

  return (
    <View style={addClubEventDetailStyle.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={addClubEventDetailStyle.gradientContainer}
      >
        <SafeAreaView style={addClubEventDetailStyle.safeArea}>
          <View style={addClubEventDetailStyle.header}>
            <TouchableOpacity onPress={handleBack}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={addClubEventDetailStyle.headerTitle}>Add Details</Text>
            <View style={addClubEventDetailStyle.headerRight} />
          </View>

          <ScrollView
            style={addClubEventDetailStyle.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={addClubEventDetailStyle.scrollContent}
          >
            <CustomDropdown
              label="Type*"
              placeholder="Select type"
              options={types}
              selectedValue={type}
              onSelect={(value) => {
                setType(typeof value === 'string' ? value : value.name);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: false }));
                }
              }}
              error={!type || (type !== "Club" && type !== "Pub" && type !== "Event")}
              message={!type || (type !== "Club" && type !== "Pub" && type !== "Event") ? "Please select a type" : ""}
            />

            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Name"
                placeholder="Enter name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: false }));
                  }
                }}
                error={errors.name}
                message={errors.name ? "Name is required" : ""}
                leftImage=""
                kType="default"
              />
            </View>

            <DetailsInput
              label="Details"
              placeholder="Enter here"
              value={details}
              onChangeText={(text) => {
                setDetails(text);
                if (errors.details) {
                  setErrors(prev => ({ ...prev, details: false }));
                }
              }}
              error={errors.details}
              message={errors.details ? "Details are required" : ""}
              required={false}
            />
            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Entry Fee"
                placeholder="Enter fee"
                value={entryFee}
                onChangeText={(text) => {
                  setEntryFee(text);
                  if (errors.entryFee) {
                    setErrors(prev => ({ ...prev, entryFee: false }));
                  }
                }}
                error={errors.entryFee}
                message={errors.entryFee ? "Valid entry fee is required" : ""}
                leftImage=""
                kType="numeric"
              />
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <DatePickerInput
                label="Start Date"
                placeholder="Select date"
                value={startDate}
                onChangeText={(text) => {
                  console.log('Start date selected:', text);
                  setStartDate(text);
                }}
                error={false}
                message=""
                leftImage=""
                style={addClubEventDetailStyle.datePickerWrapper}
              />
              <TouchableOpacity 
                style={addClubEventDetailStyle.datePickerRightIcon}
                onPress={() => triggerDatePicker("start")}
              >
                <CalendarIcon />
              </TouchableOpacity>
            </View>
            <View style={addClubEventDetailStyle.formElement}>
              <DatePickerInput
                label="End Date"
                placeholder="Select date"
                value={endDate}
                onChangeText={(text) => {
                  console.log('End date selected:', text);
                  setEndDate(text);
                }}
                error={false}
                message=""
                leftImage=""
                style={addClubEventDetailStyle.datePickerWrapper}
              />
              <TouchableOpacity 
                style={addClubEventDetailStyle.datePickerRightIcon}
                onPress={() => triggerDatePicker("end")}
              >
                <CalendarIcon />
              </TouchableOpacity>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>Start Time</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.timeInputButton}
                onPress={() => {
                  showTimePickerModal("start");
                }}
              >
                <Text style={startTime ? addClubEventDetailStyle.timeInputText : addClubEventDetailStyle.timeInputPlaceholder}>
                  {startTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
              {/* Fallback text input for time */}
              {/* <CustomeTextInput
                placeholder="Or enter time manually (e.g., 8:30 AM)"
                value={startTime}
                onChangeText={(text) => {
                  console.log('Manual start time input:', text);
                  setStartTime(text);
                }}
                leftImage=""
                error={false}
                label=""
                message=""
                style={{ marginTop: 8 }}
              /> */}
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>End Time</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.timeInputButton}
                onPress={() => {
                  showTimePickerModal("end");
                }}
              >
                <Text style={endTime ? addClubEventDetailStyle.timeInputText : addClubEventDetailStyle.timeInputPlaceholder}>
                  {endTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
              {/* Fallback text input for time */}
              {/* <CustomeTextInput
                placeholder="Or enter time manually (e.g., 11:30 PM)"
                value={endTime}
                onChangeText={(text) => {
                  console.log('Manual end time input:', text);
                  setEndTime(text);
                }}
                leftImage=""
                error={false}
                label=""
                message=""
                style={{ marginTop: 8 }}
              /> */}
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>Address*</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.addressContainer}
                onPress={() => setShowAddressModal(true)}
              >
                <View style={addClubEventDetailStyle.addressInputContainer}>
                  <TextInput
                    style={[
                      addClubEventDetailStyle.addressInput,
                      errors.address && { borderColor: colors.red }
                    ]}
                    placeholder="Tap to select address"
                    placeholderTextColor={colors.textColor}
                    value={address}
                    editable={false}
                    multiline={true}
                  />
                  <View style={addClubEventDetailStyle.locationIconContainer}>
                    <LocationIcon width={20} height={20} color={colors.violate} />
                  </View>
                </View>
              </TouchableOpacity>
              
              {errors.address && (
                <Text style={addClubEventDetailStyle.errorText}>Address is required</Text>
              )}
            </View>

            {/* Dynamic Booth Forms for Club and Pub */}
            {(type === "Club" || type === "Pub") && (
              <>
                {booths.map((booth, index) => (
                  <BoothForm
                    key={booth.id}
                    booth={booth}
                    boothIndex={index}
                    onUpdate={updateBooth}
                    onRemove={removeBooth}
                    onImagePicker={handleImagePicker}
                    boothTypes={boothTypes}
                  />
                ))}
                <TouchableOpacity
                  style={addClubEventDetailStyle.addNewButton}
                  onPress={addNewBooth}
                >
                  <PlusIcon />
                  <Text style={addClubEventDetailStyle.addNewButtonText}>
                    Add New Booth
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Test button for ticket display */}
            {type === "Event" && (
              <TouchableOpacity
                style={[addClubEventDetailStyle.addNewButton, { backgroundColor: colors.green, marginBottom: 10 }]}
                onPress={() => {
                  // Test with sample ticket data
                  const testTickets = [{
                    _id: "test1",
                    ticketType: { _id: "cat1", name: "General" },
                    ticketPrice: 45,
                    capacity: 150,
                    soldTickets: 20
                  }, {
                    _id: "test2", 
                    ticketType: { _id: "cat2", name: "VIP" },
                    ticketPrice: 45,
                    capacity: 150,
                    soldTickets: 20
                  }];
                  setExistingEventData({ tickets: testTickets });
                  setIsDisplayMode(true);
                }}
              >
                <Text style={addClubEventDetailStyle.addNewButtonText}>Test Ticket Display</Text>
              </TouchableOpacity>
            )}

            {/* Dynamic Ticket Forms for Event */}
            {type === "Event" && (
              <>
                {/* Show ticket display if in display mode and has existing tickets */}
                {isDisplayMode && existingEventData?.tickets && existingEventData.tickets.length > 0 ? (
                  <TicketDisplay
                    tickets={existingEventData.tickets}
                    onTicketSelect={(ticket) => {
                      console.log('Ticket selected:', ticket);
                      // Handle ticket selection if needed
                    }}
                    showSelectButton={false} // Don't show select button in display mode
                  />
                ) : type === "Event" && events.length > 0 ? (
                  <TicketDisplay
                    tickets={events.map(event => ({
                      _id: event.id,
                      ticketType: {
                        _id: event.eventType,
                        name: eventTypes.find(t => t.id === event.eventType)?.name || event.eventType
                      },
                      ticketPrice: Number(event.eventPrice),
                      capacity: Number(event.capacity)
                    }))}
                    onTicketSelect={(ticket) => {
                      console.log('Ticket selected:', ticket);
                    }}
                    showSelectButton={true}
                  />
                ) : type === "Event" ? (
                  <View style={{ padding: 20, backgroundColor: colors.vilate20, borderRadius: 10, marginVertical: 10 }}>
                    <Text style={{ color: colors.white, fontSize: 16, textAlign: 'center' }}>
                      No tickets added yet. Use the "Add New Ticket" button below to add tickets.
                    </Text>
                  </View>
                ) : (
                  <>
                    {events.map((event, index) => (
                      <EventForm
                        key={event.id}
                        event={event}
                        eventIndex={index}
                        onUpdate={updateEvent}
                        onRemove={removeEvent}
                        onImagePicker={handleImagePicker}
                        eventTypes={eventTypes}
                      />
                    ))}
                    <TouchableOpacity
                    style={addClubEventDetailStyle.addNewButton}
                    onPress={addNewEvent}
                    >
                      <PlusIcon />
                    <Text style={addClubEventDetailStyle.addNewButtonText}>
                      Add New Ticket
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}




            {/* Upload Photos (only for Club/Pub types) */}
            {(type === "Club" || type === "Pub") && (
              <View style={addClubEventDetailStyle.formElement}>
                <Text style={addClubEventDetailStyle.sectionLabel}>
                  Upload Photos ({uploadPhotos.length}/3)
                </Text>
                <View style={addClubEventDetailStyle.uploadPhotosRow}>
                  {[0, 1, 2].map((index) => (
                    <TouchableOpacity
                      key={index}
                      style={addClubEventDetailStyle.imageUploadBox}
                      onPress={() => {
                        if (uploadPhotos.length < 3 || uploadPhotos[index]) {
                          handlePhotoUpload(index);
                        } else {
                          showToast('error', 'Maximum 3 images allowed');
                        }
                      }}
                    >
                      {uploadPhotos[index] ? (
                        <Image
                          source={{ uri: uploadPhotos[index] }}
                          style={addClubEventDetailStyle.uploadedImage}
                          resizeMode="cover"
                        />
                      ) : (
                      <GalleryIcon />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Facilities
              </Text>
              {facilitiesLoading ? (
                <Text style={addClubEventDetailStyle.loadingText}>Loading facilities...</Text>
              ) : (
              <View style={addClubEventDetailStyle.facilitiesGrid}>
                {facilitiesList.map((facility) => (
                  <TouchableOpacity
                      key={facility._id}
                    style={addClubEventDetailStyle.facilityCheckboxContainer}
                      onPress={() => toggleFacility(facility._id)}
                  >
                    <View
                      style={[
                        addClubEventDetailStyle.facilityCheckbox,
                        facility.selected &&
                          addClubEventDetailStyle.facilityCheckedBox,
                      ]}
                    >
                      {facility.selected && (
                        <Text style={addClubEventDetailStyle.facilityCheckmark}>
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text style={addClubEventDetailStyle.facilityCheckboxText}>
                      {facility.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              )}
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Buttons
                title={loading ? "Creating..." : "Save"}
                onPress={handleSave}
                style={addClubEventDetailStyle.saveButton}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
          textColor={colors.white}
          is24Hour={false}
          themeVariant="dark"
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === "start" ? 
            (startDate ? new Date(startDate.split('/').reverse().join('-')) : new Date()) : 
            (endDate ? new Date(endDate.split('/').reverse().join('-')) : new Date())
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          textColor={colors.white}
          themeVariant="dark"
        />
      )}

      <ImageSelectionBottomSheet
        visible={showImagePicker && currentImageType === "main"}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => {
          console.log('Main photos - Camera pressed');
          handleImagePicker('camera', 'main', -1, -1);
        }}
        onGalleryPress={() => {
          console.log('Main photos - Gallery pressed');
          handleImagePicker('gallery', 'main', -1, -1);
        }}
      />

      {/* Address Selection Modal */}
      <GoogleAddressAutocomplete
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={handleAddressSelect}
      />
    </View>
  );
};

export default AddClubDetailScreen;
