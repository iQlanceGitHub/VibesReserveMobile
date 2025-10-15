import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { launchCamera, launchImageLibrary, MediaType, ImagePickerResponse } from "react-native-image-picker";
import { colors } from "../../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../../../../components/buttons";
import {
  CustomeTextInput,
  PhoneNumberInput,
  DatePickerInput,
} from "../../../../../components/textinput";
import { BackButton } from "../../../../../components/BackButton";
import ImageSelectionBottomSheet from "../../../../../components/ImageSelectionBottomSheet";
import EmailIcon from "../../../../../assets/svg/emailIcon";
import NameIcon from "../../../../../assets/svg/nameIcon";
import CalendarIcon from "../../../../../assets/svg/calendarIcon";
import EditIcon from "../../../../../assets/svg/editIcon";
import ProfileIcon from "../../../../../assets/svg/profileIcon";
import DeleteIconNew from "../../../../../assets/svg/deleteIconNew";
import { styles } from "./styles";
import {
  onGetProfileDetail,
  onUpdateProfile,
  updateProfileData,
  updateProfileError,
} from "../../../../../redux/auth/actions";
import { PermissionManager } from "../../../../../utilis/permissionUtils";
import { uploadFileToS3 } from "../../../../../utilis/s3Upload";
import { showToast } from "../../../../../utilis/toastUtils";

interface HostEditProfileScreenProps {
  navigation?: any;
}

