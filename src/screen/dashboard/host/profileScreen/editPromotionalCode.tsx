// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useDispatch, useSelector } from "react-redux";
// import { colors } from "../../../../utilis/colors";
// import LinearGradient from "react-native-linear-gradient";
// import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
// import { BackButton } from "../../../../components/BackButton";
// import {
//   CustomeTextInput,
//   DatePickerInput,
// } from "../../../../components/textinput";
// import { Buttons } from "../../../../components/buttons";
// import CalendarIcon from "../../../../assets/svg/calendarIcon";
// import DetailsInput from "../../../../components/DetailsInput";
// import {
//   editPromoCodeData,
//   onEditPromoCode,
// } from "../../../../redux/auth/actions";
// import { showToast } from "../../../../utilis/toastUtils";
// import styles from "./editPromotionalCodeStyle";

// interface EditPromotionalCodeProps {
//   navigation?: any;
//   route?: any;
// }

// const EditPromotionalCode: React.FC<EditPromotionalCodeProps> = ({
//   navigation,
//   route,
// }) => {
//   const dispatch = useDispatch();
//   const { editPromoCode, editPromoCodeErr, loader } = useSelector(
//     (state: any) => state.auth
//   );

//   // Get the promotional code data from route params
//   const promoCodeData = route?.params?.promoCode || {};

//   const [formData, setFormData] = useState({
//     id: promoCodeData._id || promoCodeData.id || "",
//     promotionalCode: promoCodeData.code || "",
//     description: promoCodeData.description || "",
//     startDate: promoCodeData.startDate || "",
//     endDate: promoCodeData.endDate || "",
//     discount: promoCodeData.discount?.toString() || "",
//     status: promoCodeData.status || "active",
//   });

//   const [errors, setErrors] = useState({
//     promotionalCode: false,
//     startDate: false,
//     endDate: false,
//     discount: false,
//   });

//   const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
//     "percentage"
//   );
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
//     "start"
//   );

//   // Handle successful edit
//   useEffect(() => {
//     if (editPromoCode) {
//       if (editPromoCode.status === 1 || editPromoCode.status === true) {
//         showToast("success", "Promotional code updated successfully!");

//         setTimeout(() => {
//           setFormData({
//             id: "",
//             promotionalCode: "",
//             description: "",
//             startDate: "",
//             endDate: "",
//             discount: "",
//             status: "active",
//           });
//           navigation?.goBack();
//         }, 1500);
//       } else {
//         showToast(
//           "error",
//           editPromoCode.message ||
//             "Failed to update promotional code. Please try again."
//         );
//       }
//     }
//     dispatch(editPromoCodeData(""));
//   }, [editPromoCode, navigation]);

//   const handleBackPress = () => {
//     navigation?.goBack();
//   };

//   const handleInputChange = (field: string, value: string) => {
//     // For discount field, only allow numbers
//     if (field === "discount") {
//       // Remove any non-numeric characters
//       const numericValue = value.replace(/[^0-9]/g, "");
//       // Limit to 3 digits (0-100%)
//       const limitedValue =
//         numericValue.length > 3 ? numericValue.slice(0, 3) : numericValue;
//       setFormData((prev) => ({ ...prev, [field]: limitedValue }));
//     } else {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//     }

//     if (errors[field as keyof typeof errors]) {
//       setErrors((prev) => ({ ...prev, [field]: false }));
//     }
//   };

//   const handleDateSelect = (field: "startDate" | "endDate", date: string) => {
//     setFormData((prev) => ({ ...prev, [field]: date }));
//     setErrors((prev) => ({ ...prev, [field]: false }));
//   };

//   const validateForm = () => {
//     const discountValue = parseInt(formData.discount);
//     const newErrors = {
//       promotionalCode: !formData.promotionalCode.trim(),
//       startDate: !formData.startDate.trim(),
//       endDate: !formData.endDate.trim(),
//       discount:
//         !formData.discount.trim() ||
//         isNaN(discountValue) ||
//         discountValue < 1 ||
//         discountValue > 100,
//     };

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Format dates to YYYY-MM-DD format for API
//       const formatDateForAPI = (dateStr: string) => {
//         if (!dateStr) return "";

