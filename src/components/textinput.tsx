import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardTypeOptions,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  PixelRatio,
  Platform,
  TextInput as RNTextInput,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HelperText, TextInput } from "react-native-paper";
// import { parentStyles, textstyles } from "../../../utils/schema/commonStyles";

import { shallowEqual } from "react-redux";
import { colors } from "../utilis/colors";
import { keyboardType } from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";
import EyeIcon from "../assets/svg/eyeIcon";
import EyeClosedIcon from "../assets/svg/eyeClosedIcon";
import ErrorIcon from "../assets/svg/errorIcon";
import ArrowDownIcon from "../assets/svg/arrowDownIcon";
import textinputStyles from "./textinputStyles";
import {
  CountryItem,
  CountryPicker,
  countryCodes,
} from "react-native-country-codes-picker";
import {
  CountryCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import CloseIcon from "../assets/svg/closeIcon";

const getCountryISOFromDialCode = (dialCode: string): string => {
  const match = countryCodes.find((c) => c.dial_code === dialCode);
  return match?.code || "US";
};

interface CustomTextInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  style?: object;
  message: string;
  leftImage: string | React.ReactNode;
  rightImageShow?: boolean;
}

export const CustomeTextInput: React.FC<CustomTextInputProps> = ({
  editable,
  error,
  label,
  message,
  onChangeText,
  placeholder,
  style,
  value,
  kType,
  maxLength,
  multiline,
  leftImage,
  rightImageShow = false,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View style={{ position: "relative" }}>
        {leftImage && typeof leftImage !== "string" && (
          <View
            style={{
              position: "absolute",
              left: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leftImage}
          </View>
        )}
        <TextInput
          editable={editable}
          theme={{ colors: { text: colors.darkGray } }}
          autoCorrect={false}
          value={value}
          mode="outlined"
          maxLength={kType == keyboardType.email_address ? 80 : maxLength}
          multiline={multiline}
          keyboardType={
            Platform.OS === "ios" ? "ascii-capable" : "visible-password"
          }
          placeholder={
            kType == keyboardType.email_address
              ? "Enter your email"
              : placeholder
          }
          onChangeText={onChangeText}
          outlineColor={error == true ? colors.red : "#FFFFFF33"}
          activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
          cursorColor={colors.white}
          style={[
            {
              backgroundColor: "transparent",
              fontFamily: fonts.reguler,
              color: colors.white,
              fontSize: 15,
              paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
            },
            style,
          ]}
          placeholderTextColor={colors.textColor}
          outlineStyle={{
            borderRadius: 90,
            borderWidth: error == true ? 1 : 1,
          }}
          contentStyle={{
            color: colors.white,
            fontFamily: fonts.reguler,
            fontSize: 15,
          }}
          left={
            leftImage && typeof leftImage === "string" ? (
              <TextInput.Icon icon={leftImage} color={colors.white} />
            ) : undefined
          }
        // right={
        //   rightImageShow == true && (
        //     <TextInput.Icon
        //       icon={images.ic_arrow_down}
        //       size={15}
        //       color={colors.darkGray} // Add this line to set the color
        //     />
        //   )
        // }
        />
      </View>
      {error ? (
        <HelperText
          style={{
            color: colors.red,
            flex: 1,
          }}
          type="error"
          visible={error}
        >
          {message !== "" ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};
interface CustomPhoneNumberInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onPressPhoneCode: () => void;
  phoneCode?: string;
  style?: object;
  message: string;
}

export const CustomPhoneNumberInput: React.FC<CustomPhoneNumberInputProps> = ({
  editable,
  error,
  label,
  message,
  onChangeText,
  placeholder,
  style,
  value,
  kType,
  maxLength,
  multiline,
  onPressPhoneCode,
  phoneCode = "00",
}) => {
  const internalInputRef = useRef<RNTextInput>(null);
  return (
    <View style={[style]}>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          height: "100%",
          width: "20%",
          top: 30,
          justifyContent: "space-evenly",
        }}
      >
        <Pressable
          style={{
            alignItems: "center",
            height: "100%",
          }}
          onPress={onPressPhoneCode}
        >
          <View
            style={{
              flexDirection: "row",

              marginTop: 20,
            }}
          >
            <Text
              // style={[textstyles.medium, { fontSize: 15 }]}
              children={phoneCode}
            />
            {/* <Image
              style={{
                width: 12,
                marginLeft: phoneCode.length > 4 ? 2 : 5,
                resizeMode: "contain",
                alignSelf: "center",
                tintColor: colors.darkGray,
              }}
              source={images.ic_arrow_down}
            /> */}
          </View>
        </Pressable>
      </View>

      <TextInput
        ref={internalInputRef}
        mode="outlined"
        maxLength={12}
        // error={props.error}
        value={value}
        keyboardType="phone-pad"
        placeholder={placeholder}
        onChangeText={(data) => {
          onChangeText(data.replace(/[^0-9]/g, ""));
        }}
        outlineColor={error == true ? colors.red : "#FFFFFF33"}
        activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
        cursorColor={colors.white}
        style={{
          paddingLeft: "15%",
          backgroundColor: "transparent",
          fontFamily: fonts.medium,
          fontSize: 15,
        }}
        placeholderTextColor={colors.textColor}
        outlineStyle={{
          borderRadius: 90,
          borderWidth: error == true ? 1 : 1,
        }}
        contentStyle={{
          color: colors.white,
          fontFamily: fonts.reguler,
          fontSize: 15,
        }}
      />
      {error ? (
        <HelperText
          style={{
            color: colors.red,
            flex: 1,
          }}
          type="error"
          visible={error}
        >
          {message !== "" ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};

interface CustomPasswordTextInputProps {
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style: object;
  message: string;
  leftImage: string | React.ReactNode;
}

export const CustomePasswordTextInput: React.FC<
  CustomPasswordTextInputProps
> = ({
  error,
  label,
  maxLength,
  message,
  multiline,
  onChangeText,
  placeholder,
  style,
  value,
  kType = "default",
  leftImage,
}) => {
  const [secure, setSecure] = useState(true);
  const onEyePress = () => {
    setSecure(!secure);
  };
  return (
    <View>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View style={{ position: "relative" }}>
        {leftImage && typeof leftImage !== "string" && (
          <View
            style={{
              position: "absolute",
              left: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leftImage}
          </View>
        )}
        {value && value.length > 0 && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onEyePress}
          >
            {secure ? <EyeClosedIcon /> : <EyeIcon />}
          </TouchableOpacity>
        )}
        <TextInput
          secureTextEntry={secure}
          theme={{ colors: { text: colors.darkGray } }}
          autoCorrect={false}
          value={value}
          mode="outlined"
          maxLength={kType == keyboardType.email_address ? 80 : maxLength}
          multiline={multiline}
          keyboardType={kType}
          placeholder={
            kType == keyboardType.email_address
              ? "Enter your email"
              : placeholder
          }
          onChangeText={onChangeText}
          outlineColor={error == true ? colors.red : "#FFFFFF33"}
          activeOutlineColor={error == true ? colors.red : "#E2E4E9"}
          cursorColor={colors.white}
          style={[
            {
              backgroundColor: "transparent",
              fontFamily: fonts.reguler,
              color: colors.white,
              fontSize: 15,
              paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
            },
            style,
          ]}
          placeholderTextColor={colors.textColor}
          outlineStyle={{
            borderRadius: 90,
            borderWidth: error == true ? 1 : 1,
          }}
          contentStyle={{
            color: colors.white,
            fontFamily: fonts.reguler,
            fontSize: 15,
          }}
          // right={
          //   <TextInput.Icon
          //     icon={secure ? images.ic_close_eye : images.ic_open_eye}
          //     onPress={onEyePress}
          //   />
          // }
          left={
            leftImage && typeof leftImage === "string" ? (
              <TextInput.Icon
                icon={leftImage}
                onPress={() => console.log("")}
                color={colors.white}
              />
            ) : undefined
          }
        />
      </View>
      {error ? (
        <View style={textinputStyles.errorMessageContainer}>
          <ErrorIcon width={16} height={16} />
          <HelperText
            style={textinputStyles.errorMessageText}
            type="error"
            visible={error}
          >
            {message != "" ? `${message}` : `${label} field is required`}
          </HelperText>
        </View>
      ) : null}
    </View>
  );
};
interface CustomeSearchTextInputProps {
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  error: boolean;
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style: object;
  message: string;
  leftImage?: string | React.ReactNode;
  rightIcon?: React.ReactNode; // Added rightIcon prop
  secureTextEntry?: boolean; // Added secureTextEntry prop
}

export const CustomeSearchTextInput: React.FC<CustomeSearchTextInputProps> = ({
  error,
  label,
  maxLength,
  message,
  multiline,
  onChangeText,
  placeholder,
  style,
  value,
  kType = "default",
  leftImage,
  rightIcon,
  secureTextEntry = false, // Default to false
}) => {
  const [secure, setSecure] = useState(secureTextEntry);

  const onEyePress = () => {
    setSecure(!secure);
  };

  const handleClearText = () => {
    onChangeText(""); // Clear the text
  };

  return (
    <View>
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fonts.medium,
          marginBottom: 8,
        }}
      >
        {label.includes("(Optional)") ? (
          <>
            {label.replace(" (Optional)", "")}
            <Text style={{ color: "#868C98" }}> (Optional)</Text>
          </>
        ) : label.includes("*") ? (
          <>
            {label.replace(" *", "")}
            <Text style={{ color: "#868C98" }}> *</Text>
          </>
        ) : (
          label
        )}
      </Text>
      <View style={{ position: "relative" }}>
        {leftImage && typeof leftImage !== "string" && (
          <View
            style={{
              position: "absolute",
              left: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leftImage}
          </View>
        )}
        
        {/* Clear button - only show when there's text and no custom rightIcon */}
        {value && value.length > 0 && !rightIcon && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleClearText} // Use the clear function
          >
            <CloseIcon />
          </TouchableOpacity>
        )}
        
        {/* Custom right icon */}
        {rightIcon && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              top: 18,
              zIndex: 1,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleClearText} // Use the clear function
          >
            {rightIcon}
          </TouchableOpacity>
        )}
        
        <TextInput
          theme={{ colors: { text: colors.darkGray } }}
          value={value}
          mode="outlined"
          maxLength={maxLength}
          multiline={multiline}
          keyboardType={kType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          outlineColor={error ? colors.red : "#FFFFFF33"}
          activeOutlineColor={error ? colors.red : "#E2E4E9"}
          cursorColor={colors.white}
          secureTextEntry={secure} // Use the secure state
          style={[
            {
              backgroundColor: "transparent",
              fontFamily: fonts.reguler,
              color: colors.white,
              fontSize: 15,
              paddingLeft: leftImage && typeof leftImage !== "string" ? 30 : 15,
              paddingRight: (value && value.length > 0) || rightIcon ? 30 : 15, // Add right padding for icons
            },
            style,
          ]}
          placeholderTextColor={colors.textColor}
          outlineStyle={{
            borderRadius: 90,
            borderWidth: error ? 1 : 1,
          }}
          contentStyle={{
            color: colors.white,
            fontFamily: fonts.reguler,
            fontSize: 15,
          }}
          left={
            leftImage && typeof leftImage === "string" ? (
              <TextInput.Icon
                icon={leftImage}
                onPress={() => console.log("")}
                color={colors.white}
              />
            ) : undefined
          }
        />
      </View>
      {error ? (
        <HelperText style={{ color: colors.red }} type="error" visible={error}>
          {message !== "" ? `${message}` : `${label} field is required`}
        </HelperText>
      ) : null}
    </View>
  );
};

interface SearchBarTextInputProps {
  editable?: boolean;
  value: string;
  kType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;

  placeholder?: string;
  onChangeText: (text: string) => void;
  style?: object;
}

export const SearchBarTextInput: React.FC<SearchBarTextInputProps> = ({
  value,

  onChangeText,
  kType,
  maxLength,
  multiline,
  placeholder,
  style,
}) => {
  return (
    <View>
      <TextInput
        autoCorrect={false}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        keyboardType={kType}
        placeholder={placeholder}
        onChangeText={onChangeText}
        cursorColor={colors.primary_blue}
        style={[
          {
            backgroundColor: "#F2F2F2",
            fontFamily: fonts.reguler,
            color: colors.darkGray,
            fontSize: 14,
          },
          style,
        ]}
        placeholderTextColor={colors.darkGray}
        contentStyle={{
          color: colors.darkGray,
          fontFamily: fonts.reguler,
          fontSize: 14,
        }}
      />
    </View>
  );
};

// New Phone Number Input Component with Country Code Picker
interface PhoneNumberInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onCountryCodeChange?: (code: string) => void;
  error?: boolean;
  message?: string;
  style?: object;
  phoneCode?: string;
  phoneCodeFlag?: string;
  onPressPhoneCode?: () => void;
  validatePhone?: (isError: boolean) => void;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  placeholder = "Enter phone number",
  onChangeText,
  onCountryCodeChange,
  error = false,
  message = "",
  style,
  phoneCode = "+1",
  phoneCodeFlag = "🇺🇸",
  onPressPhoneCode,
  validatePhone,
}) => {
  const internalInputRef = useRef<RNTextInput>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState(phoneCode);
  const [selectedCodeFlag, setSelectedCodeFlag] = useState(phoneCodeFlag);
  const [phoneError, setPhoneError] = useState("");
  const [numberLength, setNumberLength] = useState(14);
  const [pickerInitialState, setPickerInitialState] = useState("");

  useEffect(() => {
    const countryCode = countryCodes.find((c) => c.dial_code === phoneCode);
    if (countryCode) {
      setSelectedCode(countryCode.dial_code);
      setSelectedCodeFlag(countryCode.flag);
      onCountryCodeChange?.(countryCode.dial_code);
    }
    getNumberLength(countryCode?.dial_code);
  }, [phoneCode]);

  const getNumberLength = (code: any) => {
    const countryISO = getCountryISOFromDialCode(code) as CountryCode;
    if (countryISO) {
      const exampleNumber = getExampleNumber(countryISO, examples);
      if (exampleNumber) {
        const nationalNumber = exampleNumber.nationalNumber.toString();
        const maxLength = nationalNumber.length;
        setNumberLength(maxLength);
      }
    }
  };

  const handleCountrySelect = (country: CountryItem) => {
    setSelectedCode(country.dial_code);
    setSelectedCodeFlag(country.flag);
    setShowPicker(false);
    setPickerInitialState("");
    onCountryCodeChange?.(country.dial_code);
    getNumberLength(country.dial_code);
  };

  const validatePhoneNumber = (number: string, dialCode: string) => {
    const countryISO = getCountryISOFromDialCode(dialCode) as CountryCode;
    if (!countryISO) return false;

    const fullNumber = dialCode + number.replace(/\D/g, "");
    const phoneObj = parsePhoneNumberFromString(fullNumber, countryISO);
    return phoneObj?.isValid() || false;
  };

  const onPhoneChange = (text: string) => {
    onChangeText(text);
    const isValid = validatePhoneNumber(text, selectedCode);
    if (!isValid) {
      setPhoneError("Invalid phone number");
      validatePhone?.(true);
    } else {
      setPhoneError("");
      validatePhone?.(false);
    }
  };

  return (
    <View style={[style]}>
      {label && (
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            fontFamily: fonts.medium,
            marginBottom: 8,
          }}
        >
          {label.includes("(Optional)") ? (
            <>
              {label.replace(" (Optional)", "")}
              <Text style={{ color: "#868C98" }}> (Optional)</Text>
            </>
          ) : label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <Text style={{ color: "#868C98" }}> *</Text>
            </>
          ) : (
            label
          )}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
          borderRadius: 90,
          borderWidth: 1,
          borderColor: error ? colors.red : "#FFFFFF33",
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        {/* Country Code Picker */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
            paddingRight: 10,
            borderRadius: 5,
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontFamily: fonts.medium,
              marginRight: 5,
            }}
          >
            {selectedCodeFlag}
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontFamily: fonts.medium,
              marginRight: 5,
            }}
          >
            {selectedCode}
          </Text>
          <ArrowDownIcon width={12} height={12} color={colors.darkGray} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <RNTextInput
          ref={internalInputRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textColor}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          maxLength={numberLength}
          style={{
            flex: 1,
            color: colors.white,
            fontSize: 16,
            fontFamily: fonts.medium,
            paddingVertical: 0,
          }}
        />
      </View>

      {/* <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          color: colors.darkGray,
          fontFamily: fonts.regular,
        }}
      >
        Enter {numberLength} digit phone number
      </Text> */}

      {(error && message) || phoneError ? (
        <Text
          style={{
            color: colors.red,
            fontSize: 12,
            fontFamily: fonts.regular,
            marginTop: 5,
          }}
        >
          {message || phoneError}
        </Text>
      ) : null}

      <CountryPicker
        show={showPicker}
        lang="en"
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => {
          setShowPicker(false);
          setPickerInitialState("");
        }}
        initialState={pickerInitialState}
        style={{
          modal: {
            height: Platform.OS === "ios" ? "70%" : "50%",
          },
          countryButtonStyles: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          },
          dialCode: {
            color: "#000",
            fontWeight: "bold",
          },
          countryName: {
            color: "#333",
            fontSize: 16,
          },
          searchMessageText: {
            color: "gray",
          },
          textInput: {
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            padding: 8,
            color: "#000",
          },
          countryMessageContainer: {
            padding: 16,
          },
        }}
      />
    </View>
  );
};

