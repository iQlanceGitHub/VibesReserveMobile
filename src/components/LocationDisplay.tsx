import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocation } from '../contexts/LocationContext';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../utilis/appConstant';
import LocationFavourite from '../assets/svg/locationFavourite';

interface LocationDisplayProps {
  onPress?: () => void;
  showRefreshButton?: boolean;
  style?: any;
  textStyle?: any;
  iconSize?: number;
  showIcon?: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  onPress,
  showRefreshButton = false,
  style,
  textStyle,
  iconSize = 16,
  showIcon = true,
}) => {
  const { 
    locationData, 
    shortLocationDisplayText, 
    isLoading, 
    error, 
    refreshLocation 
  } = useLocation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (showRefreshButton) {
      refreshLocation();
    }
  };

  const getDisplayText = () => {
    if (isLoading) {
      return 'Getting location...';
    }
    if (error) {
      if (error.includes('permission denied')) {
        return 'Tap to enable location';
      }
      return 'Tap to refresh location';
    }
    return shortLocationDisplayText;
  };

  const getTextColor = () => {
    if (isLoading) {
      return colors.gray;
    }
    if (error) {
      if (error.includes('permission denied')) {
        return colors.violate; // Make it more prominent for permission issues
      }
      return colors.red;
    }
    return colors.white;
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: verticalScale(4),
          paddingHorizontal: horizontalScale(8),
        },
        style,
      ]}
      onPress={handlePress}
      disabled={!onPress && !showRefreshButton && !error}
      activeOpacity={0.7}
    >
      {showIcon && (
        <View style={{ marginRight: horizontalScale(6) }}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.violate} />
          ) : (
            <LocationFavourite size={iconSize} color={colors.violate} />
          )}
        </View>
      )}
      
      <Text
        style={[
          {
            color: getTextColor(),
            fontFamily: fonts.medium,
            fontSize: fontScale(14),
            flex: 1,
          },
          textStyle,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {getDisplayText()}
      </Text>
    </TouchableOpacity>
  );
};

export default LocationDisplay;