//         try {
//           // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
//           if (dateStr.includes("/")) {
//             const [day, month, year] = dateStr.split("/");
//             return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//           }

//           // If date is in ISO format, extract just the date part
//           if (dateStr.includes("T")) {
//             const date = new Date(dateStr);
//             const year = date.getFullYear();
//             const month = (date.getMonth() + 1).toString().padStart(2, "0");
//             const day = date.getDate().toString().padStart(2, "0");
//             return `${year}-${month}-${day}`;
//           }

//           // If already in YYYY-MM-DD format, return as is
//           if (dateStr.includes("-") && dateStr.length === 10) {
//             return dateStr;
//           }

//           return dateStr;
//         } catch (error) {
//           return dateStr;
//         }
//       };

//       const editData = {
//         id: formData.id,
//         code: formData.promotionalCode,
//         description: formData.description,
//         startDate: formatDateForAPI(formData.startDate),
//         endDate: formatDateForAPI(formData.endDate),
//         discount: parseInt(formData.discount),
//         status: formData.status,
//       };

//       dispatch(onEditPromoCode(editData));
//     } else {
//       const discountValue = parseInt(formData.discount);
//       if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
//         showToast("error", "Please enter a valid discount between 1-100%");
//       } else {
//         showToast("error", "Please fill in all required fields");
//       }
//     }
//   };

//   const handleDiscountTypeChange = (type: "percentage" | "fixed") => {
//     setDiscountType(type);
//   };

