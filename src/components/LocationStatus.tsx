import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { fonts } from "../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../utilis/appConstant";
import LocationFavourite from "../assets/svg/locationFavourite";

interface LocationStatusProps {
  location: string;
  isOnline?: boolean;
}

const LocationStatus: React.FC<LocationStatusProps> = ({
  location,
  isOnline = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <LocationFavourite
          width={horizontalScale(14)}
          height={verticalScale(14)}
        />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View
        style={[styles.statusIndicator, isOnline && styles.onlineIndicator]}
      >
        <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(8),
    paddingVertical: verticalScale(6),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: fontScale(12),
    fontWeight: "400",
    fontFamily: fonts.Regular,
    color: colors.whiteTransparentMedium,
    marginLeft: horizontalScale(4),
  },
  statusIndicator: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: verticalScale(10),
    backgroundColor: colors.red,
  },
  onlineIndicator: {
    backgroundColor: colors.green,
  },
  statusText: {
    fontSize: fontScale(10),
    fontWeight: "500",
    fontFamily: fonts.Medium,
    color: colors.white,
  },
});

export default LocationStatus;
