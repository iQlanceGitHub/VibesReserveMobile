import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { FC } from "react";
import { colors } from "../utilis/colors";
import * as appConstant from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";
import { fontScale } from "../utilis/appConstant";

interface ButtonProps {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  isCap?: boolean;
  style?: object;
  txtStyle?: object;
  textColor?: string;
}
export const Buttons: FC<ButtonProps> = ({
  title,
  disabled,
  onPress,
  isCap = true,
  style,
  txtStyle,
  textColor = colors.white,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, { opacity: disabled ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.titleText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.violate,
    width: appConstant.verticalScale(335),
    height: appConstant.horizontalScale(50),
    marginBottom: appConstant.verticalScale(15),
    borderRadius: appConstant.verticalScale(99),
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: appConstant.verticalScale(12),
    paddingVertical: appConstant.verticalScale(12),
  },
  titleText: {
    fontSize: appConstant.fontScale(16),
    fontFamily: fonts.semiBold,
    alignSelf: "center",
    textAlign: "center",
    fontWeight: '600',
    lineHeight: appConstant.fontScale(24),
    color: colors.white,
  },
});
