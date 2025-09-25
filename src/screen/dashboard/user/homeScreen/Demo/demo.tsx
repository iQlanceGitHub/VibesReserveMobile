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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CustomeTextInput,
  DatePickerInput,
} from "../../../../../components/textinput";
import { Buttons } from "../../../../../components/buttons";
import { colors } from "../../../../../utilis/colors";
import DetailsInput from "../../../../../components/DetailsInput";
import CustomDropdown from "../../../../../components/CustomDropdown";
import ImageSelectionBottomSheet from "../../../../../components/ImageSelectionBottomSheet";
import CategoryButton from "../../../../../components/CategoryButton";
import TimeIcon from "../../../../../assets/svg/timeIcon";
import CalendarIcon from "../../../../../assets/svg/calendarIcon";
import ArrowDownIcon from "../../../../../assets/svg/arrowDownIcon";
import PlusIcon from "../../../../../assets/svg/plusIcon";
import GalleryIcon from "../../../../../assets/svg/galleryIcon";
import BackIcon from "../../../../../assets/svg/backIcon";
import DeleteIconNew from "../../../../../assets/svg/deleteIconNew";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from 'react-redux';
import {
  onCreateevent,
  createeventData,
  createeventError,
} from "../../../../../redux/auth/actions";
import { showToast } from '../../../../../utilis/toastUtils';
import { uploadFileToS3 } from '../../../../../utilis/s3Upload';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import PermissionManager from '../../../../../utilis/permissionUtils';
import addClubEventDetailStyle from "../../../host/homeScreen/addClubEventDetailStyle";

interface BoothType {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
  selected: boolean;
}

interface demoProps {
  navigation?: any;
}

