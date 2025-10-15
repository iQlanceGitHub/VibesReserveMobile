import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
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
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import {
  onSignup, signupData, signupError, onSocialLogin,
  socialLoginData,
  socialLoginError,
  setUser
} from "../../redux/auth/actions";
import FilePickerPopup from "../../components/FilePickerPopup";
import { openSettings } from 'react-native-permissions';
import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import {
  CustomeTextInput,
  CustomePasswordTextInput,
  PhoneNumberInput,
  DatePickerInput,
} from "../../components/textinput";
import GoogleIcon from "../../assets/svg/googleIcon";
import AppleIcon from "../../assets/svg/appleIcon";
import ProfileIcon from "../../assets/svg/profile";
import DeleteIconNew from "../../assets/svg/deleteIconNew";
import DocumentIcon from "../../assets/svg/documentIcon";
import MicroPhoneIcon from "../../assets/svg/microPhone";
import { BackButton } from "../../components/BackButton";
import NameIcon from "../../assets/svg/nameIcon";
import EmailIcon from "../../assets/svg/emailIcon";
import CalendarIcon from "../../assets/svg/calendarIcon";
import LockIcon from "../../assets/svg/lockIcon";
import { showToast } from "../../utilis/toastUtils.tsx";
import { uploadFileToS3 } from "../../utilis/s3Upload";
import PermissionManager from "../../utilis/permissionUtils";
import styles from "./styles";
import RNFS from 'react-native-fs'; // You'll need to install this package
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";
interface SignupScreenProps {
  navigation?: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const socialLogin = useSelector((state: any) => state.auth.socialLogin);
  const socialLoginErr = useSelector((state: any) => state.auth.socialLoginErr);
  const deviceToken = useSelector((state: any) => state.auth.deviceToken);

  const { signup, signupErr, loader } = useSelector((state: any) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("+1");
  const [phoneCodeFlag, setPhoneCodeFlag] = useState<string>("🇺🇸");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    deviceToken: deviceToken || "abcd", // Use Redux state or fallback
  });
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    dateOfBirth: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);


  // Get token
  const storeUserToken = async (token: any) => {
    try {
      await AsyncStorage.setItem("user_token", token);
      console.log("User token saved:", token);
      getUserToken();
    } catch (e) {
      console.error("Failed to save the user token.", e);
    }
  };

