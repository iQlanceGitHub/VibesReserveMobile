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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import {
  CustomeTextInput,
  PhoneNumberInput,
  DatePickerInput,
} from "../../components/textinput";
import { BackButton } from "../../components/BackButton";
import EmailIcon from "../../assets/svg/emailIcon";
import NameIcon from "../../assets/svg/nameIcon";
import CalendarIcon from "../../assets/svg/calendarIcon";
import EditIcon from "../../assets/svg/editIcon";
import ProfileIcon from "../../assets/svg/profileIcon";
import { styles } from "./styles";
import {
  onUpdateProfile,
  onGetProfileDetail,
  updateProfileData,
} from "../../redux/auth/actions";
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from "@react-native-documents/picker";
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from "react-native-image-picker";
import { uploadFileToS3 } from "../../utilis/s3Upload";
import PermissionManager from "../../utilis/permissionUtils";
import FilePickerPopup from "../../components/FilePickerPopup";
import RNFS from "react-native-fs";
import { showToast } from "../../utilis/toastUtils";
import Calender from "../../assets/svg/calender";

interface EditProfileScreenProps {
  navigation?: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const {
    updateProfile,
    updateProfileErr,
    loader,
    getProfileDetail,
    getProfileDetailErr,
  } = useSelector((state: any) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [showProfileImagePicker, setShowProfileImagePicker] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    dispatch(onGetProfileDetail({}));
  }, [dispatch]);

  const formatDateFromISO = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return isoString;
    }
  };

  const formatDateToISO = (dateString: string) => {
    if (!dateString) return "";
    try {
      const [day, month, year] = dateString.split("/");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toISOString();
    } catch (error) {
      return dateString;
    }
  };

  // Handle profile detail response
  useEffect(() => {
    if (
      getProfileDetail &&
      getProfileDetail.status === 1 &&
      getProfileDetail.data
    ) {
      const profileData = getProfileDetail.data;
      setFullName(profileData.fullName || "");
      setEmail(profileData.email || "");
      setPhoneNumber(profileData.phone || "");
      setPhoneCode(profileData.countrycode || "+1");
      setDateOfBirth(formatDateFromISO(profileData.dateOfBirth) || "");
      setProfileImage(profileData.profilePicture || null);
      setDocumentImage(profileData.userDocument || null);
    }
  }, [getProfileDetail]);

  useEffect(() => {
    if (updateProfile && updateProfile.status === 1) {
      showToast("success", updateProfile.message);
      setTimeout(() => {
        navigation?.goBack();
      }, 1500);
    }
    dispatch(updateProfileData(""));
  }, [updateProfile]);

  useEffect(() => {
    if (updateProfileErr) {
      showToast(
        "error",
        updateProfileErr?.message || "Failed to update profile"
      );
    }
  }, [updateProfileErr]);

  useEffect(() => {
    if (getProfileDetailErr) {
    }
  }, [getProfileDetailErr]);

  const handleEditProfilePicture = () => {
    setShowProfileImagePicker(true);
  };

  const handleDocumentUpload = () => {
    setShowFilePicker(true);
  };

  const handleProfileImageCameraCapture = async () => {
    PermissionManager.requestPermissionWithFlow(
      "camera",
      () => openProfileImageCamera(),
      (error) => {
        showToast("error", "Camera permission denied");
      }
    );
  };

  const openProfileImageCamera = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.8 as const,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
      saveToPhotos: false,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        showToast("error", `Failed to capture image: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || `profile_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
        const permanentFile = await createPermanentFileCopy(file);
        validateAndSetProfileImage(permanentFile);
      } else {
        showToast("error", "No image was captured. Please try again.");
      }
    });
  };

  const handleProfileImageGallerySelection = async () => {
    PermissionManager.requestPermissionWithFlow(
      "storage",
      () => openProfileImageGallery(),
      (error) => {
        showToast("error", "Storage permission denied");
      }
    );
  };

  const openProfileImageGallery = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.8 as const,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        showToast("error", `Failed to select image: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || `profile_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
        const permanentFile = await createPermanentFileCopy(file);
        validateAndSetProfileImage(permanentFile);
      } else {
        showToast("error", "No image was selected. Please try again.");
      }
    });
  };

  const validateAndSetProfileImage = (file: any) => {
    const fileSizeInMB = file.size ? file.size / (1024 * 1024) : 0;

    if (fileSizeInMB > 5) {
      showToast("error", "Please select an image smaller than 5MB.");
      return;
    }

    const fileName = file.name ? file.name.toLowerCase() : "";
    const fileExtension = fileName.split(".").pop() || "";

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "",
      "application/octet-stream",
    ];

    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

    const isValidType =
      allowedTypes.includes(file.type || "") ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      showToast(
        "error",
        "Please select a valid image (JPG, PNG, GIF, WebP only)."
      );
      return;
    }

    setProfileImage(file.uri);
    showToast("success", "Profile image selected successfully!");
  };

  const createPermanentFileCopy = async (file: any) => {
    if (Platform.OS !== "ios") {
      return file;
    }

    try {
      const sourcePath = file.uri;
      const fileName = file.name || `file_${Date.now()}`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(sourcePath, destPath);
      return {
        ...file,
        uri: destPath,
        permanentPath: destPath,
      };
    } catch (error) {
      return file;
    }
  };

  const handleCameraCapture = async () => {
    PermissionManager.requestPermissionWithFlow(
      "camera",
      () => openCamera(),
      (error) => {
        showToast("error", "Camera permission denied");
      }
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.8 as const,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
      saveToPhotos: false,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        showToast("error", `Failed to capture image: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || `camera_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
        const permanentFile = await createPermanentFileCopy(file);
        validateAndSetFile(permanentFile);
      } else {
        showToast("error", "No image was captured. Please try again.");
      }
    });
  };

  const handleGallerySelection = async () => {
    PermissionManager.requestPermissionWithFlow(
      "storage",
      () => openGallery(),
      (error) => {
        showToast("error", "Storage permission denied");
      }
    );
  };

  const openGallery = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.8 as const,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        showToast("error", `Failed to select image: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || `gallery_${Date.now()}.jpg`,
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
        const permanentFile = await createPermanentFileCopy(file);
        validateAndSetFile(permanentFile);
      } else {
        showToast("error", "No image was selected. Please try again.");
      }
    });
  };

  const handleDocumentSelection = async () => {
    try {
      setTimeout(async () => {
        try {
          const result = await pick({
            type: [types.pdf, types.doc],
            allowMultiSelection: false,
            presentationStyle:
              Platform.OS === "ios" ? "pageSheet" : "fullScreen",
            mode: "import",
          });

          if (result && Array.isArray(result) && result.length > 0) {
            const file = result[0];
            const permanentFile = await createPermanentFileCopy(file);
            validateAndSetFile(permanentFile);
          } else {
            showToast("error", "No file was selected");
          }
        } catch (err) {
          if (
            isErrorWithCode(err) &&
            err.code === errorCodes.OPERATION_CANCELED
          ) {
          } else {
            const errorMessage = (err as any)?.message || "Unknown error";
            showToast("error", `Failed to select document: ${errorMessage}`);
          }
        }
      }, 100);
    } catch (err) {
      showToast("error", "Failed to initialize document picker");
    }
  };

  const validateAndSetFile = (file: any) => {
    const fileSizeInMB = file.size ? file.size / (1024 * 1024) : 0;

    if (fileSizeInMB > 5) {
      showToast("error", "Please select a file smaller than 5MB.");
      return;
    }

    const fileName = file.name ? file.name.toLowerCase() : "";
    const fileExtension = fileName.split(".").pop() || "";

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "",
      "application/octet-stream",
    ];

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
    ];

    const isValidType =
      allowedTypes.includes(file.type || "") ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      showToast(
        "error",
        "Please select a valid file (PDF, DOC, DOCX, JPG, PNG, GIF, WebP only)."
      );
      return;
    }

    setSelectedDocument(file);
    showToast("success", "Document selected successfully!");
  };

  const cleanupTemporaryFiles = async () => {
    if (Platform.OS === "ios" && selectedDocument?.permanentPath) {
      try {
        await RNFS.unlink(selectedDocument.permanentPath);
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanupTemporaryFiles();
    };
  }, [selectedDocument]);

  const handleSaveAndUpdate = async () => {
    setFullNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setDateError(false);

    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError(true);
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError(true);
      hasError = true;
    }

    if (!phoneNumber.trim()) {
      setPhoneError(true);
      hasError = true;
    }

    if (!dateOfBirth.trim()) {
      setDateError(true);
      hasError = true;
    }

    if (!hasError) {
      try {
        let uploadedDocumentUrl = documentImage;
        let uploadedProfileImageUrl = profileImage;

        if (selectedDocument) {
          setIsUploading(true);
          uploadedDocumentUrl = await uploadFileToS3(
            selectedDocument.uri,
            selectedDocument.name,
            selectedDocument.type
          );
        }

        if (profileImage && profileImage.startsWith("file://")) {
          setIsUploading(true);
          uploadedProfileImageUrl = await uploadFileToS3(
            profileImage,
            `profile_${Date.now()}.jpg`,
            "image/jpeg"
          );
        }

        setIsUploading(false);

        const updateProfilePayload = {
          fullName: fullName.trim(),
          countrycode: phoneCode,
          phone: phoneNumber.trim(),
          dateOfBirth: formatDateToISO(dateOfBirth.trim()),
          profilePicture: uploadedProfileImageUrl,
          userDocument: uploadedDocumentUrl,
        };

        dispatch(onUpdateProfile(updateProfilePayload));
      } catch (error) {
        showToast("error", "Failed to upload document. Please try again.");
        setIsUploading(false);
      }
    } else {
      showToast("error", "Please fill in all required fields correctly.");
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
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
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View>
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
                onChangeText={setFullName}
                error={fullNameError}
                message=""
                leftImage={<NameIcon />}
                style={styles.inputField}
              />
              <CustomeTextInput
                label="Email *"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                message=""
                leftImage={<EmailIcon />}
                style={styles.inputField}
                editable={false}
              />
              <PhoneNumberInput
                label="Phone Number *"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                phoneCode={phoneCode}
                onCountryCodeChange={setPhoneCode}
                error={phoneError}
                message=""
                style={styles.inputField}
              />
              <DatePickerInput
                label="Date of Birth *"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                error={dateError}
                message=""
                leftImage={<Calender />}
                style={styles.inputField}
              />
              {/* <Text style={styles.documentLabel}>Upload Document</Text>
              <View style={styles.documentContainer}>
                <View style={styles.documentThumbnail}>
                  <View style={styles.documentImage}>
                    {selectedDocument ? (
                      <Image
                        source={{ uri: selectedDocument.uri }}
                        style={styles.documentImageStyle}
                        resizeMode="cover"
                      />
                    ) : documentImage ? (
                      <Image
                        source={{ uri: documentImage }}
                        style={styles.documentImageStyle}
                        resizeMode="cover"
                      />
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
              </View> */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <Buttons
            title={loader || isUploading ? "Updating..." : "Save & Update"}
            onPress={handleSaveAndUpdate}
            style={styles.saveButton}
            disabled={loader || isUploading}
          />
        </View>
      </LinearGradient>

      <FilePickerPopup
        visible={showFilePicker}
        onClose={() => setShowFilePicker(false)}
        onCameraPress={handleCameraCapture}
        onGalleryPress={handleGallerySelection}
        onDocumentPress={handleDocumentSelection}
      />

      <FilePickerPopup
        visible={showProfileImagePicker}
        onClose={() => setShowProfileImagePicker(false)}
        onCameraPress={handleProfileImageCameraCapture}
        onGalleryPress={handleProfileImageGallerySelection}
        onDocumentPress={() => {}}
        hideDocumentOption={true}
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
