import React from "react";
import { Platform, PermissionsAndroid } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors } from "./colors";
import { verticalScale } from "./appConstant";

export const showToast = (type: string, text: string) => {
  const getTextColor = () => {
    switch (type) {
      case "error":
        return colors.red;
      case "info":
        return colors.primary_blue;
      default:
        return colors.green;
    }
  };

  Toast.show({
    type: type,
    text2: text,
    text2Style: {
      color: getTextColor(),
      fontSize: 14,
      flexWrap: "wrap",
      fontWeight: "500",
    },
    props: {
      text1NumberOfLines: 2,
    },
  });
};

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.green }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{
        fontSize: 14,
        color: colors.green,
        flexWrap: "wrap",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.red , marginTop: verticalScale(15) }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      text2Style={{
        fontSize: 14,
        color: colors.red,
        flexWrap: "wrap",
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.primary_blue }}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{
        fontSize: 14,
        color: colors.primary_blue,
        flexWrap: "wrap",
      }}
    />
  ),
};

export async function requestSmsPermissions() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);

      const allGranted = Object.values(granted).every(
        (val) => val === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn("SMS permissions not granted");
      }
    } catch (err) {
    }
  }
}