//   const triggerDatePicker = (mode: "start" | "end") => {
//     setDatePickerMode(mode);
//     setShowDatePicker(true);
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     if (Platform.OS === "android") {
//       setShowDatePicker(false);
//     }

//     if (selectedDate) {
//       const day = selectedDate.getDate().toString().padStart(2, "0");
//       const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
//       const year = selectedDate.getFullYear();
//       const formattedDate = `${day}/${month}/${year}`;

//       if (datePickerMode === "start") {
//         handleInputChange("startDate", formattedDate);
//       } else {
//         handleInputChange("endDate", formattedDate);
//       }
//     }
//   };

//   // Helper function to get date for date picker
//   const getDateForPicker = (dateStr: string) => {
//     if (!dateStr) return new Date();

//     try {
//       // If date is in DD/MM/YYYY format
//       if (dateStr.includes("/")) {
//         const [day, month, year] = dateStr.split("/");
//         return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
//       }

//       // If date is in ISO format
//       if (dateStr.includes("T")) {
//         return new Date(dateStr);
//       }

//       // If date is in YYYY-MM-DD format
//       if (dateStr.includes("-")) {
//         return new Date(dateStr);
//       }

//       return new Date();
//     } catch (error) {
//       return new Date();
//     }
//   };

//   // Convert API date format to display format
//   const convertDateForDisplay = (dateStr: string) => {
//     if (!dateStr) return "";

//     try {
//       // Handle ISO date format (2025-10-10T00:00:00.000Z)
//       if (dateStr.includes("T") && dateStr.includes("Z")) {
//         const date = new Date(dateStr);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0");
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//       }

//       // Handle YYYY-MM-DD format
//       if (dateStr.includes("-") && dateStr.length === 10) {
//         const [year, month, day] = dateStr.split("-");
//         return `${day}/${month}/${year}`;
//       }

//       // If already in DD/MM/YYYY format, return as is
//       if (dateStr.includes("/") && dateStr.length === 10) {
//         return dateStr;
//       }

//       return dateStr;
//     } catch (error) {
//       return dateStr;
//     }
//   };

//   // Initialize form data with converted dates
//   useEffect(() => {
//     if (promoCodeData.startDate) {
//       setFormData((prev) => ({
//         ...prev,
//         startDate: convertDateForDisplay(promoCodeData.startDate),
//       }));
//     }
//     if (promoCodeData.endDate) {
//       setFormData((prev) => ({
//         ...prev,
//         endDate: convertDateForDisplay(promoCodeData.endDate),
//       }));
//     }
//   }, [promoCodeData]);

//   return (
//     <SafeAreaWrapper
//       backgroundColor={colors.profileCardBackground}
//       statusBarStyle="light-content"
//       statusBarBackgroundColor={colors.profileCardBackground}
//     >
//       <LinearGradient
//         colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.container}
//       >
//         <View style={styles.header}>
//           <BackButton navigation={navigation} onBackPress={handleBackPress} />
//           <Text style={styles.headerTitle}>Edit Promotional</Text>
//           <View style={styles.headerSpacer} />
//         </View>

//         <KeyboardAvoidingView
//           style={styles.scrollContainer}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//         >
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.formContainer}>
//               <View style={styles.inputContainer}>
//                 <CustomeTextInput
//                   label="Promotional Code *"
//                   placeholder="Enter promotional code"
//                   value={formData.promotionalCode}
//                   onChangeText={(text) =>
//                     handleInputChange("promotionalCode", text)
//                   }
//                   error={errors.promotionalCode}
//                   message="Promotional code is required"
//                   kType="default"
//                   maxLength={20}
//                   leftImage={null}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <DetailsInput
//                   label="Description"
//                   placeholder="Enter here"
//                   value={formData.description}
//                   onChangeText={(text) =>
//                     handleInputChange("description", text)
//                   }
//                   error={false}
//                   message=""
//                   required={false}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <DatePickerInput
//                   label="Start Date *"
//                   placeholder="Select date"
//                   value={formData.startDate}
//                   onChangeText={(text) => handleInputChange("startDate", text)}
//                   error={errors.startDate}
//                   message={errors.startDate ? "Start date is required" : ""}
//                   leftImage=""
//                   style={styles.datePickerWrapper}
//                 />
//                 <TouchableOpacity
//                   style={styles.datePickerRightIcon}
//                   onPress={() => triggerDatePicker("start")}
//                 >
//                   <CalendarIcon />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.inputContainer}>
//                 <DatePickerInput
//                   label="End Date *"
//                   placeholder="Select date"
//                   value={formData.endDate}
//                   onChangeText={(text) => handleInputChange("endDate", text)}
//                   error={errors.endDate}
//                   message={errors.endDate ? "End date is required" : ""}
//                   leftImage=""
//                   style={styles.datePickerWrapper}
//                 />
//                 <TouchableOpacity
//                   style={styles.datePickerRightIcon}
//                   onPress={() => triggerDatePicker("end")}
//                 >
//                   <CalendarIcon />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.discountHeader}>
//                   <Text style={styles.DiscountText}>
//                     Discount (%)<Text style={styles.requiredText}> *</Text>
//                   </Text>
//                 </View>
//                 <View style={styles.discountInputContainer}>
//                   <CustomeTextInput
//                     label=""
//                     placeholder="Enter Discount"
//                     value={formData.discount}
//                     onChangeText={(text) => handleInputChange("discount", text)}
//                     error={errors.discount}
//                     message={
//                       errors.discount
//                         ? "Please enter a valid discount between 1-100%"
//                         : ""
//                     }
//                     kType="numeric"
//                     maxLength={3}
//                     leftImage={null}
//                   />
//                 </View>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         <View style={styles.submitButtonContainer}>
//           <Buttons
//             title={loader ? "Updating..." : "Update"}
//             onPress={handleSubmit}
//             style={styles.submitButton}
//             disabled={loader}
//           />
//         </View>

//         {showDatePicker && (
//           <DateTimePicker
//             value={
//               datePickerMode === "start"
//                 ? getDateForPicker(formData.startDate)
//                 : getDateForPicker(formData.endDate)
//             }
//             mode="date"
//             display={Platform.OS === "ios" ? "spinner" : "default"}
//             onChange={handleDateChange}
//             textColor={colors.white}
//             themeVariant="dark"
//           />
//         )}
//       </LinearGradient>
//     </SafeAreaWrapper>
//   );
// };

// export default EditPromotionalCode;
import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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
import {
  editPromoCodeData,
  onEditPromoCode,
} from "../../../../redux/auth/actions";
import { showToast } from "../../../../utilis/toastUtils";
import styles from "./editPromotionalCodeStyle";

interface EditPromotionalCodeProps {
  navigation?: any;
  route?: any;
}

