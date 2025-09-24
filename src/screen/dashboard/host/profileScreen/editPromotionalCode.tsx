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
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import {
  CustomeTextInput,
  DatePickerInput,
} from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import CalendarIcon from "../../../../assets/svg/calendarIcon";
import DetailsInput from "../../../../components/DetailsInput";
import styles from "./editPromotionalStyle";

interface EditPromotionalCodeProps {
  navigation?: any;
}

const EditPromotionalCode: React.FC<EditPromotionalCodeProps> = ({
  navigation,
}) => {
  const [formData, setFormData] = useState({
    promotionalCode: "",
    description: "",
    startDate: "",
    endDate: "",
    discount: "",
  });

  const [errors, setErrors] = useState({
    promotionalCode: false,
    startDate: false,
    endDate: false,
    discount: false,
  });

  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
    "start"
  );

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDateSelect = (field: "startDate" | "endDate", date: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      promotionalCode: !formData.promotionalCode.trim(),
      startDate: !formData.startDate.trim(),
      endDate: !formData.endDate.trim(),
      discount: !formData.discount.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert("Success", "Promotional code updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation?.goBack(),
        },
      ]);
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const handleDiscountTypeChange = (type: "percentage" | "fixed") => {
    setDiscountType(type);
  };

  const triggerDatePicker = (mode: "start" | "end") => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

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
        handleInputChange("startDate", formattedDate);
      } else {
        handleInputChange("endDate", formattedDate);
      }
    }
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
        <View style={styles.header}>
          <BackButton navigation={navigation} onBackPress={handleBackPress} />
          <Text style={styles.headerTitle}>Edit Promotional</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.scrollContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Promotional Code *"
                  placeholder="Enter promotional code"
                  value={formData.promotionalCode}
                  onChangeText={(text) =>
                    handleInputChange("promotionalCode", text)
                  }
                  error={errors.promotionalCode}
                  message="Promotional code is required"
                  kType="default"
                  maxLength={20}
                  leftImage={null}
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
                  error={false}
                  message=""
                  required={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <DatePickerInput
                  label="Start Date *"
                  placeholder="Select date"
                  value={formData.startDate}
                  onChangeText={(text) => handleInputChange("startDate", text)}
                  error={errors.startDate}
                  message={errors.startDate ? "Start date is required" : ""}
                  leftImage=""
                  style={styles.datePickerWrapper}
                />
                <TouchableOpacity
                  style={styles.datePickerRightIcon}
                  onPress={() => triggerDatePicker("start")}
                >
                  <CalendarIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <DatePickerInput
                  label="End Date *"
                  placeholder="Select date"
                  value={formData.endDate}
                  onChangeText={(text) => handleInputChange("endDate", text)}
                  error={errors.endDate}
                  message={errors.endDate ? "End date is required" : ""}
                  leftImage=""
                  style={styles.datePickerWrapper}
                />
                <TouchableOpacity
                  style={styles.datePickerRightIcon}
                  onPress={() => triggerDatePicker("end")}
                >
                  <CalendarIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.discountHeader}>
                <Text style={styles.DiscountText}>
                  Discount (%)<Text style={styles.requiredText}> *</Text>
                </Text>
              </View>
              <CustomeTextInput
                label=""
                placeholder="Add discount"
                value={formData.discount}
                onChangeText={(text) => handleInputChange("discount", text)}
                error={errors.discount}
                message="Discount is required"
                kType="numeric"
                maxLength={3}
                leftImage={null}
                style={{ marginBottom: 0 }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.submitButtonContainer}>
          <Buttons
            title="Update"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={
              datePickerMode === "start"
                ? formData.startDate
                  ? new Date(formData.startDate.split("/").reverse().join("-"))
                  : new Date()
                : formData.endDate
                ? new Date(formData.endDate.split("/").reverse().join("-"))
                : new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            textColor={colors.white}
            themeVariant="dark"
          />
        )}
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default EditPromotionalCode;
