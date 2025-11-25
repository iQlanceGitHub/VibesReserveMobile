import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Image,
  PermissionsAndroid,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CustomeTextInput,
  DatePickerInput,
} from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import { verticalScale, horizontalScale } from "../../../../utilis/appConstant";
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
import DeleteIconNew from "../../../../assets/svg/deleteIconNew";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  onCreateevent,
  createeventData,
  createeventError,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
import { uploadFileToS3 } from "../../../../utilis/s3Upload";
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from "react-native-image-picker";
import { fetchGet } from "../../../../redux/services";
import PermissionManager from "../../../../utilis/permissionUtils";
import BoothForm from "./components/BoothForm";
import EventForm from "./components/EventForm";
import { useCategory } from "../../../../hooks/useCategory";
import { useFacility } from "../../../../hooks/useFacility";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationIcon from "../../../../assets/svg/locationIcon";
import GoogleAddressAutocomplete from "../../../../components/GoogleAddressAutocomplete";
import CustomTimePicker from "../../../../components/CustomTimePicker";

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyANTuJKviWz3jnUFMiqr_1FgghfAAek0q8";

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
}

interface AddClubDetailScreenProps {
  navigation?: any;
}

const AddClubDetailScreen: React.FC<AddClubDetailScreenProps> = ({
  navigation,
}) => {
  const route = useRoute();
  // Hooks for dynamic data
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
  } = useCategory();

  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();
  const {
    facilities,
    isLoading: facilitiesLoading,
    error: facilitiesError,
    fetchFacilities,
  } = useFacility();

  // Form data
  const [type, setType] = useState("Event");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [address, setAddress] = useState("");
  const [floorLayout, setFloorLayout] = useState(""); // Store image URL for floor layout
  const [tableNumber, setTableNumber] = useState(""); // Table number for Table type
  const [minGuest, setMinGuest] = useState(""); // Minimum guests for Table type
  const [maxGuest, setMaxGuest] = useState(""); // Maximum guests for Table type
  const [coordinates, setCoordinates] = useState({
    type: "Point",
    coordinates: [0, 0], // Default coordinates
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
    "start"
  );

  // State for existing event data (for display mode)
  const [existingEventData, setExistingEventData] = useState<any>(null);
  const [isDisplayMode, setIsDisplayMode] = useState(false);

  // Dynamic form data
  const [booths, setBooths] = useState<BoothData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);

  // UI state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"start" | "end">(
    "start"
  );
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<
    "main" | "booth" | "event" | "floorLayout"
  >("main");
  const [currentBoothIndex, setCurrentBoothIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Optional sections state
  const [enableBooths, setEnableBooths] = useState(false);
  const [enableTickets, setEnableTickets] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: false,
    details: false,
    entryFee: false,
    eventCapacity: false,
    // Remove date/time error fields since we're using fallback values
    address: false,
    uploadPhotos: false,
    startDate: false,
    endDate: false,
    tableNumber: false,
    floorLayout: false,
    minGuest: false,
    maxGuest: false,
  });

  // Redux
  const dispatch = useDispatch();
  const createevent = useSelector((state: any) => state.auth.createevent);
  const createeventErr = useSelector((state: any) => state.auth.createeventErr);

  const types: BoothType[] = [
    { id: "1", name: "Club" },
    { id: "2", name: "Booth" },
    { id: "3", name: "Event" },
    { id: "4", name: "VIP Entry" },
    { id: "5", name: "Table" },
  ];

  // Convert categories to booth types format (use all categories)
  const boothTypes: BoothType[] = categories.map((category: any) => ({
    id: category._id,
    name: category.name,
  }));

  // Convert categories to event types format (use all categories)
  const eventTypes: BoothType[] = categories.map((category: any) => ({
    id: category._id,
    name: category.name,
  }));

  // Convert facilities from hook to local state with selection
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);

  // Fetch data on component mount
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

  // Handle address selection from GoogleAddressAutocomplete
  const handleAddressSelect = (selectedAddress: any) => {
    setAddress(selectedAddress.formatted_address);
    setCoordinates({
      type: "Point",
      coordinates: [
        selectedAddress.geometry.location.lat,
        selectedAddress.geometry.location.lng,
      ],
    });
    setShowAddressModal(false);
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: false }));
    }
  };

  // Check if we're in display mode (existing event data passed)
  useEffect(() => {
    const params = route?.params as any;
    console.log("Route params:", params);
    if (params?.eventData) {
      console.log("Existing event data received:", params.eventData);
      setExistingEventData(params.eventData);
      setIsDisplayMode(true);

      // Populate form with existing data
      const eventData = params.eventData;
      setType(eventData.type || "Event");
      setName(eventData.name || "");
      setDetails(eventData.details || "");
      setEntryFee(eventData.entryFee?.toString() || "");
      setEventCapacity(eventData.eventCapacity?.toString() || "");
      setStartTime(eventData.openingTime || "");
      setEndTime(eventData.closeTime || "");
      setStartDate(
        eventData.startDate
          ? new Date(eventData.startDate).toLocaleDateString("en-GB")
          : ""
      );
      setEndDate(
        eventData.endDate
          ? new Date(eventData.endDate).toLocaleDateString("en-GB")
          : ""
      );
      setAddress(eventData.address || "");

      // Load coordinates from existing data
      // Swap only if coordinates appear to be in [lng, lat] format
      if (eventData.coordinates && eventData.coordinates.coordinates) {
        const [firstCoord, secondCoord] = eventData.coordinates.coordinates;
        // Check if coordinates might be in [lng, lat] format
        // For India region: lng is typically 68-88, lat is 6-37
        // If first coord is in lng range and larger than second, likely [lng, lat]
        const looksLikeLngLat = firstCoord > 60 && firstCoord < 100 && secondCoord > 0 && secondCoord < 40 && firstCoord > secondCoord;
        setCoordinates({
          type: eventData.coordinates.type || "Point",
          coordinates: looksLikeLngLat ? [secondCoord, firstCoord] : [firstCoord, secondCoord], // Swap if needed to ensure [lat, lng]
        });
      } else if (eventData.coordinates) {
        setCoordinates(eventData.coordinates);
      }

      if (eventData.photos && eventData.photos.length > 0) {
        setUploadPhotos(eventData.photos);
      }

      // Handle facilities
      if (eventData.facilities && eventData.facilities.length > 0) {
        setFacilitiesList((prev) =>
          prev.map((facility) => ({
            ...facility,
            selected: eventData.facilities.some(
              (f: any) => f._id === facility._id
            ),
          }))
        );
      }
    }
  }, [route?.params]);

  // Debug logging
  useEffect(() => {
    console.log(
      "Event type:",
      type,
      "isDisplayMode:",
      isDisplayMode,
      "existingEventData:",
      existingEventData,
      "tickets:",
      existingEventData?.tickets
    );
  }, [type, isDisplayMode, existingEventData]);

  // Convert facilities from hook to local state with selection
  useEffect(() => {
    if (facilities && facilities.length > 0) {
      const facilitiesWithSelection = facilities.map((facility: any) => ({
        _id: facility._id,
        name: facility.name,
        selected: false,
      }));
      setFacilitiesList(facilitiesWithSelection);
      console.log("Facilities loaded from hook:", facilitiesWithSelection);
    }
  }, [facilities]);

  // Validation function
  const validateForm = () => {
    console.log("=== VALIDATION DEBUG ===");
    console.log("Type:", type);
    console.log("Name:", name);
    console.log("Details:", details);
    console.log("Entry Fee:", entryFee);
    console.log("Event Capacity:", eventCapacity);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Address:", address);
    console.log("Upload Photos:", uploadPhotos);
    console.log("Booths:", booths);
    console.log("Events:", events);

    const newErrors = {
      name: !name.trim(),
      details: (type === "Club" || type === "Event" || type === "Table") ? !details.trim() : false, // Required for Club/Event/Table, optional for Booth/VIP Entry
      entryFee: !entryFee.trim() || isNaN(Number(entryFee)),
      eventCapacity: type === "Table" ? false : ( // Not required for Table type
        !eventCapacity.trim() ||
        isNaN(Number(eventCapacity)) ||
        Number(eventCapacity) <= 0
      ),
      // Remove date/time validation since we're using fallback values
      address: !address.trim(),
      // Remove ticket validation - tickets are handled in dynamic forms
      uploadPhotos: uploadPhotos.length === 0, // Require photos for all types
      startDate: false, // Will be validated separately
      endDate: false, // Will be validated separately
      floorLayout: false, // Optional for Table type
      tableNumber: type === "Table" ? !tableNumber.trim() : false, // Required for Table type
      minGuest: type === "Table" ? (!minGuest.trim() || isNaN(Number(minGuest)) || Number(minGuest) <= 0) : false,
      maxGuest: type === "Table" ? (!maxGuest.trim() || isNaN(Number(maxGuest)) || Number(maxGuest) <= 0) : false,
    };

    // Check if type is selected
    if (
      !type ||
      (type !== "Club" &&
        type !== "Event" &&
        type !== "VIP Entry" &&
        type !== "Booth" &&
        type !== "Table")
    ) {
      showToast(
        "error",
        "Please select a type (Club, Booth, Event, VIP Entry, or Table)"
      );
      return false;
    }

    // Check basic required fields
    const missingFields = [];

    // Different validation based on type
    if (type === "Booth" || type === "VIP Entry") {
      if (!name.trim()) missingFields.push("Name");
      if (!entryFee.trim() || isNaN(Number(entryFee)))
        missingFields.push("Price");
      if (
        !eventCapacity.trim() ||
        isNaN(Number(eventCapacity)) ||
        Number(eventCapacity) <= 0
      )
        missingFields.push("Capacity");
      // Discount price is now optional - no validation required
    } else if (type === "Table") {
      if (!name.trim()) missingFields.push("Table Name");
      if (!details.trim()) missingFields.push("Details");
      if (!entryFee.trim() || isNaN(Number(entryFee)))
        missingFields.push("Table Fee");
      // REMOVED eventCapacity validation for Table type
      if (!minGuest.trim() || isNaN(Number(minGuest)) || Number(minGuest) <= 0)
        missingFields.push("Minimum Guests");
      if (!maxGuest.trim() || isNaN(Number(maxGuest)) || Number(maxGuest) <= 0)
        missingFields.push("Maximum Guests");
      // Validate minGuest <= maxGuest
      if (
        minGuest.trim() &&
        maxGuest.trim() &&
        !isNaN(Number(minGuest)) &&
        !isNaN(Number(maxGuest)) &&
        Number(minGuest) > Number(maxGuest)
      ) {
        showToast("error", "Minimum guests must be less than or equal to maximum guests");
        setErrors((prev) => ({ ...prev, minGuest: true, maxGuest: true }));
        return false;
      }
      // Floor Layout is optional for Table type
      // Table type doesn't require dates, times, or facilities
    } else {
      if (!name.trim()) missingFields.push("Name");
      if (!details.trim()) missingFields.push("Details"); // Required for Club/Event types
      if (!entryFee.trim() || isNaN(Number(entryFee)))
        missingFields.push("Entry Fee");
      if (
        !eventCapacity.trim() ||
        isNaN(Number(eventCapacity)) ||
        Number(eventCapacity) <= 0
      )
        missingFields.push("Event Capacity");
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
    if (
      type !== "Table" &&
      startDate.trim() &&
      endDate.trim() &&
      !validateDates(startDate, endDate)
    ) {
      showToast("error", "End date must be same or after start date");
      setErrors((prev) => ({ ...prev, endDate: true }));
      return false;
    }

    // Check for missing booths/tickets based on type and enabled state
    if (type === "Club") {
      if (enableBooths && booths.length === 0) missingFields.push("Booths");
    }
    if (type === "Event") {
      if (enableTickets && events.length === 0) missingFields.push("Tickets");
    }

    // Safety check: Remove "Details" from missing fields if type is Booth or VIP Entry
    if (type === "Booth" || type === "VIP Entry") {
      const filteredMissingFields = missingFields.filter(field => field !== "Details");
      if (filteredMissingFields.length !== missingFields.length) {
        console.log("=== REMOVED DETAILS FROM MISSING FIELDS ===");
        console.log("Original missing fields:", missingFields);
        console.log("Filtered missing fields:", filteredMissingFields);
        missingFields.length = 0;
        missingFields.push(...filteredMissingFields);
      }
    }

    if (missingFields.length > 0) {
      console.log("=== MISSING FIELDS DEBUG ===");
      console.log("Type:", type);
      console.log("Missing fields:", missingFields);
      console.log("Details field value:", details);
      console.log("Details error state:", newErrors.details);
      showToast("error", `Please fill in: ${missingFields.join(", ")}`);
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }

    // Validate booth fields if type is Club, booths are enabled, and booths exist
    if (type === "Club" && enableBooths) {
      // Check each booth individually for specific missing fields
      for (let i = 0; i < booths.length; i++) {
        const booth = booths[i];
        const boothNumber = i + 1;
        const missingBoothFields = [];

        if (!booth.boothName.trim()) missingBoothFields.push("Booth Name");
        if (!booth.boothType.trim()) missingBoothFields.push("Booth Type");
        if (!booth.boothPrice.trim() || isNaN(Number(booth.boothPrice)))
          missingBoothFields.push("Booth Price");
        if (!booth.capacity.trim() || isNaN(Number(booth.capacity)))
          missingBoothFields.push("Capacity");
        if (booth.boothImages.length === 0)
          missingBoothFields.push("Booth Images");

        if (missingBoothFields.length > 0) {
          showToast(
            "error",
            `Booth ${boothNumber}: Please fill in ${missingBoothFields.join(
              ", "
            )}`
          );
          return false;
        }
      }
    }

    // Validate ticket fields if type is Event, tickets are enabled, and tickets exist
    if (type === "Event" && enableTickets) {
      // Check each ticket individually for specific missing fields
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const ticketNumber = i + 1;
        const missingTicketFields = [];

        if (!event.ticketType.trim()) missingTicketFields.push("Ticket Type");
        if (!event.ticketPrice.trim() || isNaN(Number(event.ticketPrice)))
          missingTicketFields.push("Ticket Price");
        if (!event.capacity.trim() || isNaN(Number(event.capacity)))
          missingTicketFields.push("Capacity");

        if (missingTicketFields.length > 0) {
          showToast(
            "error",
            `Ticket ${ticketNumber}: Please fill in ${missingTicketFields.join(
              ", "
            )}`
          );
          return false;
        }
      }
    }

    // Photos are already validated in the main fields check above

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
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
      ticketType: "",
      ticketPrice: "",
      capacity: "",
    };
    setEvents([...events, newEvent]);
  };

  // Update booth data
  const updateBooth = (
    id: string,
    field: keyof BoothData,
    value: string | string[]
  ) => {
    setBooths(
      booths.map((booth) =>
        booth.id === id ? { ...booth, [field]: value } : booth
      )
    );
  };

  // Update event data
  const updateEvent = (
    id: string,
    field: keyof EventData,
    value: string | string[]
  ) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, [field]: value } : event
      )
    );
  };

  // Remove booth
  const removeBooth = (id: string) => {
    setBooths(booths.filter((booth) => booth.id !== id));
  };

  // Remove event
  const removeEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Image handling functions
  const requestCameraPermission = async () => {
    try {
      const result = await PermissionManager.requestCameraPermission();
      return result.granted;
    } catch (error) {
      console.log("Error requesting camera permission:", error);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    try {
      const result = await PermissionManager.requestStoragePermission();
      return result.granted;
    } catch (error) {
      console.log("Error requesting storage permission:", error);
      return false;
    }
  };

  const handleImagePicker = (
    type: "camera" | "gallery",
    imageType: "main" | "booth" | "event" | "floorLayout" = "main",
    boothIndex: number = 0,
    eventIndex: number = 0
  ) => {
    setShowImagePicker(false);

    // Calculate remaining slots to limit selection
    let currentImages: string[] = [];
    if (imageType === "main") {
      currentImages = uploadPhotos || [];
    } else if (
      imageType === "booth" &&
      boothIndex >= 0 &&
      boothIndex < booths.length
    ) {
      currentImages = booths[boothIndex]?.boothImages || [];
    } else if (imageType === "floorLayout") {
      // Floor layout is single image, so if it exists, no slots available
      if (floorLayout) {
        showToast("error", "Floor layout image already exists. Please delete it first.");
        return;
      }
      currentImages = []; // Single image for floor layout
    }

    const remainingSlots = imageType === "floorLayout" ? 1 : Math.max(0, 3 - currentImages.length);

    // Check if user can add more images
    if (remainingSlots <= 0) {
      showToast("error", "Maximum 3 images allowed");
      return;
    }

    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.7 as any, // Reduced quality to prevent memory issues
      maxWidth: 800, // Reduced size to prevent memory issues
      maxHeight: 800,
      selectionLimit: imageType === "floorLayout" ? 1 : (remainingSlots > 0 ? remainingSlots : 1), // Single image for floor layout, limit for others
      includeBase64: false, // Disable base64 to save memory
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        console.log("Image picker error:", response.errorMessage);
        showToast("error", "Failed to select images");
        return;
      }

      if (response.assets && response.assets.length > 0) {
        // Additional validation to prevent crashes
        const validAssets = response.assets.filter(
          (asset) =>
            asset.uri &&
            asset.uri.length > 0 &&
            asset.fileSize &&
            asset.fileSize < 10 * 1024 * 1024 // Max 10MB per image
        );

        if (validAssets.length === 0) {
          showToast("error", "No valid images selected");
          return;
        }

        if (validAssets.length < response.assets.length) {
          showToast(
            "warning",
            `${response.assets.length - validAssets.length
            } images were too large and skipped`
          );
        }

        if (imageType === "floorLayout") {
          // Handle single image upload for floor layout
          handleSingleImageUpload(validAssets[0], "floorLayout");
        } else {
          handleMultipleImageUpload(
            validAssets,
            imageType,
            boothIndex,
            eventIndex
          );
        }
      } else {
        showToast("error", "No images selected");
      }
    };

    if (type === "camera") {
      // Use the new permission flow with proper alerts
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
      // Use the new permission flow with proper alerts
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

  const handleSingleImageUpload = async (
    asset: any,
    imageType: "floorLayout"
  ) => {
    try {
      setLoading(true);
      
      if (!asset || !asset.uri) {
        showToast("error", "No image selected");
        return;
      }

      const fileName = `floorLayout_${Date.now()}.jpg`;
      const uploadedUrl = await uploadFileToS3(
        asset.uri,
        fileName,
        "image/jpeg"
      );

      if (uploadedUrl) {
        setFloorLayout(uploadedUrl);
        if (errors.floorLayout) {
          setErrors((prev) => ({ ...prev, floorLayout: false }));
        }
        showToast("success", "Floor layout image uploaded successfully");
      } else {
        showToast("error", "Failed to upload floor layout image");
      }
    } catch (error) {
      console.log("Floor layout image upload error:", error);
      showToast("error", "Failed to upload floor layout image");
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImageUpload = async (
    assets: any[],
    imageType: "main" | "booth" | "event",
    boothIndex: number = 0,
    eventIndex: number = 0
  ) => {
    try {
      setLoading(true);

      console.log("handleMultipleImageUpload called with:", {
        imageType,
        boothIndex,
        eventIndex,
        assetsCount: assets.length,
      });

      // Validate input parameters
      if (!assets || assets.length === 0) {
        showToast("error", "No images to upload");
        return;
      }

      // Check current image count and limit to 3 total
      let currentImages: string[] = [];
      if (imageType === "main") {
        currentImages = uploadPhotos || [];
        console.log(
          "Processing main photos, current count:",
          currentImages.length
        );
      } else if (
        imageType === "booth" &&
        boothIndex >= 0 &&
        boothIndex < booths.length
      ) {
        currentImages = booths[boothIndex]?.boothImages || [];
        console.log(
          "Processing booth images, booth index:",
          boothIndex,
          "current count:",
          currentImages.length
        );
      } else {
        showToast("error", "Invalid image type or booth index");
        return;
      }

      const remainingSlots = Math.max(0, 3 - currentImages.length);
      if (remainingSlots <= 0) {
        showToast("error", "Maximum 3 images allowed");
        return;
      }

      // Limit the number of assets to upload based on remaining slots
      const assetsToUpload = assets.slice(0, remainingSlots);

      if (assetsToUpload.length < assets.length) {
        showToast(
          "warning",
          `Only ${assetsToUpload.length} images will be uploaded (max 3 total)`
        );
      }

      // Upload images one by one to prevent memory issues
      const uploadedUrls: string[] = [];
      for (let i = 0; i < assetsToUpload.length; i++) {
        try {
          const asset = assetsToUpload[i];
          if (!asset.uri) {
            console.log("Skipping asset without URI:", i);
            continue;
          }

          const fileName = `${imageType}_${Date.now()}_${i}.jpg`;
          const uploadedUrl = await uploadFileToS3(
            asset.uri,
            fileName,
            "image/jpeg"
          );

          if (uploadedUrl) {
            uploadedUrls.push(uploadedUrl);
          }
        } catch (uploadError) {
          console.log(`Failed to upload image ${i}:`, uploadError);
          // Continue with other images even if one fails
        }
      }

      if (uploadedUrls.length === 0) {
        showToast("error", "Failed to upload any images");
        return;
      }

      // Update state with uploaded URLs
      if (imageType === "main") {
        console.log("Adding to main photos:", uploadedUrls);
        setUploadPhotos((prev) => [...(prev || []), ...uploadedUrls]);
      } else if (
        imageType === "booth" &&
        boothIndex >= 0 &&
        boothIndex < booths.length
      ) {
        console.log(
          "Adding to booth images, booth index:",
          boothIndex,
          "urls:",
          uploadedUrls
        );
        setBooths((prevBooths) => {
          const updatedBooths = [...prevBooths];
          if (updatedBooths[boothIndex]) {
            updatedBooths[boothIndex].boothImages = [
              ...(updatedBooths[boothIndex].boothImages || []),
              ...uploadedUrls,
            ];
          }
          return updatedBooths;
        });
      }

      showToast(
        "success",
        `${uploadedUrls.length} image(s) uploaded successfully`
      );
    } catch (error) {
      console.log("Image upload error:", error);
      showToast("error", "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setLoading(true);
      const fileName = `event_${Date.now()}.jpg`;
      const uploadedUrl = await uploadFileToS3(
        imageUri,
        fileName,
        "image/jpeg"
      );

      const newPhotos = [...uploadPhotos];
      if (currentImageIndex < newPhotos.length) {
        newPhotos[currentImageIndex] = uploadedUrl;
      } else {
        newPhotos.push(uploadedUrl);
      }
      setUploadPhotos(newPhotos);

      showToast("success", "Image uploaded successfully");
    } catch (error) {
      console.log("Image upload error:", error);
      showToast("error", "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    console.log("handleTimeChange called:", {
      event: event.type,
      selectedTime,
      timePickerMode,
      platform: Platform.OS,
      eventType: event.type,
      hasSelectedTime: !!selectedTime,
    });

    // Always update the selected time state when time changes
    if (selectedTime) {
      setSelectedTime(selectedTime);
      console.log("Updated selectedTime to:", selectedTime);
      console.log("Formatted time string:", formatTimeString(selectedTime));
    }

    // For Android, handle immediate selection and close picker
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedTime) {
        const timeString = formatTimeString(selectedTime);
        console.log("Time selected:", timeString, "for mode:", timePickerMode);

        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          if (timePickerMode === "start") {
            setStartTime(timeString);
            console.log("Set startTime to:", timeString);
          } else {
            setEndTime(timeString);
            console.log("Set endTime to:", timeString);
          }
        }, 100);

        setShowTimePicker(false);
      } else if (event.type === "dismissed") {
        console.log("Time picker dismissed without selection");
        setShowTimePicker(false);
      }
    }
    // For iOS, we just update the selectedTime state and let the Confirm button handle the final selection
  };

  const showTimePickerModal = (mode: "start" | "end") => {
    console.log("showTimePickerModal called with mode:", mode);
    setTimePickerMode(mode);

    // Set initial time based on current value or default
    let initialTime = new Date();

    // Set default times based on mode
    if (mode === "start") {
      // Default start time: 10:00 AM
      initialTime.setHours(10, 0, 0, 0);
    } else {
      // Default end time: 11:00 PM
      initialTime.setHours(23, 0, 0, 0);
    }

    // Try to parse existing time if available
    const currentTime = mode === "start" ? startTime : endTime;
    if (currentTime && currentTime.trim() !== "") {
      try {
        const [time, period] = currentTime.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        initialTime.setHours(hour24, parseInt(minutes), 0, 0);
        console.log("Parsed existing time:", initialTime);
      } catch (error) {
        console.log("Error parsing existing time, using default:", error);
        // Keep the default time set above
      }
    }

    setSelectedTime(initialTime);
    setShowTimePicker(true);
    console.log("Time picker should now be visible with time:", initialTime);
  };

  // Helper function to format time consistently
  const formatTimeString = (date: Date): string => {
    try {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.log("Error formatting time:", error);
      return "12:00 PM"; // Fallback
    }
  };

  // Helper function to validate dates
  const validateDates = (startDateStr: string, endDateStr: string) => {
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

  // Function to trigger date picker for calendar icons
  const triggerDatePicker = (dateType: "start" | "end") => {
    console.log("Calendar icon clicked for", dateType, "date");
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
        // Reset start time when start date changes
        setStartTime("");
        // Clear end date error when start date changes
        if (errors.endDate) {
          setErrors((prev) => ({ ...prev, endDate: false }));
        }
        // Validate dates if end date is already set
        if (endDate && !validateDates(formattedDate, endDate)) {
          setErrors((prev) => ({ ...prev, endDate: true }));
          showToast("error", "End date must be same or after start date");
        }
      } else {
        setEndDate(formattedDate);
        // Reset end time when end date changes
        setEndTime("");
        // Validate dates if start date is already set
        if (startDate && !validateDates(startDate, formattedDate)) {
          setErrors((prev) => ({ ...prev, endDate: true }));
          showToast("error", "End date must be same or after start date");
        } else {
          // Clear error if validation passes
          setErrors((prev) => ({ ...prev, endDate: false }));
        }
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
      showToast("error", "Please fill in all required fields correctly");
      return;
    }

    // Get selected facilities (not for Booth and VIP Entry types)
    const selectedFacilities =
      type !== "Booth" && type !== "VIP Entry"
        ? facilitiesList
          .filter((facility) => facility.selected)
          .map((facility) => facility._id)
        : [];

    // Use dynamic coordinates from address selection

    // Format dates to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
      console.log("formatDate called with:", JSON.stringify(dateString));
      if (!dateString) {
        console.log("Empty date string, returning empty string");
        return "";
      }

      try {
        let date: Date;

        // Handle DD/MM/YYYY format from DatePickerInput
        if (dateString.includes("/")) {
          const [day, month, year] = dateString.split("/");
          console.log("Parsing DD/MM/YYYY:", { day, month, year });

          // Validate the parts
          if (!day || !month || !year) {
            console.warn("Invalid date parts:", { day, month, year });
            return "";
          }

          // Create date with month-1 because Date constructor expects 0-based months
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          console.log("Created date object:", date);
        } else {
          // Handle other date formats
          console.log("Parsing other date format:", dateString);
          date = new Date(dateString);
        }

        // Check if the date is valid
        if (isNaN(date.getTime())) {
          console.warn(
            "Invalid date string:",
            dateString,
            "Created date:",
            date
          );
          return "";
        }

        // Check if date is within reasonable bounds (not too far in past/future)
        const now = new Date();
        const year = date.getFullYear();
        const currentYear = now.getFullYear();

        if (year < 1900 || year > currentYear + 10) {
          console.warn(
            "Date out of reasonable bounds:",
            dateString,
            "Year:",
            year
          );
          return "";
        }

        const formattedDate = date.toISOString().split("T")[0];
        console.log("Formatted date result:", formattedDate);
        return formattedDate; // Returns YYYY-MM-DD
      } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return "";
      }
    };

    // Format time to HH:MM format (24-hour)
    const formatTime = (timeString: string) => {
      console.log("formatTime called with:", JSON.stringify(timeString));
      if (!timeString) {
        console.log("Empty time string, returning empty string");
        return "";
      }

      try {
        // If time is in 12-hour format, convert to 24-hour
        if (timeString.includes("AM") || timeString.includes("PM")) {
          console.log("Parsing 12-hour format:", timeString);
          const [time, period] = timeString.split(" ");
          if (!time || !period) {
            console.warn("Invalid time format:", timeString);
            return "";
          }

          const [hours, minutes] = time.split(":");
          if (!hours || !minutes) {
            console.warn("Invalid time format:", timeString);
            return "";
          }

          let hour24 = parseInt(hours);
          const mins = parseInt(minutes);

          console.log("Parsed time parts:", {
            hours,
            minutes,
            period,
            hour24,
            mins,
          });

          // Validate hour and minute ranges
          if (
            isNaN(hour24) ||
            isNaN(mins) ||
            hour24 < 1 ||
            hour24 > 12 ||
            mins < 0 ||
            mins > 59
          ) {
            console.warn("Invalid time values:", timeString);
            return "";
          }

          if (period === "PM" && hour24 !== 12) {
            hour24 += 12;
          } else if (period === "AM" && hour24 === 12) {
            hour24 = 0;
          }

          const result = `${hour24.toString().padStart(2, "0")}:${minutes}`;
          console.log("Formatted time result:", result);
          return result;
        }

        // Validate 24-hour format
        console.log("Parsing 24-hour format:", timeString);
        const [hours, minutes] = timeString.split(":");
        if (!hours || !minutes) {
          console.warn("Invalid time format:", timeString);
          return "";
        }

        const hour24 = parseInt(hours);
        const mins = parseInt(minutes);

        if (
          isNaN(hour24) ||
          isNaN(mins) ||
          hour24 < 0 ||
          hour24 > 23 ||
          mins < 0 ||
          mins > 59
        ) {
          console.warn("Invalid time values:", timeString);
          return "";
        }

        console.log("Formatted time result (24-hour):", timeString);
        return timeString; // Already in 24-hour format
      } catch (error) {
        console.error("Error formatting time:", timeString, error);
        return "";
      }
    };

    // Add static fallback values for missing date/time fields
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Use static values if fields are empty (only for non-Table types)
    const finalStartDate = type !== "Table" ? (formatDate(startDate) || getCurrentDate()) : "";
    const finalEndDate = type !== "Table" ? (formatDate(endDate) || getCurrentDate()) : "";
    const finalStartTime = type !== "Table" ? (formatTime(startTime) || "09:00") : "";
    const finalEndTime = type !== "Table" ? (formatTime(endTime) || "18:00") : "";

    console.log("Using fallback values:", {
      startDate: finalStartDate,
      endDate: finalEndDate,
      startTime: finalStartTime,
      endTime: finalEndTime,
    });

    let eventData: any = {
      type: type,
      name: name,
      details: details,
      entryFee: Number(entryFee),
      eventCapacity: Number(eventCapacity),
      address: address,
      coordinates: coordinates,
      photos: uploadPhotos, // Include photos for all types
    };

    // Add date/time fields only for non-Table types
    if (type !== "Table") {
      eventData.openingTime = finalStartTime;
      eventData.closeTime = finalEndTime;
      eventData.startDate = finalStartDate;
      eventData.endDate = finalEndDate;
    }

    // Add ticket type and discount price for Booth and VIP Entry types
    if (type === "Booth" || type === "VIP Entry") {
      eventData.ticketType = ticketType;
      eventData.discountPrice = discountPrice;
    }

    // Add facilities only for Club and Event types (not Table)
    if (type === "Club" || type === "Event") {
      eventData.facilities = selectedFacilities;
    }

    // Add floorLayout, tableNumber, minGuest, and maxGuest for Table type
    if (type === "Table") {
      eventData.floorLayout = floorLayout;
      eventData.tableNumber = tableNumber;
      eventData.minGuest = Number(minGuest);
      eventData.maxGuest = Number(maxGuest);
    }

    // Add booth or ticket specific data only if sections are enabled
    if (type === "Club" && enableBooths) {
      eventData.booths = booths.map((booth) => ({
        boothName: booth.boothName,
        boothType: booth.boothType, // Use dynamic category ID
        boothPrice: Number(booth.boothPrice),
        capacity: Number(booth.capacity),
        discountedPrice: Number(booth.discountedPrice),
        boothImage: booth.boothImages,
      }));
    } else if (type === "Event") {
      // Always include tickets field - empty array if tickets disabled, populated if enabled
      eventData.tickets = enableTickets ? events.map((event) => ({
        ticketType: event.ticketType, // Pass as string ID
        ticketPrice: Number(event.ticketPrice),
        capacity: Number(event.capacity),
      })) : []; // Empty array when tickets are disabled
    }
    // Note: Booth and VIP Entry types only send basic payload without booth/ticket data

    console.log("=== DEBUGGING DATE/TIME VALUES ===");
    console.log("Raw state values:");
    console.log("- startTime:", JSON.stringify(startTime));
    console.log("- endTime:", JSON.stringify(endTime));
    console.log("- startDate:", JSON.stringify(startDate));
    console.log("- endDate:", JSON.stringify(endDate));

    console.log("Formatted values:");
    console.log("- startTime formatted:", formatTime(startTime));
    console.log("- endTime formatted:", formatTime(endTime));
    console.log("- startDate formatted:", formatDate(startDate));
    console.log("- endDate formatted:", formatDate(endDate));

    console.log(
      "Formatted event data to be sent:",
      JSON.stringify(eventData, null, 2)
    );
    console.log("Event type:", type);
    console.log("Includes openingTime:", eventData.openingTime !== undefined);
    console.log("Includes closeTime:", eventData.closeTime !== undefined);
    console.log("Includes startDate:", eventData.startDate !== undefined);
    console.log("Includes endDate:", eventData.endDate !== undefined);
    console.log("Includes facilities:", eventData.facilities !== undefined);
    console.log("Includes floorLayout:", eventData.floorLayout !== undefined);

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
      createevent?.status === "true" ||
      createevent?.status === 1 ||
      createevent?.status === "1"
    ) {
      showToast("success", "Event created successfully!");
      dispatch(createeventData(""));
      navigation?.goBack();
    }
    if (createeventErr) {
      showToast("error", createeventErr?.message || "Failed to create event");
      dispatch(createeventError(""));
    }
  }, [createevent, createeventErr, dispatch, navigation]);

  // Debug time picker state changes
  useEffect(() => {
    console.log(
      "Time picker state changed - showTimePicker:",
      showTimePicker,
      "timePickerMode:",
      timePickerMode
    );
  }, [showTimePicker, timePickerMode]);

  // Reset times when dates change
  useEffect(() => {
    // This effect will run when startDate or endDate changes
    // The actual reset is handled in handleDateChange function
    console.log("Date changed - startDate:", startDate, "endDate:", endDate);
  }, [startDate, endDate]);

  // Update image upload handlers
  const handlePhotoUpload = (index: number) => {
    if (uploadPhotos.length >= 3 && !uploadPhotos[index]) {
      showToast("error", "Maximum 3 images allowed");
      return;
    }
    console.log("handlePhotoUpload called for main photos, index:", index);
    setCurrentImageIndex(index);
    setCurrentImageType("main");
    // Reset booth and event indices for main photos
    setCurrentBoothIndex(-1);
    setCurrentEventIndex(-1);
    setShowImagePicker(true);
    console.log(
      "Set currentImageType to main, boothIndex to -1, eventIndex to -1"
    );
  };

  const handleDeleteImage = (
    index: number,
    imageType: "main" | "booth" | "event",
    boothIndex?: number
  ) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (imageType === "main") {
            const newPhotos = [...uploadPhotos];
            newPhotos.splice(index, 1);
            setUploadPhotos(newPhotos);
          } else if (imageType === "booth" && boothIndex !== undefined) {
            setBooths((prevBooths) => {
              const updatedBooths = [...prevBooths];
              if (updatedBooths[boothIndex]) {
                const newBoothImages = [
                  ...updatedBooths[boothIndex].boothImages,
                ];
                newBoothImages.splice(index, 1);
                updatedBooths[boothIndex].boothImages = newBoothImages;
              }
              return updatedBooths;
            });
          }
          showToast("success", "Image deleted successfully");
        },
      },
    ]);
  };

  return (
    <View
      style={[addClubEventDetailStyle.container, { paddingTop: insets.top }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={addClubEventDetailStyle.gradientContainer}
      >
        <View style={addClubEventDetailStyle.safeArea}>
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
            contentContainerStyle={[
              addClubEventDetailStyle.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <CustomDropdown
              label="Type*"
              placeholder="Select type"
              options={types}
              selectedValue={type}
              onSelect={(value) => {
                setType(typeof value === "string" ? value : value.name);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: false }));
                }
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
                <View style={addClubEventDetailStyle.formElement}>
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
                <View style={addClubEventDetailStyle.formElement}>
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
                    message={
                      errors.entryFee ? "Valid entry fee is required" : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Event Capacity*"
                    placeholder="Enter capacity"
                    value={eventCapacity}
                    onChangeText={(text) => {
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({
                          ...prev,
                          eventCapacity: false,
                        }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={
                      errors.eventCapacity
                        ? "Valid event capacity is required"
                        : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>
              </>
            )}

            {/* Show name field for Booth and VIP Entry types */}
            {(type === "Booth" || type === "VIP Entry") && (
              <View style={addClubEventDetailStyle.formElement}>
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
                <View style={addClubEventDetailStyle.formElement}>
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

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Table Number*"
                    placeholder="Enter table number"
                    value={tableNumber}
                    onChangeText={(text) => {
                      setTableNumber(text);
                      if (errors.tableNumber) {
                        setErrors((prev) => ({ ...prev, tableNumber: false }));
                      }
                    }}
                    error={errors.tableNumber}
                    message={errors.tableNumber ? "Table number is required" : ""}
                    leftImage=""
                    kType="numeric"
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

                <View style={addClubEventDetailStyle.formElement}>
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
                    message={
                      errors.entryFee ? "Valid table fee is required" : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>
                {(type !== "Table") && (
                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Seating Capacity*"
                    placeholder="Enter seating capacity"
                    value={eventCapacity}
                    onChangeText={(text) => {
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({
                          ...prev,
                          eventCapacity: false,
                        }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={
                      errors.eventCapacity
                        ? "Valid seating capacity is required"
                        : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>
                )}

                {/* <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Minimum Guests*"
                    placeholder="Enter minimum guests"
                    value={minGuest}
                    onChangeText={(text) => {
                      setMinGuest(text);
                      if (errors.minGuest) {
                        setErrors((prev) => ({
                          ...prev,
                          minGuest: false,
                        }));
                      }
                      // Validate minGuest <= maxGuest if maxGuest is set
                      if (maxGuest.trim() && !isNaN(Number(text)) && !isNaN(Number(maxGuest)) && Number(text) > Number(maxGuest)) {
                        setErrors((prev) => ({
                          ...prev,
                          minGuest: true,
                          maxGuest: true,
                        }));
                      }
                    }}
                    error={errors.minGuest}
                    message={
                      errors.minGuest
                        ? "Valid minimum guests is required"
                        : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Maximum Guests*"
                    placeholder="Enter maximum guests"
                    value={maxGuest}
                    onChangeText={(text) => {
                      setMaxGuest(text);
                      if (errors.maxGuest) {
                        setErrors((prev) => ({
                          ...prev,
                          maxGuest: false,
                        }));
                      }
                      // Validate minGuest <= maxGuest if minGuest is set
                      if (minGuest.trim() && !isNaN(Number(text)) && !isNaN(Number(minGuest)) && Number(minGuest) > Number(text)) {
                        setErrors((prev) => ({
                          ...prev,
                          minGuest: true,
                          maxGuest: true,
                        }));
                      }
                    }}
                    error={errors.maxGuest}
                    message={
                      errors.maxGuest
                        ? "Valid maximum guests is required"
                        : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View> */}

<View style={addClubEventDetailStyle.formElement}>
  <CustomeTextInput
    label="Minimum Guests*"
    placeholder="Enter minimum guests"
    value={minGuest}
    onChangeText={(text) => {
      setMinGuest(text);
      
      // Clear both errors initially
      const updatedErrors = {
        ...errors,
        minGuest: false,
        maxGuest: false
      };
      
      // Check if minimum guests is valid (not blank, is number, > 0)
      const isMinValid = text.trim() && !isNaN(Number(text)) && Number(text) > 0;
      
      // Check if maximum guests is valid
      const isMaxValid = maxGuest.trim() && !isNaN(Number(maxGuest)) && Number(maxGuest) > 0;
      
      if (!isMinValid) {
        updatedErrors.minGuest = true;
      }
      
      // Check relationship only if both fields are valid
      if (isMinValid && isMaxValid) {
        if (Number(text) > Number(maxGuest)) {
          updatedErrors.minGuest = true;
          updatedErrors.maxGuest = true;
        }
      }
      
      setErrors(updatedErrors);
    }}
    error={errors.minGuest}
    message={
      errors.minGuest
        ? !minGuest.trim() || isNaN(Number(minGuest)) || Number(minGuest) <= 0
          ? "Valid minimum guests is required"
          : "Minimum guests must be less than or equal to maximum guests"
        : ""
    }
    leftImage=""
    kType="numeric"
  />
</View>

<View style={addClubEventDetailStyle.formElement}>
  <CustomeTextInput
    label="Maximum Guests*"
    placeholder="Enter maximum guests"
    value={maxGuest}
    onChangeText={(text) => {
      setMaxGuest(text);
      
      // Clear both errors initially
      const updatedErrors = {
        ...errors,
        minGuest: false,
        maxGuest: false
      };
      
      // Check if maximum guests is valid (not blank, is number, > 0)
      const isMaxValid = text.trim() && !isNaN(Number(text)) && Number(text) > 0;
      
      // Check if minimum guests is valid
      const isMinValid = minGuest.trim() && !isNaN(Number(minGuest)) && Number(minGuest) > 0;
      
      if (!isMaxValid) {
        updatedErrors.maxGuest = true;
      }
      
      // Check relationship only if both fields are valid
      if (isMinValid && isMaxValid) {
        if (Number(minGuest) > Number(text)) {
          updatedErrors.minGuest = true;
          updatedErrors.maxGuest = true;
        }
      }
      
      setErrors(updatedErrors);
    }}
    error={errors.maxGuest}
    message={
      errors.maxGuest
        ? !maxGuest.trim() || isNaN(Number(maxGuest)) || Number(maxGuest) <= 0
          ? "Valid maximum guests is required"
          : "Maximum guests must be greater than or equal to minimum guests"
        : ""
    }
    leftImage=""
    kType="numeric"
  />
</View>

                <View style={addClubEventDetailStyle.formElement}>
                  <Text style={addClubEventDetailStyle.sectionLabel}>
                    Floor Layout (Optional)
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={addClubEventDetailStyle.floorLayoutImageBox}
                      onPress={() => {
                        if (floorLayout) {
                          showToast("error", "Floor layout image already exists. Please delete it first.");
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
                          style={addClubEventDetailStyle.floorLayoutImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <GalleryIcon />
                      )}
                    </TouchableOpacity>
                    {floorLayout && (
                      <TouchableOpacity
                        style={[addClubEventDetailStyle.deleteButton, { top: verticalScale(5), right: horizontalScale(5) }]}
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
                    <Text style={addClubEventDetailStyle.errorText}>
                      Floor layout image is required
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* Date and Time fields - not shown for Table type */}
            {type !== "Table" && (
              <>
                <View style={addClubEventDetailStyle.formElement}>
                  <DatePickerInput
                    label="Start Date *"
                    placeholder="Select date"
                    value={startDate}
                    onChangeText={(text) => {
                      console.log("Start date selected:", text);
                      setStartDate(text);
                      // Clear errors when user types
                      if (errors.startDate) {
                        setErrors((prev) => ({ ...prev, startDate: false }));
                      }
                      // Validate dates if end date is set
                      if (endDate && !validateDates(text, endDate)) {
                        setErrors((prev) => ({ ...prev, endDate: true }));
                        showToast(
                          "error",
                          "End date must be same or after start date"
                        );
                      }
                    }}
                    error={errors.startDate}
                    message={errors.startDate ? "Start date is required" : ""}
                    leftImage=""
                    style={addClubEventDetailStyle.datePickerWrapper}
                    allowFutureDates={true}
                    minDate={new Date()}
                    maxDate={new Date(2035, 11, 31)}
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
                    label="End Date *"
                    placeholder="Select date"
                    value={endDate}
                    onChangeText={(text) => {
                      console.log("End date selected:", text);
                      setEndDate(text);
                      // Clear errors when user types
                      if (errors.endDate) {
                        setErrors((prev) => ({ ...prev, endDate: false }));
                      }
                      // Validate dates if start date is set
                      if (startDate && !validateDates(startDate, text)) {
                        setErrors((prev) => ({ ...prev, endDate: true }));
                        showToast(
                          "error",
                          "End date must be same or after start date"
                        );
                      }
                    }}
                    error={errors.endDate}
                    message={
                      errors.endDate
                        ? "End date must be same or after start date"
                        : ""
                    }
                    leftImage=""
                    style={addClubEventDetailStyle.datePickerWrapper}
                    allowFutureDates={true}
                    minDate={
                      startDate
                        ? (() => {
                          try {
                            const [day, month, year] = startDate.split("/");
                            return new Date(
                              parseInt(year),
                              parseInt(month) - 1,
                              parseInt(day)
                            );
                          } catch (error) {
                            return new Date();
                          }
                        })()
                        : new Date()
                    }
                    maxDate={new Date(2035, 11, 31)}
                  />
                  <TouchableOpacity
                    style={addClubEventDetailStyle.datePickerRightIcon}
                    onPress={() => triggerDatePicker("end")}
                  >
                    <CalendarIcon />
                  </TouchableOpacity>
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <Text style={addClubEventDetailStyle.label}>Start Time*</Text>
                  <TouchableOpacity
                    style={addClubEventDetailStyle.timeInputButton}
                    onPress={() => {
                      showTimePickerModal("start");
                    }}
                  >
                    <Text
                      style={
                        startTime
                          ? addClubEventDetailStyle.timeInputText
                          : addClubEventDetailStyle.timeInputPlaceholder
                      }
                    >
                      {startTime || "Select time"}
                    </Text>
                    <TimeIcon />
                  </TouchableOpacity>
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <Text style={addClubEventDetailStyle.label}>End Time*</Text>
                  <TouchableOpacity
                    style={addClubEventDetailStyle.timeInputButton}
                    onPress={() => {
                      showTimePickerModal("end");
                    }}
                  >
                    <Text
                      style={
                        endTime
                          ? addClubEventDetailStyle.timeInputText
                          : addClubEventDetailStyle.timeInputPlaceholder
                      }
                    >
                      {endTime || "Select time"}
                    </Text>
                    <TimeIcon />
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>Address*</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.addressContainer}
                onPress={() => setShowAddressModal(true)}
                activeOpacity={0.7}
              >
                <View style={addClubEventDetailStyle.addressInputContainer}>
                  <TextInput
                    style={[
                      addClubEventDetailStyle.addressInput,
                      errors.address && { borderColor: colors.red },
                    ]}
                    placeholder="Tap to select address"
                    placeholderTextColor={colors.textColor}
                    value={address}
                    editable={false}
                    multiline={true}
                    pointerEvents="none"
                  />
                  <View style={addClubEventDetailStyle.locationIconContainer}>
                    <LocationIcon
                      width={20}
                      height={20}
                      color={colors.violate}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {errors.address && (
                <Text style={addClubEventDetailStyle.errorText}>
                  Address is required
                </Text>
              )}
            </View>

            {/* Booth-specific fields for Booth and VIP Entry types */}
            {(type === "Booth" || type === "VIP Entry") && (
              <>
                <View style={addClubEventDetailStyle.formElement}>
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

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Capacity*"
                    placeholder="Enter capacity"
                    value={eventCapacity}
                    onChangeText={(text) => { 
                      setEventCapacity(text);
                      if (errors.eventCapacity) {
                        setErrors((prev) => ({
                          ...prev,
                          eventCapacity: false,
                        }));
                      }
                    }}
                    error={errors.eventCapacity}
                    message={
                      errors.eventCapacity ? "Valid capacity is required" : ""
                    }
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <Text style={addClubEventDetailStyle.sectionLabel}>Ticket Type*</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ maxHeight: 50 }}
                    contentContainerStyle={{ paddingRight: 16 }}
                  >
                    {eventTypes.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          addClubEventDetailStyle.categoryButton,
                          ticketType === category.id && addClubEventDetailStyle.categoryButtonSelected
                        ]}
                        onPress={() => setTicketType(category.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          addClubEventDetailStyle.categoryButtonText,
                          ticketType === category.id && addClubEventDetailStyle.categoryButtonTextSelected
                        ]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Details (Optional)"
                    placeholder="Enter details"
                    value={details}
                    onChangeText={(text) => {
                      setDetails(text);
                      if (errors.details) {
                        setErrors((prev) => ({ ...prev, details: false }));
                      }
                    }}
                    error={false}
                    message=""
                    leftImage=""
                    kType="default"
                  />
                </View> */}

                {/* <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Discount Price (Optional)"
                    placeholder="Enter discount price"
                    value={discountPrice}
                    onChangeText={(text) => {
                      setDiscountPrice(text);
                    }}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View> */}
              </>
            )}

            {/* Dynamic Booth Forms for Club only */}
            {type === "Club" && (
              <>
                <View style={addClubEventDetailStyle.formElement}>
                  <View style={addClubEventDetailStyle.toggleContainer}>
                    <Text style={addClubEventDetailStyle.toggleLabel}>
                      Enable Booths (Optional)
                    </Text>
                    <TouchableOpacity
                      style={[
                        addClubEventDetailStyle.toggleButton,
                        enableBooths &&
                        addClubEventDetailStyle.toggleButtonActive,
                      ]}
                      onPress={() => {
                        setEnableBooths(!enableBooths);
                        // Clear booths when disabling
                        if (enableBooths) {
                          setBooths([]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          addClubEventDetailStyle.toggleButtonText,
                          enableBooths &&
                          addClubEventDetailStyle.toggleButtonTextActive,
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
                        onDeleteImage={(boothIndex, imageIndex) =>
                          handleDeleteImage(imageIndex, "booth", boothIndex)
                        }
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
              </>
            )}

            {/* Dynamic Ticket Forms for Event */}
            {type === "Event" && (
              <>
                <View style={addClubEventDetailStyle.formElement}>
                  <View style={addClubEventDetailStyle.toggleContainer}>
                    <Text style={addClubEventDetailStyle.toggleLabel}>
                      Enable Tickets (Optional)
                    </Text>
                    <TouchableOpacity
                      style={[
                        addClubEventDetailStyle.toggleButton,
                        enableTickets &&
                        addClubEventDetailStyle.toggleButtonActive,
                      ]}
                      onPress={() => {
                        setEnableTickets(!enableTickets);
                        // Clear events when disabling
                        if (enableTickets) {
                          setEvents([]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          addClubEventDetailStyle.toggleButtonText,
                          enableTickets &&
                          addClubEventDetailStyle.toggleButtonTextActive,
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
                      <EventForm
                        key={event.id}
                        event={event}
                        eventIndex={index}
                        onUpdate={updateEvent}
                        onRemove={removeEvent}
                        onImagePicker={handleImagePicker}
                        ticketTypes={eventTypes}
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

            {/* Upload Photos */}
            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Upload Photos ({uploadPhotos.length}/3)*
              </Text>
              <View style={addClubEventDetailStyle.uploadPhotosRow}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={addClubEventDetailStyle.imageContainer}
                  >
                    <TouchableOpacity
                      style={addClubEventDetailStyle.imageUploadBox}
                      onPress={() => {
                        if (uploadPhotos.length < 3 || uploadPhotos[index]) {
                          handlePhotoUpload(index);
                        } else {
                          showToast("error", "Maximum 3 images allowed");
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
                    {uploadPhotos[index] && (
                      <TouchableOpacity
                        style={addClubEventDetailStyle.deleteButton}
                        onPress={() => handleDeleteImage(index, "main")}
                      >
                        <DeleteIconNew width={20} height={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Facilities section - not shown for Booth, VIP Entry, and Table types */}
            {type !== "Booth" && type !== "VIP Entry" && type !== "Table" && (
              <View style={addClubEventDetailStyle.formElement}>
                <Text style={addClubEventDetailStyle.sectionLabel}>
                  Facilities*
                </Text>
                {facilitiesLoading ? (
                  <Text style={addClubEventDetailStyle.loadingText}>
                    Loading facilities...
                  </Text>
                ) : (
                  <View style={addClubEventDetailStyle.facilitiesGrid}>
                    {facilitiesList.map((facility) => (
                      <TouchableOpacity
                        key={facility._id}
                        style={
                          addClubEventDetailStyle.facilityCheckboxContainer
                        }
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
                            <Text
                              style={addClubEventDetailStyle.facilityCheckmark}
                            >
                              ✓
                            </Text>
                          )}
                        </View>
                        <Text
                          style={addClubEventDetailStyle.facilityCheckboxText}
                        >
                          {facility.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={addClubEventDetailStyle.formElement}>
              <Buttons
                title={loading ? "Creating..." : "Save"}
                onPress={handleSave}
                style={addClubEventDetailStyle.saveButton}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </View>
      </LinearGradient>

      {/* iOS Custom Modal Time Picker */}
      {showTimePicker && Platform.OS === "ios" && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={addClubEventDetailStyle.timePickerModal}>
            <View style={addClubEventDetailStyle.timePickerContainer}>
              <View style={addClubEventDetailStyle.timePickerHeader}>
                <Text style={addClubEventDetailStyle.timePickerTitle}>
                  Select {timePickerMode === "start" ? "Opening" : "Closing"}{" "}
                  Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={addClubEventDetailStyle.timePickerCloseButton}
                >
                  <Text style={addClubEventDetailStyle.timePickerCloseText}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Display current selected time */}
              <View style={addClubEventDetailStyle.timeDisplayContainer}>
                <Text style={addClubEventDetailStyle.timeDisplayText}>
                  {formatTimeString(selectedTime)}
                </Text>
              </View>

              <CustomTimePicker
                initialTime={selectedTime}
                onTimeChange={setSelectedTime}
                mode={timePickerMode}
              />

              <View style={addClubEventDetailStyle.timePickerButtons}>
                <TouchableOpacity
                  style={addClubEventDetailStyle.timePickerCancelButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={addClubEventDetailStyle.timePickerCancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={addClubEventDetailStyle.timePickerConfirmButton}
                  onPress={() => {
                    console.log(
                      "Confirm button pressed, selectedTime:",
                      selectedTime
                    );
                    const timeString = formatTimeString(selectedTime);
                    console.log("Time string generated:", timeString);

                    // Use setTimeout to ensure state updates are processed
                    setTimeout(() => {
                      if (timePickerMode === "start") {
                        setStartTime(timeString);
                        console.log("Set startTime to:", timeString);
                      } else {
                        setEndTime(timeString);
                        console.log("Set endTime to:", timeString);
                      }
                    }, 100);

                    setShowTimePicker(false);
                  }}
                >
                  <Text style={addClubEventDetailStyle.timePickerConfirmText}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Custom Time Picker */}
      {showTimePicker && Platform.OS === "android" && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={addClubEventDetailStyle.timePickerModal}>
            <View style={addClubEventDetailStyle.timePickerContainer}>
              <View style={addClubEventDetailStyle.timePickerHeader}>
                <Text style={addClubEventDetailStyle.timePickerTitle}>
                  Select {timePickerMode === "start" ? "Opening" : "Closing"}{" "}
                  Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={addClubEventDetailStyle.timePickerCloseButton}
                >
                  <Text style={addClubEventDetailStyle.timePickerCloseText}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Display current selected time */}
              <View style={addClubEventDetailStyle.timeDisplayContainer}>
                <Text style={addClubEventDetailStyle.timeDisplayText}>
                  {formatTimeString(selectedTime)}
                </Text>
              </View>

              <CustomTimePicker
                initialTime={selectedTime}
                onTimeChange={setSelectedTime}
                mode={timePickerMode}
              />

              <View style={addClubEventDetailStyle.timePickerButtons}>
                <TouchableOpacity
                  style={addClubEventDetailStyle.timePickerCancelButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={addClubEventDetailStyle.timePickerCancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={addClubEventDetailStyle.timePickerConfirmButton}
                  onPress={() => {
                    console.log(
                      "Confirm button pressed, selectedTime:",
                      selectedTime
                    );
                    const timeString = formatTimeString(selectedTime);
                    console.log("Time string generated:", timeString);

                    // Use setTimeout to ensure state updates are processed
                    setTimeout(() => {
                      if (timePickerMode === "start") {
                        setStartTime(timeString);
                        console.log("Set startTime to:", timeString);
                      } else {
                        setEndTime(timeString);
                        console.log("Set endTime to:", timeString);
                      }
                    }, 100);

                    setShowTimePicker(false);
                  }}
                >
                  <Text style={addClubEventDetailStyle.timePickerConfirmText}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={(() => {
            try {
              if (datePickerMode === "start" && startDate) {
                const [day, month, year] = startDate.split("/");
                return new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day)
                );
              } else if (datePickerMode === "end" && endDate) {
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

      <ImageSelectionBottomSheet
        visible={showImagePicker && (currentImageType === "main" || currentImageType === "floorLayout")}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => {
          console.log(`${currentImageType} - Camera pressed`);
          handleImagePicker("camera", currentImageType, -1, -1);
        }}
        onGalleryPress={() => {
          console.log(`${currentImageType} - Gallery pressed`);
          handleImagePicker("gallery", currentImageType, -1, -1);
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