// Date Picker Component for Date of Birth
interface DatePickerInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  message?: string;
  style?: object;
  leftImage?: React.ReactNode;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  placeholder = "Select your date of birth",
  onChangeText,
  error = false,
  message = "",
  style,
  leftImage,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onChangeText(formattedDate);
    }
  };

  const handlePress = () => {
    if (Platform.OS === "ios") {
      setShowModal(true);
    } else {
      setShowPicker(true);
    }
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onChangeText(formattedDate);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View style={[style]}>
      {label && (
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            fontFamily: fonts.medium,
            marginBottom: 8,
          }}
        >
          {label.includes("(Optional)") ? (
            <>
              {label.replace(" (Optional)", "")}
              <Text style={{ color: "#868C98" }}> (Optional)</Text>
            </>
          ) : label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <Text style={{ color: "#868C98" }}> *</Text>
            </>
          ) : (
            label
          )}
        </Text>
      )}

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
          borderRadius: 90,
          borderWidth: 1,
          borderColor: error ? colors.red : "#FFFFFF33",
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
        onPress={handlePress}
      >
        {leftImage && (
          <View
            style={{
              marginRight: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leftImage}
          </View>
        )}

        <Text
          style={{
            flex: 1,
            color: value ? colors.white : colors.textColor,
            fontSize: 16,
            fontFamily: fonts.medium,
          }}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error && message && (
        <Text
          style={{
            color: colors.red,
            fontSize: 12,
            fontFamily: fonts.regular,
            marginTop: 5,
          }}
        >
          {message}
        </Text>
      )}

      {/* Android Date Picker */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* iOS Modal Date Picker */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 20,
                maxHeight: "50%",
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity onPress={handleCancel}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#007AFF",
                      fontFamily: fonts.medium,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.semiBold,
                    color: "#000",
                  }}
                >
                  Select Date
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#007AFF",
                      fontFamily: fonts.semiBold,
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Date Picker */}
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                style={{ backgroundColor: "white" }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
