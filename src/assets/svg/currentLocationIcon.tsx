import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface CurrentLocationIconProps {
  size?: number;
  color?: string;
}

const CurrentLocationIcon: React.FC<CurrentLocationIconProps> = ({ 
  size = 24, 
  color = '#8D34FF' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer circle */}
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2"
      />
      {/* Inner circle */}
      <Circle
        cx="12"
        cy="12"
        r="4"
        fill={color}
      />
      {/* Center dot */}
      <Circle
        cx="12"
        cy="12"
        r="2"
        fill="white"
      />
    </Svg>
  );
};

export default CurrentLocationIcon;
