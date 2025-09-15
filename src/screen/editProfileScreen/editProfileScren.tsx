import React, { useState } from "react";
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

interface EditProfileScreenProps {
  navigation?: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const [fullName, setFullName] = useState("Mike Hussey");
  const [email, setEmail] = useState("mike.hussey@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("703-701-9964");
  const [phoneCode, setPhoneCode] = useState("+62");
  const [dateOfBirth, setDateOfBirth] = useState("09/09/1990");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleEditProfilePicture = () => {
    console.log("Profile picture edit pressed");
  };

  const handleDocumentUpload = () => {
    console.log("Document upload pressed");
  };

  const handleSaveAndUpdate = () => {
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError(true);
      hasError = true;
    } else {
      setFullNameError(false);
    }

    if (!email.trim() || !email.includes("@")) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!phoneNumber.trim()) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (!dateOfBirth.trim()) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }

    if (!hasError) {
      Alert.alert("Success", "Profile updated successfully!");
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
                leftImage={<CalendarIcon />}
                style={styles.inputField}
              />
              <Text style={styles.documentLabel}>Upload Document</Text>
              <View style={styles.documentContainer}>
                <View style={styles.documentThumbnail}>
                  <View style={styles.documentImage}>
                    {documentImage ? (
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
              </View>
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
    </SafeAreaView>
  );
};

export default EditProfileScreen;
