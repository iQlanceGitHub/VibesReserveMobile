import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utilis/colors';
import * as appConstant from '../utilis/appConstant';

interface UnreadBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ 
  count, 
  size = 'small' 
}) => {
  console.log('🏷️ UnreadBadge rendered with count:', count);
  
  if (count <= 0) {
    console.log('🏷️ UnreadBadge: Count is 0 or negative, not rendering');
    return null;
  }
  
  console.log('🏷️ UnreadBadge: Rendering badge with count:', count);

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          fontSize: 10,
        };
      case 'medium':
        return {
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          fontSize: 12,
        };
      case 'large':
        return {
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          fontSize: 14,
        };
      default:
        return {
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          fontSize: 10,
        };
    }
  };

  const badgeSize = getBadgeSize();
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[
      styles.badge,
      {
        minWidth: badgeSize.minWidth,
        height: badgeSize.height,
        borderRadius: badgeSize.borderRadius,
      }
    ]}>
      <Text style={[
        styles.badgeText,
        { fontSize: badgeSize.fontSize }
      ]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.violate,
    zIndex: 1,
  },
  badgeText: {
    color: colors.violate,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UnreadBadge;
