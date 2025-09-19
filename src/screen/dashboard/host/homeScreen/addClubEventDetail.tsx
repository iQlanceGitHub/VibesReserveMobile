import React, { useState, useEffect } from "react";
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
  discountedPrice: string;
  eventImages: string[];
}

interface AddClubDetailScreenProps {
  navigation?: any;
}

const AddClubDetailScreen: React.FC<AddClubDetailScreenProps> = ({
  navigation,
}) => {
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
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  
  // Address autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

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
    { id: "1", name: "Booth" },
    { id: "2", name: "Event" },
  ];

  const boothTypes: BoothType[] = [
    { id: "1", name: "VIP Booth" },
    { id: "2", name: "Standard Booth" },
    { id: "3", name: "Premium Booth" },
    { id: "4", name: "Luxury Booth" },
  ];

  const eventTypes: BoothType[] = [
    { id: "1", name: "Concert" },
    { id: "2", name: "Party" },
    { id: "3", name: "Conference" },
    { id: "4", name: "Workshop" },
  ];


  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);

  // Static facilities as fallback
  const staticFacilities: Facility[] = [
    { _id: "68b57d91bd9b79b25b03e55c", name: "Parking", selected: false },
    { _id: "68b57d91bd9b79b25b03e55c", name: "Wi-Fi", selected: false },
    { _id: "68b57d91bd9b79b25b03e55c", name: "Food Menu", selected: false },
    { _id: "68b57d91bd9b79b25b03e55c", name: "Live Music", selected: false },
    { _id: "68b57d91bd9b79b25b03e55c", name: "VIP Area", selected: false },
  ];

  // Fetch facilities from API
  const fetchFacilities = async () => {
    try {
      setFacilitiesLoading(true);
      console.log('Fetching facilities from API...');
      const response = await fetchGet('user/facility?page=1&limit=10');
      console.log('Facilities API response:', response);
      
      if (response?.status === 1 && response?.data && response.data.length > 0) {
        const facilities = response.data.map((facility: any) => ({
          _id: facility._id,
          name: facility.name,
          selected: false
        }));
        console.log('Processed facilities:', facilities);
        setFacilitiesList(facilities);
        showToast("success", `Loaded ${facilities.length} facilities`);
      } else {
        console.log('No facilities data received, using static facilities');
        setFacilitiesList(staticFacilities);
        showToast("info", "Using default facilities");
      }
    } catch (error) {
      console.log('Error fetching facilities, using static facilities:', error);
      setFacilitiesList(staticFacilities);
      showToast("info", "Using default facilities");
    } finally {
      setFacilitiesLoading(false);
    }
  };

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
      uploadPhotos: false, // We'll handle this separately based on type
    };

    // Check if type is selected
    if (!type || (type !== "Booth" && type !== "Event")) {
      showToast("error", "Please select a type (Booth or Event)");
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

    // Validate booths if type is Booth
    if (type === "Booth") {
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

    // Validate events if type is Event
    if (type === "Event") {
      if (events.length === 0) {
        showToast("error", "Please add at least one event");
        return false;
      }
      
      const eventErrors = events.some(event => 
        !event.eventName.trim() || 
        !event.eventType.trim() || 
        !event.eventPrice.trim() || 
        isNaN(Number(event.eventPrice)) ||
        !event.capacity.trim() || 
        isNaN(Number(event.capacity)) ||
        event.eventImages.length === 0
      );
      if (eventErrors) {
        showToast("error", "Please fill all event fields and add at least one image for each event");
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
      discountedPrice: "",
      eventImages: [],
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
      } else if (imageType === "event" && eventIndex >= 0 && events[eventIndex]) {
        currentImages = events[eventIndex].eventImages || [];
        console.log('Processing event images, event index:', eventIndex, 'current count:', currentImages.length);
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
      } else if (imageType === "event" && eventIndex >= 0 && events[eventIndex]) {
        console.log('Adding to event images, event index:', eventIndex, 'urls:', uploadedUrls);
        const updatedEvents = [...events];
        updatedEvents[eventIndex].eventImages = [...updatedEvents[eventIndex].eventImages, ...uploadedUrls];
        setEvents(updatedEvents);
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

    // Prepare coordinates (you might want to get this from location picker)
    const coordinates = {
      type: "Point",
      coordinates: [23.026071652494444, 72.50766386964187] // Default coordinates
    };

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
      photos: uploadPhotos,
      facilities: selectedFacilities,
    };

    // Add booth or event specific data
    if (type === "Booth") {
      eventData.booths = booths.map(booth => ({
        boothName: booth.boothName,
        boothType: '68b7dec9241ce469fe7e202b',
        boothPrice: Number(booth.boothPrice),
        capacity: Number(booth.capacity),
        discountedPrice: Number(booth.discountedPrice),
        boothImage: booth.boothImages
      }));
    } else if (type === "Event") {
      eventData.tickets = events.map(event => ({
        // ticketType: event.eventType,
        ticketType: '68b7def6241ce469fe7e2039',
        ticketPrice: Number(event.eventPrice),
        capacity: Number(event.capacity)
      }));
      eventData.eventImages = events.flatMap(event => event.eventImages);
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

  // Address search function
  const searchAddresses = async (query: string) => {
    if (!query.trim()) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&types=geocode`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        const suggestions = data.predictions.map((prediction: any, index: number) => ({
          id: prediction.place_id || String(index),
          description: prediction.description,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text,
        }));
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
    } catch (error) {
      console.log('Address search error:', error);
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    } finally {
      setAddressLoading(false);
    }
  };

  // Handle address selection
  const handleAddressSelect = (suggestion: any) => {
    setAddress(suggestion.description);
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: false }));
    }
  };

  // Close suggestions when clicking outside
  const closeAddressSuggestions = () => {
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  // Fetch facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);

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
    <TouchableWithoutFeedback onPress={closeAddressSuggestions}>
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
                setType(value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: false }));
                }
              }}
              error={!type || (type !== "Booth" && type !== "Event")}
              message={!type || (type !== "Booth" && type !== "Event") ? "Please select a type" : ""}
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
              <View style={addClubEventDetailStyle.datePickerRightIcon}>
                <CalendarIcon />
              </View>
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
              <View style={addClubEventDetailStyle.datePickerRightIcon}>
                <CalendarIcon />
              </View>
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
              <View style={addClubEventDetailStyle.addressContainer}>
                <TextInput
                  style={[
                    addClubEventDetailStyle.addressInput,
                    errors.address && { borderColor: colors.red }
                  ]}
                placeholder="Enter address"
                  placeholderTextColor={colors.textColor}
                value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    searchAddresses(text);
                    if (errors.address) {
                      setErrors(prev => ({ ...prev, address: false }));
                    }
                  }}
                  onFocus={() => {
                    if (address.trim()) {
                      searchAddresses(address);
                    }
                  }}
                multiline={true}
              />
                {addressLoading && (
                  <View style={addClubEventDetailStyle.addressLoading}>
                    <Text style={addClubEventDetailStyle.loadingText}>Searching...</Text>
            </View>
                )}
                </View>

              {/* Address Suggestions */}
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <View style={addClubEventDetailStyle.suggestionsContainer}>
                  {addressSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={addClubEventDetailStyle.suggestionItem}
                      onPress={() => handleAddressSelect(suggestion)}
                    >
                      <Text style={addClubEventDetailStyle.suggestionMainText}>
                        {suggestion.mainText}
                      </Text>
                      <Text style={addClubEventDetailStyle.suggestionSecondaryText}>
                        {suggestion.secondaryText}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {errors.address && (
                <Text style={addClubEventDetailStyle.errorText}>Address is required</Text>
              )}
                </View>

            {/* Dynamic Booth Forms */}
            {type === "Booth" && (
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
                    showImagePicker={showImagePicker}
                    setShowImagePicker={setShowImagePicker}
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

            {/* Dynamic Event Forms */}
            {type === "Event" && (
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
                    showImagePicker={showImagePicker}
                    setShowImagePicker={setShowImagePicker}
                  />
                ))}
                  <TouchableOpacity
                  style={addClubEventDetailStyle.addNewButton}
                  onPress={addNewEvent}
                  >
                    <PlusIcon />
                  <Text style={addClubEventDetailStyle.addNewButtonText}>
                    Add New Event
                    </Text>
                  </TouchableOpacity>
              </>
            )}




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

      <ImageSelectionBottomSheet
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => {
          // For main photos, use -1 indices; for booth/event, use actual indices
          const boothIndex = currentImageType === "main" ? -1 : currentBoothIndex;
          const eventIndex = currentImageType === "main" ? -1 : currentEventIndex;
          console.log('Camera pressed - currentImageType:', currentImageType, 'boothIndex:', boothIndex, 'eventIndex:', eventIndex);
          handleImagePicker('camera', currentImageType, boothIndex, eventIndex);
        }}
        onGalleryPress={() => {
          // For main photos, use -1 indices; for booth/event, use actual indices
          const boothIndex = currentImageType === "main" ? -1 : currentBoothIndex;
          const eventIndex = currentImageType === "main" ? -1 : currentEventIndex;
          console.log('Gallery pressed - currentImageType:', currentImageType, 'boothIndex:', boothIndex, 'eventIndex:', eventIndex);
          handleImagePicker('gallery', currentImageType, boothIndex, eventIndex);
        }}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default AddClubDetailScreen;
