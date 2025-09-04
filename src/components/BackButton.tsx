import React, { FC } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BackIcon from "../assets/svg/backIcon";
import { getWidth } from "../utilis/appConstant";

interface BackButtonProps {
  navigation: any;
  title?: string;
  onBackPress?: () => void;
}

export const BackButton: FC<BackButtonProps> = ({
  navigation,
  onBackPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.viewContainer}
      onPress={onBackPress || (() => navigation.goBack())}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <BackIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    width: 44,
    height: 44,
    borderRadius: 99,
    backgroundColor: "#8D34FF26",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
});
