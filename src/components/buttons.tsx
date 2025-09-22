import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { FC } from "react";
import { colors } from "../utilis/colors";
import * as appConstant from "../utilis/appConstant";
import { fonts } from "../utilis/fonts";

interface ButtonProps {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  isCap?: boolean;
  style?: object;
  txtStyle?: object;
}
export const Buttons: FC<ButtonProps> = ({
  title,
  disabled,
  onPress,
  isCap = true,
  style,
  txtStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, { opacity: disabled ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.titleText]}>{title}</Text>
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
    paddingHorizontal: appConstant.verticalScale(8),
    paddingVertical: appConstant.verticalScale(8),
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
