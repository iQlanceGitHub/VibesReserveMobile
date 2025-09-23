import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { CustomeTextInput } from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import DetailsInput from "../../../../components/DetailsInput";
import BackIcon from "../../../../assets/svg/backIcon";
import styles from "./helpAndSupportStyle";

interface HelpAndSupportScreenProps {
  navigation?: any;
}

const HelpAndSupportScreen: React.FC<HelpAndSupportScreenProps> = ({
  navigation,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    description: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: false,
      email: false,
      description: false,
    };

    const newErrorMessages = {
      fullName: "",
      email: "",
      description: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = true;
      newErrorMessages.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = true;
      newErrorMessages.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = true;
      newErrorMessages.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = true;
      newErrorMessages.email = "Please enter a valid email address";
    }

    if (!formData.description.trim()) {
      newErrors.description = true;
      newErrorMessages.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = true;
      newErrorMessages.description =
        "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
      setErrorMessages((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Success",
        "Your inquiry has been submitted successfully. We'll get back to you soon!",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                fullName: "",
                email: "",
                description: "",
              });
              navigation?.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit your inquiry. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.profileCardBackground}
      statusBarStyle="light-content"
      statusBarBackgroundColor={colors.profileCardBackground}
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress}>
              <View style={styles.backButtonCircle}>
                <BackIcon width={20} height={20} />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help and Support</Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Full Name*"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  error={errors.fullName}
                  message={errorMessages.fullName}
                  kType="default"
                  maxLength={50}
                  leftImage=""
                />
              </View>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Email*"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  error={errors.email}
                  message={errorMessages.email}
                  kType="email-address"
                  maxLength={80}
                  leftImage=""
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <DetailsInput
                  label="Description"
                  placeholder="Enter here"
                  value={formData.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                  error={errors.description}
                  message={errorMessages.description}
                  required={true}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Buttons
              title={"Submit"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default HelpAndSupportScreen;
