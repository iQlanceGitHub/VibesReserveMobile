import { View,Text,TouchableOpacity,StyleSheet } from "react-native";
import React, {FC} from 'react';
import { colors } from "../utils/appConstant";
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
    txtStyle
  }) => {
    return (
      <TouchableOpacity
        style={[styles.button, style, {opacity: disabled ? 0.7 : 1}]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[txtStyle]}>
          {isCap ? title.toUpperCase() : title}
        </Text>
      </TouchableOpacity>
    );
  };
  const styles = StyleSheet.create({
    button: {
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignSelf: 'center',
      borderRadius: 30,
      alignItems:"center"
    },
  })
  