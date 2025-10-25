import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import { CustomeTextInput } from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import DetailsInput from "../../../../components/DetailsInput";
import { colors } from "../../../../utilis/colors";
import * as appConstant from "../../../../utilis/appConstant";
import {
  createHelpSupportData,
  onCreateHelpSupport,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
import styles from "./userHelpSupportStyle";
import EmailIcon from "../../../../assets/svg/emailIcon";
import NameIcon from "../../../../assets/svg/nameIcon";
interface UserHelpSupportProps {
  navigation?: any;
}

const UserHelpSupport: React.FC<UserHelpSupportProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { createHelpSupport, createHelpSupportErr, loader } = useSelector(
    (state: any) => state.auth
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      description: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Description is optional, no validation needed

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(
        onCreateHelpSupport({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          description: formData.description.trim(),
          userType: 'user' // Indicate this is from user side
        })
      );
    }
  };

  // Handle API responses
  useEffect(() => {
    if (createHelpSupport) {
      console.log("createHelpSupport", createHelpSupport);
      showToast("success", "Your support request has been submitted successfully!");
      dispatch(createHelpSupportData(""));
      navigation?.goBack();
    }
  }, [createHelpSupport]);

  useEffect(() => {
    if (createHelpSupportErr) {
      console.log("createHelpSupportErr", createHelpSupportErr);
      showToast(
        "error",
        "Failed to submit your support request. Please try again."
      );
    }
  }, [createHelpSupportErr]);

  return (
    <SafeAreaWrapper
      backgroundColor={colors.gradient_dark_purple}
      statusBarStyle="light-content"
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        style={styles.container}
      >
        <View style={styles.header}>
          <BackButton
            navigation={navigation}
            onBackPress={() => navigation?.goBack()}
          />
          <Text style={styles.headerTitle}>Help and Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <CustomeTextInput
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  error={errors.fullName}
                  leftIcon={<NameIcon width={20} height={20} color={colors.gray} />}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <CustomeTextInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  error={errors.email}
                  keyboardType="email-address"
                  leftIcon={<EmailIcon width={20} height={20} color={colors.gray} />}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <DetailsInput
                  placeholder="Enter here"
                  value={formData.description}
                  onChangeText={(value) => handleInputChange("description", value)}
                  error={errors.description}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>


              <View style={styles.buttonContainer}>
                <Buttons
                  title="Submit"
                  onPress={handleSubmit}
                  loading={loader}
                  disabled={loader}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default UserHelpSupport;
