import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../utilis/appConstant";

interface DetailsInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  message?: string;
  required?: boolean;
}

const DetailsInput: React.FC<DetailsInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error = false,
  message = "",
  required = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.textInput, error && styles.textInputError]}
        placeholder={placeholder}
        placeholderTextColor={colors.textColor}
        value={value}
        onChangeText={onChangeText}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  required: {
    color: colors.textColor,
  },
  textInput: {
    backgroundColor: "transparent",
    width: horizontalScale(335),
    height: verticalScale(110),
    borderRadius: horizontalScale(20),
    borderWidth: horizontalScale(1),
    borderColor: "#FFFFFF33",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(15),
    color: colors.white,
    fontSize: fontScale(15),
    fontFamily: fonts.reguler,
  },
  textInputError: {
    borderColor: colors.red,
  },
  message: {
    color: colors.red,
    fontSize: fontScale(12),
    fontFamily: fonts.reguler,
    marginTop: verticalScale(4),
  },
});

export default DetailsInput;