const demo: React.FC<demoProps> = ({
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
  const [ticketType, setTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [capacity, setCapacity] = useState("");

  // UI state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"start" | "end">("start");
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: false,
    details: false,
    entryFee: false,
    startTime: false,
    endTime: false,
    startDate: false,
    endDate: false,
    address: false,
    ticketType: false,
    ticketPrice: false,
    capacity: false,
  });

  // Redux
  const dispatch = useDispatch();
  const createevent = useSelector((state: any) => state.auth.createevent);
  const createeventErr = useSelector((state: any) => state.auth.createeventErr);

  const types: BoothType[] = [
    { id: "1", name: "Club" },
    { id: "2", name: "Event" },
  ];

  const boothTypes: BoothType[] = [
    { id: "1", name: "VIP Booth" },
    { id: "2", name: "Standard Booth" },
    { id: "3", name: "Premium Booth" },
    { id: "4", name: "Luxury Booth" },
  ];

  const ticketTypes: BoothType[] = [
    { id: "1", name: "General" },
    { id: "2", name: "VIP" },
    { id: "3", name: "Early Bird" },
    { id: "4", name: "Late Entry" },
  ];

  const facilities: Facility[] = [
    { id: "1", name: "Parking", selected: false },
    { id: "2", name: "Private Seating", selected: false },
    { id: "3", name: "Food Menu", selected: false },
    { id: "4", name: "Live Music", selected: false },
    { id: "5", name: "Wi-Fi", selected: false },
    { id: "6", name: "VIP Area", selected: false },
    { id: "7", name: "Dance Floor", selected: false },
    { id: "8", name: "Smoking Zone", selected: false },
    { id: "9", name: "Bar", selected: false },
    { id: "10", name: "Outdoor Seating", selected: false },
  ];

  const [facilitiesList, setFacilitiesList] = useState<Facility[]>(facilities);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      details: !details.trim(),
      entryFee: !entryFee.trim() || isNaN(Number(entryFee)),
      startTime: !startTime.trim(),
      endTime: !endTime.trim(),
      startDate: !startDate.trim(),
      endDate: !endDate.trim(),
      address: !address.trim(),
      ticketType: type === "Event" && !ticketType.trim(),
      ticketPrice: type === "Event" && (!ticketPrice.trim() || isNaN(Number(ticketPrice))),
      capacity: type === "Event" && (!capacity.trim() || isNaN(Number(capacity))),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
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
    try {
      const result = await PermissionManager.requestStoragePermission();
      return result.granted;
    } catch (error) {
      console.log('Error requesting storage permission:', error);
      return false;
    }
  };

  const handleImagePicker = (type: 'camera' | 'gallery') => {
    setShowImagePicker(false);
    
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          handleImageUpload(asset.uri);
        }
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
      // Use the new permission flow with proper alerts
      PermissionManager.requestPermissionWithFlow(
        'storage',
        () => {
          launchImageLibrary(options, callback);
        },
        (error) => {
          console.log('Storage permission error:', error);
          showToast('error', 'Storage permission denied');
        }
      );
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
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      if (timePickerMode === "start") {
        setStartTime(timeString);
      } else {
        setEndTime(timeString);
      }
    }
  };
  const showTimePickerModal = (mode: "start" | "end") => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };
  const toggleFacility = (id: string) => {
    setFacilitiesList((prev) =>
      prev.map((facility) =>
        facility.id === id
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
      .map(facility => facility.id);

    // Prepare tickets array for events
    const tickets = type === "Event" ? [{
      ticketType: ticketType,
      ticketPrice: Number(ticketPrice),
      capacity: Number(capacity)
    }] : [];

    // Prepare coordinates (you might want to get this from location picker)
    const coordinates = {
      type: "Point",
      coordinates: [23.026071652494444, 72.50766386964187] // Default coordinates
    };

    const eventData = {
      type: type,
      name: name,
      details: details,
      entryFee: Number(entryFee),
      openingTime: startTime,
      closeTime: endTime,
      startDate: startDate,
      endDate: endDate,
      address: address,
      coordinates: coordinates,
      photos: uploadPhotos,
      facilities: selectedFacilities,
      tickets: tickets
    };

    console.log('Creating event with data:', eventData);
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

  // Update image upload handlers
  const handlePhotoUpload = (index: number) => {
    setCurrentImageIndex(index);
    setShowImagePicker(true);
  };

  const handleDeleteImage = (index: number) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newPhotos = [...uploadPhotos];
            newPhotos.splice(index, 1);
            setUploadPhotos(newPhotos);
            showToast('success', 'Image deleted successfully');
          }
        }
      ]
    );
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
              label="Type"
              placeholder="Select type"
              options={types}
              selectedValue={type}
              onSelect={setType}
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
                  setStartDate(text);
                  if (errors.startDate) {
                    setErrors(prev => ({ ...prev, startDate: false }));
                  }
                }}
                error={errors.startDate}
                message={errors.startDate ? "Start date is required" : ""}
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
                  setEndDate(text);
                  if (errors.endDate) {
                    setErrors(prev => ({ ...prev, endDate: false }));
                  }
                }}
                error={errors.endDate}
                message={errors.endDate ? "End date is required" : ""}
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
                style={[
                  addClubEventDetailStyle.timeInputButton,
                  errors.startTime && { borderColor: colors.red }
                ]}
                onPress={() => {
                  showTimePickerModal("start");
                  if (errors.startTime) {
                    setErrors(prev => ({ ...prev, startTime: false }));
                  }
                }}
              >
                <Text style={startTime ? addClubEventDetailStyle.timeInputText : addClubEventDetailStyle.timeInputPlaceholder}>
                  {startTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
              {errors.startTime && (
                <Text style={addClubEventDetailStyle.errorText}>Start time is required</Text>
              )}
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>End Time</Text>
              <TouchableOpacity
                style={[
                  addClubEventDetailStyle.timeInputButton,
                  errors.endTime && { borderColor: colors.red }
                ]}
                onPress={() => {
                  showTimePickerModal("end");
                  if (errors.endTime) {
                    setErrors(prev => ({ ...prev, endTime: false }));
                  }
                }}
              >
                <Text style={endTime ? addClubEventDetailStyle.timeInputText : addClubEventDetailStyle.timeInputPlaceholder}>
                  {endTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
              {errors.endTime && (
                <Text style={addClubEventDetailStyle.errorText}>End time is required</Text>
              )}
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Address"
                placeholder="Enter address"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (errors.address) {
                    setErrors(prev => ({ ...prev, address: false }));
                  }
                }}
                error={errors.address}
                message={errors.address ? "Address is required" : ""}
                leftImage=""
                kType="default"
                multiline={true}
              />
            </View>


            {type === "Event" && (
              <>
                <CustomDropdown
                  label="Ticket Type"
                  placeholder="Select ticket type"
                  options={ticketTypes}
                  selectedValue={ticketType}
                  onSelect={(value) => {
                    setTicketType(value);
                    if (errors.ticketType) {
                      setErrors(prev => ({ ...prev, ticketType: false }));
                    }
                  }}
                />
                {errors.ticketType && (
                  <Text style={addClubEventDetailStyle.errorText}>Ticket type is required</Text>
                )}

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Ticket Price"
                    placeholder="Enter ticket price"
                    value={ticketPrice}
                    onChangeText={(text) => {
                      setTicketPrice(text);
                      if (errors.ticketPrice) {
                        setErrors(prev => ({ ...prev, ticketPrice: false }));
                      }
                    }}
                    error={errors.ticketPrice}
                    message={errors.ticketPrice ? "Valid ticket price is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.capacityFormElement}>
                  <CustomeTextInput
                    label="Capacity"
                    placeholder="Enter capacity"
                    value={capacity}
                    onChangeText={(text) => {
                      setCapacity(text);
                      if (errors.capacity) {
                        setErrors(prev => ({ ...prev, capacity: false }));
                      }
                    }}
                    error={errors.capacity}
                    message={errors.capacity ? "Valid capacity is required" : ""}
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={addClubEventDetailStyle.addNewTicketButton}
                >
                  <PlusIcon />
                  <Text style={addClubEventDetailStyle.addNewTicketText}>
                    Add New Ticket
                  </Text>
                </TouchableOpacity>
              </>
            )}


            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Upload Photos
              </Text>
              <View style={addClubEventDetailStyle.uploadPhotosRow}>
                {[0, 1, 2].map((index) => (
                  <View key={index} style={addClubEventDetailStyle.imageContainer}>
                    <TouchableOpacity
                      style={addClubEventDetailStyle.imageUploadBox}
                      onPress={() => handlePhotoUpload(index)}
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
                        onPress={() => handleDeleteImage(index)}
                      >
                        <DeleteIconNew width={20} height={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Facilities
              </Text>
              <View style={addClubEventDetailStyle.facilitiesGrid}>
                {facilitiesList.map((facility) => (
                  <TouchableOpacity
                    key={facility.id}
                    style={addClubEventDetailStyle.facilityCheckboxContainer}
                    onPress={() => toggleFacility(facility.id)}
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
        />
      )}

      <ImageSelectionBottomSheet
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => handleImagePicker('camera')}
        onGalleryPress={() => handleImagePicker('gallery')}
      />
    </View>
  );
};

export default demo;