const storeUser = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log("User saved:", user);
  } catch (e) {
    console.error("Failed to save the user.", e);
  }
};

  // Get token
  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      if (token !== null) {
        console.log("User token retrieved:", token);
        return token;
      }
    } catch (e) {
      console.error("Failed to fetch the user token.", e);
    }
  };

  // Store user ID
  const storeUserId = async (userId: any) => {
    try {
      await AsyncStorage.setItem("user_id", userId);
      console.log("User ID saved:", userId);
    } catch (e) {
      console.error("Failed to save the user ID.", e);
    }
  };

  // Update deviceToken when it changes in Redux state
  useEffect(() => {
    console.log('🔄 SignUp Screen - deviceToken useEffect triggered');
    console.log('🔄 SignUp Screen - deviceToken value:', deviceToken);
    
    if (deviceToken) {
      console.log('✅ SignUp Screen - Updating formData with deviceToken:', deviceToken);
      setFormData(prev => ({
        ...prev,
        deviceToken: deviceToken
      }));
    } else {
      console.log('❌ SignUp Screen - deviceToken is empty, using fallback');
    }
  }, [deviceToken]);

  useEffect(() => {
    if (signup?.status === true ||
      signup?.status === "true" ||
      signup?.status === 1 ||
      signup?.status === "1") {
      showToast(
        "success",
        "Account created successfully! Please check your email for verification."
      );
      navigation.navigate('OTPVerificationScreen', { email: formData?.email, type: 'signup', id: signup?.user?._id })
      dispatch(signupData(''));
    } else if (signupErr) {
      showToast(
        "error",
        signupErr?.message || "Something went wrong. Please try again."
      );
      dispatch(signupError(''));
    }
  }, [signup, signupErr]);



  useEffect(() => {
    if (
      socialLogin?.status === true ||
      socialLogin?.status === 'true' ||
      socialLogin?.status === 1 ||
      socialLogin?.status === "1"
    ) {
      console.log("socialLogin:+>", socialLogin);
      //  setMsg(socialLogin?.message?.toString());
      showToast(
        "success",
        socialLogin?.message || "Something went wrong. Please try again."
      );

      
      dispatch(setUser(socialLogin));
      if (socialLogin?.token) {
        storeUserToken(socialLogin?.token);
      }
      if (socialLogin?.user?.id) {
        storeUserId(socialLogin.user.id);
      }

      const handleSocialLoginSuccess = async () => {
        if (
          socialLogin?.status === true ||
          socialLogin?.status === "true" ||
          socialLogin?.status === 1 ||
          socialLogin?.status === "1"
        ) {
          console.log("socialLogin:+>", socialLogin);
          //  setMsg(socialLogin?.message?.toString());
          showToast(
            "success",
            socialLogin?.message || "Something went wrong. Please try again."
          );
          dispatch(setUser(socialLogin));
          if (socialLogin?.token) {
            storeUserToken(socialLogin?.token);
          }
          if (socialLogin?.user?.id) {
            storeUserId(socialLogin.user.id);
          }
          
          // Store user status as logged in
          await storeUserStatus('logged_in');
          
          // Role-based navigation
          if (socialLogin?.user?.currentRole === 'user') {
            navigation.navigate('HomeTabs' as never);
          } else if (socialLogin?.user?.currentRole === 'host') {
            navigation.navigate('HostTabs' as never);
          } else {
            // Default fallback to HomeTabs
            navigation.navigate('HomeTabs' as never);
          }
          
          dispatch(socialLoginData(""));
        }
      };
  
      handleSocialLoginSuccess();
      
      // Role-based navigation
      if (socialLogin?.user?.currentRole === 'user') {
        navigation.navigate('HomeTabs' as never);
      } else if (socialLogin?.user?.currentRole === 'host') {
        navigation.navigate('HostTabs' as never);
      } else {
        // Default fallback to HomeTabs
        navigation.navigate('HomeTabs' as never);
      }
      dispatch(socialLoginData(""));
    }

    if (socialLoginErr) {
      console.log("signinErr:+>", socialLoginErr);
      showToast(
        "error",
        socialLoginErr?.message || "Something went wrong. Please try again."
      );
      dispatch(socialLoginError(''));
    }
  }, [socialLogin, socialLoginErr]);

  const handleInputChange = (field: string, value: string) => {
    // Convert email to lowercase
    const processedValue = field === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (processedValue.length === 0) {
      setErrors((prev) => ({ ...prev, [field]: false }));
      setErrorMessages((prev) => ({ ...prev, [field]: "" }));
    }
    if (field === "password") {
      validatePasswordRequirements(processedValue);
      if (formData.confirmPassword.length > 0) {
        validatePasswordMatch(processedValue, formData.confirmPassword);
      }
    }
    if (field === "confirmPassword") {
      validatePasswordMatch(formData.password, processedValue);
    }
  };

   // 🔑 Format function
   const formatDateFromText = (text: string): string => {
    if (!text) return "";
  
    // Handle DD/MM/YYYY or DD-MM-YYYY
    const parts = text.includes("/") ? text.split("/") : text.split("-");
    if (parts.length === 3) {
      let [day, month, year] = parts;
  
      // If year is first (e.g., 1997-01-01), reorder
      if (year.length === 4 && Number(day) > 12) {
        // already in DD/MM/YYYY → fine
      } else if (day.length === 4) {
        // if it's YYYY-MM-DD
        [year, month, day] = parts;
      }
  
      const d = String(day).padStart(2, "0");
      const m = String(month).padStart(2, "0");
      return `${d}-${m}-${year}`;
    }
  
    // Fallback: try native Date
    const date = new Date(text);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  
    return text; // if nothing worked, return raw
  };

  const validatePasswordRequirements = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    if (password.length === 0 || confirmPassword.length === 0) {
      setErrors((prev) => ({ ...prev, confirmPassword: false }));
      setErrorMessages((prev) => ({ ...prev, confirmPassword: "" }));
      return;
    }

    const passwordsMatch = password === confirmPassword;
    setErrors((prev) => ({ ...prev, confirmPassword: !passwordsMatch }));
    setErrorMessages((prev) => ({
      ...prev,
      confirmPassword: passwordsMatch ? "" : "Passwords do not match.",
    }));
  };

  const handlePhoneCodeChange = (code: string) => {
    setPhoneCode(code);
  };

  const handlePhoneCodePress = () => { };

  const handlePhoneValidation = (isError: boolean) => {
    setErrors((prev) => ({ ...prev, phoneNumber: isError }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: false,
      email: false,
      phoneNumber: false,
      dateOfBirth: false,
      password: false,
      confirmPassword: false,
    };
    const newErrorMessages = {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = true;
      newErrorMessages.fullName = "Full name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = true;
      newErrorMessages.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = true;
      newErrorMessages.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = true;
      newErrorMessages.password = "Password is required";
      isValid = false;
    } else if (
      !passwordValidation.length ||
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number ||
      !passwordValidation.specialChar
    ) {
      newErrors.password = true;
      newErrorMessages.password = "Password does not meet requirements";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = true;
      newErrorMessages.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
      newErrorMessages.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!selectedRole) {
      showToast("error", "Please select a role");
      return false;
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let uploadedDocumentUrl = undefined;
      if (selectedDocument) {
        setIsUploading(true);
        uploadedDocumentUrl = await uploadFileToS3(
          selectedDocument.uri,
          selectedDocument.name,
          selectedDocument.type
        );
        setIsUploading(false);
      }

      const signupPayload = {
        currentRole: selectedRole === "explore" ? "user" : "host",
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        countrycode: phoneCode,
        phone: formData.phoneNumber.trim(),
        dateOfBirth: formatDateFromText(formData.dateOfBirth),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userDocument: uploadedDocumentUrl,
        timeZone: "Asia/Kolkata",
        loginType: "email",
      };
      dispatch(onSignup(signupPayload));
    } catch (error) {
      showToast("error", "Failed to upload document. Please try again.");
      setIsUploading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo?.data?.user?.email);
      console.log('User Info:', userInfo);

      let obj = {
        "email": userInfo?.data?.user?.email,
        "socialId": userInfo?.data?.user?.id,
        "loginType": "google",
        "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        "currentRole": "user",
      }

      if (userInfo?.data?.user?.email && userInfo?.data?.user?.id) {
        dispatch(onSocialLogin(obj));
      }
      console.log("socialData+>>>>", socialData);
      //Alert.alert('Success', 'You have successfully signed in with Google!');
      // navigation.navigate('NameScreen')
    } catch (error) {
      console.log('Google Sign-In error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        identityToken,
        email,
        fullName: { givenName, familyName },
      } = appleAuthRequestResponse;
      const userId = appleAuthRequestResponse.user;

      // Handle the obtained data as per your requirements

      let obj = {
        "email": email == null ? '' : email,
        "socialId": userId,
        "loginType": 'apple',
        "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        "currentRole": "user",
      }

      if (userId) {
        dispatch(onSocialLogin(obj));
      }

    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('Apple Login: User cancelled the login flow.');
      } else {
        console.log('Apple Login: Error occurred:', error.message);
      }
    }
  };

  const requestCameraPermission = async () => {
    try {
      const result = await PermissionManager.requestCameraPermission();
      return result.granted;
    } catch (error) {
      console.log('Error requesting camera permission:', error);
      return false;
    }
  };

  
  const handleSkip = async () => {
    try {
      // Store skip status
      await storeUserStatus('skipped');
      
      // Navigate to HomeTabs
      navigation?.navigate("HomeTabs" as never);
      
      // Show toast message
      showToast("info", "You can explore the app. Sign in to access all features!");
    } catch (error) {
      console.error("Error handling skip:", error);
      showToast("error", "Something went wrong. Please try again.");
    }
  };

  const storeUserStatus = async (status: 'logged_in' | 'skipped' | 'guest') => {
    try {
      // Clear all stored preferences first
      await AsyncStorage.multiRemove([
        'user_status',
        'user_permissions',
        'skip_timestamp',
      ]);
      
      await AsyncStorage.setItem("user_status", status);
      console.log("User status saved:", status);

      // Store additional metadata based on status
      if (status === 'skipped') {
        await AsyncStorage.setItem("skip_timestamp", Date.now().toString());
        await AsyncStorage.setItem("user_permissions", JSON.stringify({
          canLike: false,
          canDislike: false,
          canBookmark: false,
          canReview: false,
          canBook: false
        }));
      } else if (status === 'logged_in') {
        // Clear any skip-related data when user logs in
        await AsyncStorage.multiRemove(['skip_timestamp']);
        await AsyncStorage.setItem("user_permissions", JSON.stringify({
          canLike: true,
          canDislike: true,
          canBookmark: true,
          canReview: true,
          canBook: true
        }));
      }
    } catch (e) {
      console.error("Failed to save the user status.", e);
    }
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

  const reatePermanentFileCopy = async (file: any) => {
    if (Platform.OS !== 'ios') {
      return file; // Only needed for iOS
    }

    try {
      const sourcePath = file.uri;
      const fileName = file.name || `file_${Date.now()}`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Copy file to permanent storage
      await RNFS.copyFile(sourcePath, destPath);

      // Return new file object with permanent path
      return {
        ...file,
        uri: destPath,
        permanentPath: destPath // Keep track of the permanent path
      };
    } catch (error) {
      console.log('Error creating file copy:', error);
      return file; // Fallback to original file
    }
  };

  const handleCameraCapture = async () => {
    // Use the new permission flow with persistent requests
    PermissionManager.requestPermissionWithFlow(
      'camera',
      () => {
        // Permission granted, proceed with camera capture
        openCamera();
      },
      (error) => {
        console.log('Camera permission error:', error);
        showToast('error', 'Camera permission denied');
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

        // Create permanent copy for iOS
        const permanentFile = await reatePermanentFileCopy(file);
        validateAndSetFile(permanentFile);
      } else {
        showToast("error", "No image was captured. Please try again.");
      }
    });
  };

  const handleGallerySelection = async () => {
    // Use the new permission flow with persistent requests
    PermissionManager.requestPermissionWithFlow(
      'storage',
      () => {
        // Permission granted, proceed with gallery selection
        openGallery();
      },
      (error) => {
        console.log('Storage permission error:', error);
        showToast('error', 'Storage permission denied');
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

        // Create permanent copy for iOS
        const permanentFile = await reatePermanentFileCopy(file);
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
            presentationStyle: Platform.OS === "ios" ? "pageSheet" : "fullScreen",
            mode: "import",
          });

          if (result && Array.isArray(result) && result.length > 0) {
            const file = result[0];

            // Create permanent copy for iOS
            const permanentFile = await reatePermanentFileCopy(file);
            validateAndSetFile(permanentFile);
          } else {
            showToast("error", "No file was selected");
          }
        } catch (err) {
          if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
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

  const cleanupTemporaryFiles = async () => {
    if (Platform.OS === 'ios' && selectedDocument?.permanentPath) {
      try {
        await RNFS.unlink(selectedDocument.permanentPath);
      } catch (error) {
        console.log('Error cleaning up temporary file:', error);
      }
    }
  };

  // Call this when component unmounts or when file is replaced
  useEffect(() => {
    return () => {
      cleanupTemporaryFiles();
    };
  }, [selectedDocument]);

  const validateAndSetFile = (file: any) => {
    // React Native files have uri, name, type, and size properties
    const fileSizeInMB = file.size ? file.size / (1024 * 1024) : 0;

    if (fileSizeInMB > 5) {
      showToast("error", "Please select a file smaller than 5MB.");
      return;
    }

    // Get file extension for additional validation
    const fileName = file.name ? file.name.toLowerCase() : '';
    const fileExtension = fileName.split('.').pop() || '';

    // Allowed MIME types and extensions for React Native
    const allowedTypes = [
      "application/pdf",         // PDF
      "application/msword",      // DOC
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "image/jpeg",              // JPG/JPEG
      "image/png",               // PNG
      "image/gif",               // GIF
      "image/webp",              // WebP
      "",                        // iOS sometimes returns empty string
      "application/octet-stream" // Fallback for some iOS files
    ];

    const allowedExtensions = [
      'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp'
    ];

    // Check both MIME type and file extension for iOS compatibility
    const isValidType = allowedTypes.includes(file.type || "") ||
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

  const handleDocumentUpload = () => {
    setShowFilePicker(true);
  };

  const handleDeleteDocument = () => {
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
            setSelectedDocument(null);
            showToast("success", "Document deleted successfully!");
          }
        }
      ]
    );
  };

  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <DocumentIcon />;
      case 'doc':
      case 'docx':
        return <DocumentIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <DocumentIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  return (
    <View
      style={[styles.container, { paddingTop: Platform.OS === "ios" ? 0 : 0 }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { backgroundColor: colors.primary_blue }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
         
            <View style={styles.header}>
              <View style={styles.statusBar}>
                <BackButton
                  navigation={navigation}
                  onBackPress={() => navigation?.goBack()}
                />
                <TouchableOpacity style={styles.statusIcons} onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>Join us and start exploring</Text>
            </View>

            <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
              >
                <View style={styles.socialButtonContent}>
                  <View style={styles.appleIcons}>
                    <GoogleIcon />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
              {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleSignIn}
              >
                <View style={styles.socialButtonContent}>
                  <View style={styles.appleIcons}>
                    <AppleIcon />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </View>
              </TouchableOpacity>
)}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>

            

            <View style={styles.roleSection}>
              <Text style={styles.sectionTitle}>Choose Role</Text>
              <View style={styles.roleOptions}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    selectedRole === "explore" && styles.selectedRole,
                  ]}
                  onPress={() => setSelectedRole("explore")}
                >
                  <View style={styles.roleContent}>
                    <View style={styles.roleRow}>
                      <View
                        style={[
                          styles.radioButton,
                          selectedRole === "explore" && styles.selectedRadio,
                        ]}
                      >
                        {selectedRole === "explore" && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <View
                        style={[
                          styles.roleIconContainer,
                          selectedRole === "explore" &&
                          styles.selectedIconContainer,
                        ]}
                      >
                        <View style={styles.roleIcon}>
                          <ProfileIcon />
                        </View>
                      </View>
                      <Text style={styles.roleText}>
                        Explore{"\n"}Night Life
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    selectedRole === "host" && styles.selectedRole,
                  ]}
                  onPress={() => setSelectedRole("host")}
                >
                  <View style={styles.roleContent}>
                    <View style={styles.roleRow}>
                      <View
                        style={[
                          styles.radioButton,
                          selectedRole === "host" && styles.selectedRadio,
                        ]}
                      >
                        {selectedRole === "host" && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <View
                        style={[
                          styles.roleIconContainer,
                          selectedRole === "host" &&
                          styles.selectedIconContainer,
                        ]}
                      >
                        <View style={styles.roleIcon}>
                          <MicroPhoneIcon />
                        </View>
                      </View>
                      <Text style={styles.roleText}>Become{"\n"}a Host</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Full Name *"
                  value={formData.fullName}
                  placeholder="Enter your name"
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  error={errors.fullName}
                  message={errorMessages.fullName}
                  leftImage={<NameIcon />}
                  style={styles.customInput}
                  maxLength={30}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Email *"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChangeText={(text) => handleInputChange("email", text)}
                  error={errors.email}
                  message={errorMessages.email}
                  leftImage={<EmailIcon />}
                  kType="email-address"
                  style={styles.customInput}
                  maxLength={30}
                />
              </View>

              <View style={styles.inputContainer}>
                <PhoneNumberInput
                  label="Phone Number (Optional)"
                  value={formData.phoneNumber}
                  placeholder="Enter phone number"
                  onChangeText={(text) =>
                    handleInputChange("phoneNumber", text)
                  }
                  onPressPhoneCode={handlePhoneCodePress}
                  onCountryCodeChange={handlePhoneCodeChange}
                  phoneCode={phoneCode}
                  phoneCodeFlag={phoneCodeFlag}
                  error={errors.phoneNumber}
                  message={errorMessages.phoneNumber}
                  validatePhone={handlePhoneValidation}
                  style={styles.customInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <DatePickerInput
                  label="Date of Birth (Optional)"
                  value={formData.dateOfBirth}
                  placeholder="Select your date of birth"
                  onChangeText={(text) =>
                    handleInputChange("dateOfBirth", text)
                  }
                  error={errors.dateOfBirth}
                  message={errorMessages.dateOfBirth}
                  leftImage={<CalendarIcon />}
                  style={styles.customInput}
                />
                
              </View>

              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="Password *"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.password}
                  message={errorMessages.password}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="Confirm Password *"
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  error={errors.confirmPassword}
                  message={errorMessages.confirmPassword}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>
              {formData.password.length > 0 &&
                !(
                  passwordValidation.length &&
                  passwordValidation.uppercase &&
                  passwordValidation.lowercase &&
                  passwordValidation.number &&
                  passwordValidation.specialChar
                ) && (
                  <View style={styles.passwordValidationContainer}>
                    <Text style={styles.passwordValidationTitle}>
                      Password must contain
                    </Text>
                    <View style={styles.validationList}>
                      <View style={styles.validationItem}>
                        <Text
                          style={[
                            styles.validationText,
                            passwordValidation.length &&
                            styles.validationTextValid,
                          ]}
                        >
                          8–16 characters
                        </Text>
                      </View>
                      <View style={styles.validationItem}>
                        <Text
                          style={[
                            styles.validationText,
                            passwordValidation.uppercase &&
                            styles.validationTextValid,
                          ]}
                        >
                          At least one uppercase letter (A–Z)
                        </Text>
                      </View>
                      <View style={styles.validationItem}>
                        <Text
                          style={[
                            styles.validationText,
                            passwordValidation.lowercase &&
                            styles.validationTextValid,
                          ]}
                        >
                          At least one lowercase letter (a–z)
                        </Text>
                      </View>
                      <View style={styles.validationItem}>
                        <Text
                          style={[
                            styles.validationText,
                            passwordValidation.number &&
                            styles.validationTextValid,
                          ]}
                        >
                          At least one number (0–9)
                        </Text>
                      </View>
                      <View style={styles.validationItem}>
                        <Text
                          style={[
                            styles.validationText,
                            passwordValidation.specialChar &&
                            styles.validationTextValid,
                          ]}
                        >
                          At least one special character (e.g., ! @ # $ % ^ & *)
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
            </View>

            <View style={styles.documentSection}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <Text style={styles.sectionTitle}>Upload Document</Text>
              {selectedDocument ?  (
                    <View style={styles.selectedFileContainer}>
                      <TouchableOpacity
                        style={styles.deleteDocumentButton}
                        onPress={handleDeleteDocument}
                      >
                        <DeleteIconNew width={20} height={20} />
                      </TouchableOpacity></View>):(<></>)}
              </View>
              <TouchableOpacity
                style={styles.documentUpload}
                onPress={handleDocumentUpload}
              >


                <View style={styles.documentContent}>
                  {selectedDocument ? (
                    <View style={styles.selectedFileContainer}>
                      <View style={styles.documentIconContainer}>
                        {getDocumentIcon(selectedDocument.name)}
                      </View>
                      <Text style={styles.selectedFileName}>
                        {selectedDocument.name}
                      </Text>
                      <Text style={styles.selectedFileSize}>
                        {(selectedDocument.size / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                      <TouchableOpacity
                        style={styles.changeFileButton}
                        onPress={handleDocumentUpload}
                      >
                        <Text style={styles.changeFileButtonText}>
                          Change File
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.documentIconContainer}>
                        <DocumentIcon />
                      </View>
                      <Text style={styles.documentText}>
                        Choose a file or document
                      </Text>
                      <Text style={styles.documentSubtext}>
                        JPEG, PNG, and PDF up to 5.0 MB
                      </Text>
                      <TouchableOpacity
                        style={styles.browseButton}
                        onPress={handleDocumentUpload}
                      >
                        <Text style={styles.browseButtonText}>Browse File</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonSection}>
              <Buttons
                title={"Sign Up"}
                onPress={handleSignUp}
                style={styles.signUpButton}
                disabled={loader}
              />

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.loginLinkText}
                    onPress={() => navigation?.navigate("SignInScreen")}
                  >
                    Log In
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      <FilePickerPopup
        visible={showFilePicker}
        onClose={() => setShowFilePicker(false)}
        onCameraPress={handleCameraCapture}
        onGalleryPress={handleGallerySelection}
        onDocumentPress={handleDocumentSelection}
      />
    </View>
  );
};

export default SignupScreen;