const HostEditProfileScreen: React.FC<HostEditProfileScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const { getProfileDetail, getProfileDetailErr, updateProfile, updateProfileErr, loader } = useSelector(
    (state: any) => state.auth
  );

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  
  // Business fields
  const [businessName, setBusinessName] = useState("");
  const [businessPicture, setBusinessPicture] = useState<string | null>(null);
  const [businessBanner, setBusinessBanner] = useState<string | null>(null);
  const [businessDescription, setBusinessDescription] = useState("");

  // Error states
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [businessNameError, setBusinessNameError] = useState(false);
  const [businessDescriptionError, setBusinessDescriptionError] = useState(false);
  const [documentError, setDocumentError] = useState(false);
  const [businessPictureError, setBusinessPictureError] = useState(false);
  const [businessBannerError, setBusinessBannerError] = useState(false);

  // Error messages
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [businessNameErrorMessage, setBusinessNameErrorMessage] = useState("");
  const [businessDescriptionErrorMessage, setBusinessDescriptionErrorMessage] = useState("");
  const [documentErrorMessage, setDocumentErrorMessage] = useState("");
  const [businessPictureErrorMessage, setBusinessPictureErrorMessage] = useState("");
  const [businessBannerErrorMessage, setBusinessBannerErrorMessage] = useState("");

  // Image picker states
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<'profile' | 'document' | 'businessPicture' | 'businessBanner'>('profile');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(onGetProfileDetail({}));
  }, [dispatch]);

  // Handle profile data response
  useEffect(() => {
    if (getProfileDetail?.data) {
      const profileData = getProfileDetail.data;
      setFullName(profileData.fullName || "");
      setEmail(profileData.email || "");
      setPhoneNumber(profileData.phone || "");
      setPhoneCode(profileData.countrycode || "");
      setDateOfBirth(profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : "");
      setProfileImage(profileData.profilePicture || null);
      setDocumentImage(profileData.userDocument || null);
      setBusinessName(profileData.businessName || "");
      setBusinessPicture(profileData.businessPicture || null);
      setBusinessBanner(profileData.businessBanner || null);
      setBusinessDescription(profileData.businessDiscription || "");
    }
  }, [getProfileDetail]);

  // Handle update profile response
  useEffect(() => {
    if (updateProfile) {
      showToast('success', 'Profile updated successfully!');
      // Navigate back to the previous screen after successful update
      navigation.goBack();
      dispatch(updateProfileData(''));
    }
    if (updateProfileErr) {
      showToast('error', 'Failed to update profile');
      dispatch(updateProfileError(''));
    }
  }, [updateProfile, updateProfileErr]);

  // Handle errors
  useEffect(() => {
    if (getProfileDetailErr) {
      showToast('error', 'Failed to fetch profile details');
    }
    if (updateProfileErr) {
      showToast('error', 'Failed to update profile');
      // Don't navigate on error - let user retry
    }
  }, [getProfileDetailErr, updateProfileErr]);

  // Real-time validation handlers
  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError && text.trim().length >= 2) {
      setFullNameError(false);
      setFullNameErrorMessage("");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && validateEmail(text.trim())) {
      setEmailError(false);
      setEmailErrorMessage("");
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (phoneError && validatePhoneNumber(text.trim())) {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }
  };

  const handleDateChange = (text: string) => {
    setDateOfBirth(text);
    if (dateError && validateDateOfBirth(text)) {
      setDateError(false);
      setDateErrorMessage("");
    }
  };

  const handleBusinessNameChange = (text: string) => {
    setBusinessName(text);
    if (businessNameError && text.trim().length >= 2) {
      setBusinessNameError(false);
      setBusinessNameErrorMessage("");
    }
  };

  const handleBusinessDescriptionChange = (text: string) => {
    setBusinessDescription(text);
    if (businessDescriptionError && text.trim().length >= 10) {
      setBusinessDescriptionError(false);
      setBusinessDescriptionErrorMessage("");
    }
  };

  const handleEditProfilePicture = () => {
    setCurrentImageType('profile');
    setShowImagePicker(true);
  };

  const handleDocumentUpload = () => {
    setCurrentImageType('document');
    setShowImagePicker(true);
  };

  const handleBusinessPictureUpload = () => {
    setCurrentImageType('businessPicture');
    setShowImagePicker(true);
  };

  const handleBusinessBannerUpload = () => {
    setCurrentImageType('businessBanner');
    setShowImagePicker(true);
  };

  const handleImagePicker = (type: 'camera' | 'gallery') => {
    setShowImagePicker(false);
    
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
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
      PermissionManager.requestPermissionWithFlow(
        'camera',
        () => {
          launchCamera(options, callback);
        },
        (error) => {
          showToast('error', 'Camera permission denied');
        }
      );
    } else {
      PermissionManager.requestPermissionWithFlow(
        'storage',
        () => {
          launchImageLibrary(options, callback);
        },
        (error) => {
          showToast('error', 'Storage permission denied');
        }
      );
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setIsUploading(true);
      const fileName = `${currentImageType}_${Date.now()}.jpg`;
      const uploadedUrl = await uploadFileToS3(imageUri, fileName, 'image/jpeg');
      
      // Update the appropriate state based on current image type
      switch (currentImageType) {
        case 'profile':
          setProfileImage(uploadedUrl);
          break;
        case 'document':
          setDocumentImage(uploadedUrl);
          setDocumentError(false);
          setDocumentErrorMessage("");
          break;
        case 'businessPicture':
          setBusinessPicture(uploadedUrl);
          setBusinessPictureError(false);
          setBusinessPictureErrorMessage("");
          break;
        case 'businessBanner':
          setBusinessBanner(uploadedUrl);
          setBusinessBannerError(false);
          setBusinessBannerErrorMessage("");
          break;
      }
      
      showToast('success', 'Image uploaded successfully');
    } catch (error) {
      showToast('error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProfileImage = () => {
    Alert.alert(
      "Delete Profile Image",
      "Are you sure you want to delete this profile image?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setProfileImage(null);
            showToast('success', 'Profile image deleted successfully!');
          }
        }
      ]
    );
  };

  const handleDeleteDocumentImage = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDocumentImage(null);
            showToast('success', 'Document deleted successfully!');
          }
        }
      ]
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateDateOfBirth = (date: string) => {
    if (!date) return false;
    
    let selectedDate: Date;
    
    // Handle DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/');
      selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      selectedDate = new Date(date);
    }
    
    if (isNaN(selectedDate.getTime())) {
      return false;
    }
    
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    return age >= 18 && age <= 100;
  };

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return "";
    
    // Check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Handle DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Handle other formats by creating a Date object and formatting
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const showFieldErrorToast = (fieldName: string, message: string) => {
    showToast('error', `${fieldName}: ${message}`);
  };

  const handleSaveAndUpdate = () => {
    let hasError = false;
    let firstErrorField = "";

    // Reset all error states
    setFullNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setDateError(false);
    setBusinessNameError(false);
    setBusinessDescriptionError(false);
    setDocumentError(false);
    setBusinessPictureError(false);
    setBusinessBannerError(false);
    setFullNameErrorMessage("");
    setEmailErrorMessage("");
    setPhoneErrorMessage("");
    setDateErrorMessage("");
    setBusinessNameErrorMessage("");
    setBusinessDescriptionErrorMessage("");
    setDocumentErrorMessage("");
    setBusinessPictureErrorMessage("");
    setBusinessBannerErrorMessage("");

    // Validate Full Name
    if (!fullName.trim()) {
      setFullNameError(true);
      setFullNameErrorMessage("Full name is required");
      if (!hasError) {
        firstErrorField = "Full Name";
        showFieldErrorToast("Full Name", "Full name is required");
      }
      hasError = true;
    } else if (fullName.trim().length < 2) {
      setFullNameError(true);
      setFullNameErrorMessage("Full name must be at least 2 characters");
      if (!hasError) {
        firstErrorField = "Full Name";
        showFieldErrorToast("Full Name", "Full name must be at least 2 characters");
      }
      hasError = true;
    }

    // Validate Email
    if (!email.trim()) {
      setEmailError(true);
      setEmailErrorMessage("Email is required");
      if (!hasError) {
        firstErrorField = "Email";
        showFieldErrorToast("Email", "Email is required");
      }
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address");
      if (!hasError) {
        firstErrorField = "Email";
        showFieldErrorToast("Email", "Please enter a valid email address");
      }
      hasError = true;
    }

    // Validate Phone Number
    if (!phoneNumber.trim()) {
      setPhoneError(true);
      setPhoneErrorMessage("Phone number is required");
      if (!hasError) {
        firstErrorField = "Phone Number";
        showFieldErrorToast("Phone Number", "Phone number is required");
      }
      hasError = true;
    } else if (!validatePhoneNumber(phoneNumber.trim())) {
      setPhoneError(true);
      setPhoneErrorMessage("Please enter a valid 10-digit phone number");
      if (!hasError) {
        firstErrorField = "Phone Number";
        showFieldErrorToast("Phone Number", "Please enter a valid 10-digit phone number");
      }
      hasError = true;
    }
    

    // Validate Business Name
    if (!businessName.trim()) {
      setBusinessNameError(true);
      setBusinessNameErrorMessage("Business name is required");
      if (!hasError) {
        firstErrorField = "Business Name";
        showFieldErrorToast("Business Name", "Business name is required");
      }
      hasError = true;
    } else if (businessName.trim().length < 2) {
      setBusinessNameError(true);
      setBusinessNameErrorMessage("Business name must be at least 2 characters");
      if (!hasError) {
        firstErrorField = "Business Name";
        showFieldErrorToast("Business Name", "Business name must be at least 2 characters");
      }
      hasError = true;
    }

    // Validate Business Description
    if (!businessDescription.trim()) {
      setBusinessDescriptionError(true);
      setBusinessDescriptionErrorMessage("Business description is required");
      if (!hasError) {
        firstErrorField = "Business Description";
        showFieldErrorToast("Business Description", "Business description is required");
      }
      hasError = true;
    } else if (businessDescription.trim().length < 10) {
      setBusinessDescriptionError(true);
      setBusinessDescriptionErrorMessage("Business description must be at least 10 characters");
      if (!hasError) {
        firstErrorField = "Business Description";
        showFieldErrorToast("Business Description", "Business description must be at least 10 characters");
      }
      hasError = true;
    }

    // Validate Document Upload
    if (!documentImage) {
      setDocumentError(true);
      setDocumentErrorMessage("Document upload is required");
      if (!hasError) {
        firstErrorField = "Document Upload";
        showFieldErrorToast("Document Upload", "Please upload a document");
      }
      hasError = true;
    }

    // Validate Business Picture
    if (!businessPicture) {
      setBusinessPictureError(true);
      setBusinessPictureErrorMessage("Business picture is required");
      if (!hasError) {
        firstErrorField = "Business Picture";
        showFieldErrorToast("Business Picture", "Please upload a business picture");
      }
      hasError = true;
    }

    // Validate Business Banner
    if (!businessBanner) {
      setBusinessBannerError(true);
      setBusinessBannerErrorMessage("Business banner is required");
      if (!hasError) {
        firstErrorField = "Business Banner";
        showFieldErrorToast("Business Banner", "Please upload a business banner");
      }
      hasError = true;
    }

    if (!hasError) {
      // Format date for API
      const formattedDate = formatDateForAPI(dateOfBirth);
      
      // Prepare update payload
      const updatePayload = {
        fullName: fullName.trim(),
        countrycode: phoneCode,
        phone: phoneNumber.trim(),
        dateOfBirth: formattedDate,
        profilePicture: profileImage,
        userDocument: documentImage,
        businessName: businessName.trim(),
        businessPicture: businessPicture,
        businessBanner: businessBanner,
        businessDiscription: businessDescription.trim(),
      };

      // Dispatch update action
      dispatch(onUpdateProfile(updatePayload));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.gradient_dark_purple}
      />

      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton
            navigation={navigation}
            onBackPress={() => navigation?.goBack()}
          />
          <Text style={styles.headerTitle}>Host Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                  <View style={styles.profileImageWrapper}>
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteProfileButton}
                      onPress={handleDeleteProfileImage}
                    >
                      <DeleteIconNew width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.defaultProfileContainer}>
                    <ProfileIcon width={60} height={60} />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={handleEditProfilePicture}
                >
                  <EditIcon />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formContainer}>
              <CustomeTextInput
                label="Full Name *"
                value={fullName}
                onChangeText={handleFullNameChange}
                error={fullNameError}
                message={fullNameErrorMessage}
                placeholder="Enter your full name"
                leftImage={<NameIcon />}
                style={styles.inputField}
              />
              <CustomeTextInput
                label="Email *"
                value={email}
                onChangeText={handleEmailChange}
                error={emailError}
                message={emailErrorMessage}
                placeholder="Enter your email address"
                leftImage={<EmailIcon />}
                style={styles.inputField}
                editable={false}
              />
              <PhoneNumberInput
                label="Phone Number *"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                phoneCode={phoneCode}
                onCountryCodeChange={setPhoneCode}
                error={phoneError}
                message={phoneErrorMessage}
                placeholder="Enter your phone number"
                style={styles.inputField}
              />
              <DatePickerInput
                label="Date of Birth *"
                value={dateOfBirth}
                onChangeText={handleDateChange}
                error={dateError}
                message={dateErrorMessage}
                placeholder="Select your date of birth"
                leftImage={<CalendarIcon />}
                style={styles.inputField}
              />
              
              {/* Business Information Section */}
              <Text style={styles.sectionTitle}>Business Information</Text>
              
              <CustomeTextInput
                label="Business Name *"
                value={businessName}
                onChangeText={handleBusinessNameChange}
                error={businessNameError}
                message={businessNameErrorMessage}
                placeholder="Enter your business name"
                leftImage={<NameIcon />}
                style={styles.inputField}
              />
              
              <CustomeTextInput
                label="Business Description *"
                value={businessDescription}
                onChangeText={handleBusinessDescriptionChange}
                error={businessDescriptionError}
                message={businessDescriptionErrorMessage}
                placeholder="Describe your business (minimum 10 characters)"
                leftImage={<NameIcon />}
                style={[styles.inputField, styles.textAreaInput]}
                multiline={true}
              />
              <Text style={styles.characterCount}>
                {businessDescription.length}/10 minimum characters
              </Text>
              
              <Text style={styles.documentLabel}>Upload Document *</Text>
              <View style={[styles.documentContainer, documentError && styles.errorBorder]}>
                <View style={styles.documentThumbnail}>
                  <View style={styles.documentImage}>
                    {documentImage ? (
                      <View style={styles.documentImageWrapper}>
                        <Image
                          source={{ uri: documentImage }}
                          style={styles.documentImageStyle}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deleteDocumentButton}
                          onPress={handleDeleteDocumentImage}
                        >
                          <DeleteIconNew width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.noDocumentText}>
                        No Document{"\n"}Selected
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleDocumentUpload}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
              {documentError && (
                <Text style={styles.errorText}>{documentErrorMessage}</Text>
              )}
              
              {/* Business Picture Upload */}
              <Text style={styles.documentLabel}>Business Picture *</Text>
              <View style={[styles.documentContainer, businessPictureError && styles.errorBorder]}>
                <View style={styles.documentThumbnail}>
                  <View style={styles.documentImage}>
                    {businessPicture ? (
                      <View style={styles.documentImageWrapper}>
                        <Image
                          source={{ uri: businessPicture }}
                          style={styles.documentImageStyle}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deleteDocumentButton}
                          onPress={() => setBusinessPicture(null)}
                        >
                          <DeleteIconNew width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.noDocumentText}>
                        No Business{"\n"}Picture Selected
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleBusinessPictureUpload}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
              {businessPictureError && (
                <Text style={styles.errorText}>{businessPictureErrorMessage}</Text>
              )}
              
              {/* Business Banner Upload */}
              <Text style={styles.documentLabel}>Business Banner *</Text>
              <View style={[styles.documentContainer, businessBannerError && styles.errorBorder]}>
                <View style={styles.documentThumbnail}>
                  <View style={styles.documentImage}>
                    {businessBanner ? (
                      <View style={styles.documentImageWrapper}>
                        <Image
                          source={{ uri: businessBanner }}
                          style={styles.documentImageStyle}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deleteDocumentButton}
                          onPress={() => setBusinessBanner(null)}
                        >
                          <DeleteIconNew width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.noDocumentText}>
                        No Business{"\n"}Banner Selected
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleBusinessBannerUpload}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
              {businessBannerError && (
                <Text style={styles.errorText}>{businessBannerErrorMessage}</Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <Buttons
            title="Save & Update"
            onPress={handleSaveAndUpdate}
            style={styles.saveButton}
          />
        </View>
      </LinearGradient>

      {/* Image Selection Bottom Sheet */}
      <ImageSelectionBottomSheet
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => handleImagePicker('camera')}
        onGalleryPress={() => handleImagePicker('gallery')}
      />

      {/* Loading Overlay */}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Uploading image...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HostEditProfileScreen;
