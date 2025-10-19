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
import styles from "./helpSupportStyle";
import EmailIcon from "../../../../assets/svg/emailIcon";
import NameIcon from "../../../../assets/svg/nameIcon";

interface HelpSupportProps {
  navigation?: any;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ navigation }) => {
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
        })
      );
    }
  };

  // Handle API responses
  useEffect(() => {
    if (createHelpSupport) {
      showToast(
        "success",
        "Your support request has been submitted successfully. We'll get back to you soon!"
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        description: "",
      });
      setErrors({
        fullName: "",
        email: "",
        description: "",
      });

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        navigation?.goBack();
      }, 1500);
    }
    console.log("createHelpSupport", createHelpSupport);
    dispatch(createHelpSupportData(""));
  }, [createHelpSupport]);

  useEffect(() => {
    if (createHelpSupportErr) {
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
                <CustomeTextInput
                  label="Full Name *"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  error={!!errors.fullName}
                  message={errors.fullName}
                  kType={appConstant.keyboardType.default as any}
                  maxLength={50}
                  editable={!loader}
                  leftImage={<NameIcon />}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Email *"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  error={!!errors.email}
                  message={errors.email}
                  kType={appConstant.keyboardType.email_address as any}
                  maxLength={80}
                  editable={!loader}
                  leftImage={<EmailIcon />}
                />
              </View>

              <View style={styles.inputContainer}>
                <DetailsInput
                  label="Description"
                  placeholder="Enter here"
                  value={formData.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                  error={!!errors.description}
                  message={errors.description}
                  required={false}
                />
              </View>

              {/* Move Submit button inside ScrollView */}
              <View style={styles.buttonContainer}>
                <Buttons
                  title={loader ? "Submitting..." : "Submit"}
                  onPress={handleSubmit}
                  disabled={loader}
                  style={styles.submitButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default HelpSupport;
