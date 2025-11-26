import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
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
import { showToast } from "../../../../utilis/toastUtils";
import {
  createPromoCodeData,
  onCreatePromoCode,
} from "../../../../redux/auth/actions";
import styles from "./addPromotionalCodeStyle";

interface AddPromotionalCodeProps {
  navigation?: any;
}

const AddPromotionalCode: React.FC<AddPromotionalCodeProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { createPromoCode, createPromoCodeErr, loader } = useSelector(
    (state: any) => state.auth
  );
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

  // Reset form when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Add Promotional Code screen focused - resetting form');
      setFormData({
        promotionalCode: "",
        description: "",
        startDate: "",
        endDate: "",
        discount: "",
      });
      setErrors({
        promotionalCode: false,
        startDate: false,
        endDate: false,
        discount: false,
      });
      setDiscountType("percentage");
      setShowDatePicker(false);
    }, [])
  );

  // Handle successful creation
  useEffect(() => {
    if (createPromoCode) {
      console.log("CREATE PROMO CODE: Response received:", createPromoCode);

      if (createPromoCode.status === 1 || createPromoCode.status === true) {
        showToast("success", "Promotional code created successfully!");

        // Navigate back after a short delay to show the toast
        setTimeout(() => {
          navigation?.goBack();
        }, 1500);
      } else {
        showToast(
          "error",
          createPromoCode.message ||
            "Failed to create promotional code. Please try again."
        );
      }
    }
    dispatch(createPromoCodeData(""));
  }, [createPromoCode, navigation]);

  // Handle creation error
  useEffect(() => {
    if (createPromoCodeErr) {
      showToast(
        "error",
        createPromoCodeErr.message ||
          "Failed to create promotional code. Please try again."
      );
    }
  }, [createPromoCodeErr]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  // Date validation function
  const validateDates = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return true;

    try {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };

      const startDate = parseDate(startDateStr);
      const endDate = parseDate(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      return endDate >= startDate;
    } catch (error) {
      console.log("Error validating dates:", error);
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // For discount field, only allow numbers
    if (field === "discount") {
      // Remove any non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");
      // Limit to 3 digits (0-100%)
      const limitedValue =
        numericValue.length > 3 ? numericValue.slice(0, 3) : numericValue;
      setFormData((prev) => ({ ...prev, [field]: limitedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const discountValue = parseInt(formData.discount);
    const newErrors = {
      promotionalCode: !formData.promotionalCode.trim(),
      startDate: !formData.startDate.trim(),
      endDate: !formData.endDate.trim(),
      discount:
        !formData.discount.trim() ||
        isNaN(discountValue) ||
        discountValue < 1 ||
        discountValue > 100,
    };

    // Validate date constraints
    if (formData.startDate.trim() && formData.endDate.trim() && !validateDates(formData.startDate, formData.endDate)) {
      showToast("error", "End date must be same or after start date");
      setErrors((prev) => ({ ...prev, endDate: true }));
      return false;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Format dates to YYYY-MM-DD format for API
      const formatDateForAPI = (dateStr: string) => {
        if (!dateStr) return "";

        try {
          // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
          if (dateStr.includes("/")) {
            const [day, month, year] = dateStr.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }

          // If date is in ISO format, extract just the date part
          if (dateStr.includes("T")) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
          }

          // If already in YYYY-MM-DD format, return as is
          if (dateStr.includes("-") && dateStr.length === 10) {
            return dateStr;
          }

          return dateStr;
        } catch (error) {
          return dateStr;
        }
      };

      const createData = {
        code: formData.promotionalCode,
        description: formData.description,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        discount: parseInt(formData.discount),
      };

      dispatch(onCreatePromoCode(createData));
    } else {
      const discountValue = parseInt(formData.discount);
      if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
        showToast("error", "Please enter a valid discount between 1-100%");
      } else {
        showToast("error", "Please fill in all required fields");
      }
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
        setFormData(prev => ({ ...prev, startDate: formattedDate }));
        // Clear start date error when start date changes
        if (errors.startDate) {
          setErrors((prev) => ({ ...prev, startDate: false }));
        }
        // Clear end date error when start date changes
        if (errors.endDate) {
          setErrors((prev) => ({ ...prev, endDate: false }));
        }
        // Validate dates if end date is already set
        if (formData.endDate && !validateDates(formattedDate, formData.endDate)) {
          setErrors((prev) => ({ ...prev, endDate: true }));
          showToast("error", "End date must be same or after start date");
        }
      } else {
        setFormData(prev => ({ ...prev, endDate: formattedDate }));
        // Validate dates if start date is already set
        if (formData.startDate && !validateDates(formData.startDate, formattedDate)) {
          setErrors((prev) => ({ ...prev, endDate: true }));
          showToast("error", "End date must be same or after start date");
        } else {
          // Clear error if validation passes
          setErrors((prev) => ({ ...prev, endDate: false }));
        }
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
          <Text style={styles.headerTitle}>Add Promotional</Text>
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
                  onChangeText={(text) => {
                    console.log("Start date selected:", text);
                    setFormData(prev => ({ ...prev, startDate: text }));
                    // Clear errors when user types
                    if (errors.startDate) {
                      setErrors((prev) => ({ ...prev, startDate: false }));
                    }
                    // Validate dates if end date is set
                    if (formData.endDate && !validateDates(text, formData.endDate)) {
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
                  style={styles.datePickerWrapper}
                  allowFutureDates={true}
                  minDate={new Date()}
                  maxDate={new Date(2035, 11, 31)}
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
                  onChangeText={(text) => {
                    console.log("End date selected:", text);
                    setFormData(prev => ({ ...prev, endDate: text }));
                    // Clear errors when user types
                    if (errors.endDate) {
                      setErrors((prev) => ({ ...prev, endDate: false }));
                    }
                    // Validate dates if start date is set
                    if (formData.startDate && !validateDates(formData.startDate, text)) {
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
                  style={styles.datePickerWrapper}
                  allowFutureDates={true}
                  minDate={
                    formData.startDate
                      ? (() => {
                          try {
                            const [day, month, year] = formData.startDate.split("/");
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
                  style={styles.datePickerRightIcon}
                  onPress={() => triggerDatePicker("end")}
                >
                  <CalendarIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.discountHeader}>
                  <Text style={styles.DiscountText}>
                    Discount (%)<Text style={styles.requiredText}> *</Text>
                  </Text>
                </View>
                <View style={styles.discountInputContainer}>
                  <CustomeTextInput
                    label=""
                    placeholder="Enter Discount"
                    value={formData.discount}
                    onChangeText={(text) => handleInputChange("discount", text)}
                    error={errors.discount}
                    message={
                      errors.discount
                        ? "Please enter a valid discount between 1-100%"
                        : ""
                    }
                    kType="numeric"
                    maxLength={3}
                    leftImage={null}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.submitButtonContainer}>
          <Buttons
            title={loader ? "Creating..." : "Submit"}
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loader}
          />
        </View>

        {showDatePicker && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>
                    Select {datePickerMode === "start" ? "Start" : "End"} Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalDoneButton}
                  >
                    <Text style={styles.modalDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={(() => {
                    try {
                      if (datePickerMode === "start" && formData.startDate) {
                        const [day, month, year] = formData.startDate.split("/");
                        return new Date(
                          parseInt(year),
                          parseInt(month) - 1,
                          parseInt(day)
                        );
                      } else if (datePickerMode === "end" && formData.endDate) {
                        const [day, month, year] = formData.endDate.split("/");
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
                      if (datePickerMode === "end" && formData.startDate) {
                        const [day, month, year] = formData.startDate.split("/");
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
              </View>
            </View>
          </Modal>
        )}
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default AddPromotionalCode;
