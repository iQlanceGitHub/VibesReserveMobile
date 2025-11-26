import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../utilis/appConstant";

interface DiscountTypeToggleProps {
  selectedType: "percentage" | "fixed";
  onTypeChange: (type: "percentage" | "fixed") => void;
}

const DiscountTypeToggle: React.FC<DiscountTypeToggleProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          selectedType === "percentage" && styles.selectedButton,
        ]}
        onPress={() => onTypeChange("percentage")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "percentage" && styles.selectedText,
          ]}
        >
          B
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          selectedType === "fixed" && styles.selectedButton,
        ]}
        onPress={() => onTypeChange("fixed")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "fixed" && styles.selectedText,
          ]}
        >
          T
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.darkGray,
    borderRadius: horizontalScale(15),
    padding: horizontalScale(2),
  },
  toggleButton: {
    width: horizontalScale(30),
    height: verticalScale(30),
    borderRadius: horizontalScale(13),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: colors.white,
  },
  toggleText: {
    fontSize: fontScale(14),
    fontFamily: fonts.semiBold,
    color: colors.white,
    fontWeight: "600",
  },
  selectedText: {
    color: colors.darkGray,
  },
});

export default DiscountTypeToggle;
