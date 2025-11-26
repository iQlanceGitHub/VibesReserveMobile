import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../utilis/appConstant";
import ArrowDownIcon from "../assets/svg/arrowDownIcon";

interface DropdownOption {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  label?: string;
  placeholder: string;
  data?: DropdownOption[];
  options?: DropdownOption[];
  selectedValue: string;
  onSelect: (item: DropdownOption) => void;
  error?: boolean;
  message?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder,
  data,
  options = [],
  selectedValue,
  onSelect,
  error = false,
  message = "",
}) => {
  // Use data prop if provided, otherwise fall back to options
  const dropdownOptions = data || options;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  // Remove the document event listener as it's not available in React Native

  return (
    <View style={styles.container} ref={dropdownRef}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownButton, error && styles.errorBorder]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedValue && styles.placeholderText,
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <ArrowDownIcon />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {dropdownOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                selectedValue === option.name && styles.selectedItem,
                index === dropdownOptions.length - 1 && styles.lastDropdownItem,
              ]}
              onPress={() => handleSelect(option)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedValue === option.name && styles.selectedItemText,
                ]}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && message && <Text style={styles.errorText}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    color: colors.white,
    fontSize: fontScale(14),
    fontWeight: "500",
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
    borderRadius: 90,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
  },
  errorBorder: {
    borderColor: colors.red,
  },
  dropdownText: {
    color: colors.white,
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
    flex: 1,
  },
  placeholderText: {
    color: colors.textColor,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.whiteTransparentMedium,
    borderTopWidth: 0,
    borderRadius: 0,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: -1,
    paddingBottom: verticalScale(8),
  },
  dropdownItem: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: colors.whiteTransparentLight,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    color: colors.white,
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
  },
  selectedItemText: {
    color: colors.white,
    fontWeight: "500",
  },
  errorText: {
    color: colors.red,
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    marginTop: verticalScale(4),
  },
});

export default CustomDropdown;
