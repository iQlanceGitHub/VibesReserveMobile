import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MusicIconProps {
  size?: number;
  color?: string;
}

const MusicIcon: React.FC<MusicIconProps> = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V5H12ZM10 19C8.9 19 8 18.1 8 17S8.9 15 10 15 12 15.9 12 17 11.1 19 10 19Z"
        fill={color}
      />
    </Svg>
  );
};

export default MusicIcon;
