import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";

interface CategoryButtonProps {
  title: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  title,
  icon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected ? styles.selectedButton : styles.unselectedButton,
      ]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.buttonText,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: verticalScale(20),
    marginRight: horizontalScale(12),
    paddingTop: verticalScale(8),
    paddingRight: horizontalScale(14),
    paddingBottom: verticalScale(8),
    paddingLeft: horizontalScale(14),
    opacity: 1,
    alignSelf: "flex-start",
  },
  selectedButton: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
    borderWidth: 1,
  },
  unselectedButton: {
    backgroundColor: colors.unselectedBackground,
    borderColor: colors.purpleBorder,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: horizontalScale(6),
  },
  buttonText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
  },
  selectedText: {
    color: colors.white,
  },
  unselectedText: {
    color: colors.white,
  },
});

export default CategoryButton;