const EditPromotionalCode: React.FC<EditPromotionalCodeProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const { editPromoCode, editPromoCodeErr, loader } = useSelector(
    (state: any) => state.auth
  );

  // Get the promotional code data from route params
  const promoCodeData = route?.params?.promoCode || {};

  const [formData, setFormData] = useState({
    id: promoCodeData._id || promoCodeData.id || "",
    promotionalCode: promoCodeData.code || "",
    description: promoCodeData.description || "",
    startDate: promoCodeData.startDate || "",
    endDate: promoCodeData.endDate || "",
    discount: promoCodeData.discount?.toString() || "",
    status: promoCodeData.status || "active",
  });

  const [errors, setErrors] = useState({
    promotionalCode: false,
    startDate: false,
    endDate: false,
    discount: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">("start");

  // Handle successful edit
  useEffect(() => {
    if (editPromoCode) {
      if (editPromoCode.status === 1 || editPromoCode.status === true) {
        showToast("success", "Promotional code updated successfully!");

        setTimeout(() => {
          setFormData({
            id: "",
            promotionalCode: "",
            description: "",
            startDate: "",
            endDate: "",
            discount: "",
            status: "active",
          });
          navigation?.goBack();
        }, 1500);
      } else {
        showToast(
          "error",
          editPromoCode.message ||
            "Failed to update promotional code. Please try again."
        );
      }
    }
    dispatch(editPromoCodeData(""));
  }, [editPromoCode, navigation]);

  const handleBackPress = () => {
    navigation?.goBack();
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

      const editData = {
        id: formData.id,
        code: formData.promotionalCode,
        description: formData.description,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        discount: parseInt(formData.discount),
        status: formData.status,
      };

      dispatch(onEditPromoCode(editData));
    } else {
      const discountValue = parseInt(formData.discount);
      if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
        showToast("error", "Please enter a valid discount between 1-100%");
      } else {
        showToast("error", "Please fill in all required fields");
      }
    }
  };

  // Date picker trigger function - matching the working pattern
  const triggerDatePicker = (mode: "start" | "end") => {
    console.log("Calendar icon clicked for", mode, "date");
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  // Date change handler - matching the working pattern from AddClubDetailScreen
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

  // Helper function to get date for date picker
  const getDateForPicker = (dateStr: string) => {
    if (!dateStr) return new Date();

    try {
      // If date is in DD/MM/YYYY format
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      // If date is in ISO format
      if (dateStr.includes("T")) {
        return new Date(dateStr);
      }

      // If date is in YYYY-MM-DD format
      if (dateStr.includes("-")) {
        return new Date(dateStr);
      }

      return new Date();
    } catch (error) {
      return new Date();
    }
  };

  // Get minimum date for date picker
  const getMinimumDate = () => {
    try {
      // For end date, minimum date should be the start date (if set)
      if (datePickerMode === "end" && formData.startDate) {
        return getDateForPicker(formData.startDate);
      }
      // For start date or when no start date is set, allow from today
      return new Date();
    } catch (error) {
      return new Date();
    }
  };

  // Convert API date format to display format
  const convertDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";

    try {
      // Handle ISO date format (2025-10-10T00:00:00.000Z)
      if (dateStr.includes("T") && dateStr.includes("Z")) {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Handle YYYY-MM-DD format
      if (dateStr.includes("-") && dateStr.length === 10) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
      }

      // If already in DD/MM/YYYY format, return as is
      if (dateStr.includes("/") && dateStr.length === 10) {
        return dateStr;
      }

      return dateStr;
    } catch (error) {
      return dateStr;
    }
  };


  // Initialize form data with converted dates
  useEffect(() => {
    if (promoCodeData.startDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: convertDateForDisplay(promoCodeData.startDate),
      }));
    }
    if (promoCodeData.endDate) {
      setFormData((prev) => ({
        ...prev,
        endDate: convertDateForDisplay(promoCodeData.endDate),
      }));
    }
  }, [promoCodeData]);

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
            title={loader ? "Updating..." : "Update"}
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loader}
          />
        </View>

        {showDatePicker && (
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
        )}
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default EditPromotionalCode;