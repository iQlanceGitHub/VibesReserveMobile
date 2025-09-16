import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DanceIconProps {
  size?: number;
  color?: string;
}

const DanceIcon: React.FC<DanceIconProps> = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5L21 9ZM3 9L9 7.5V5.5L3 7V9ZM12 8C9.8 8 8 9.8 8 12S9.8 16 12 16 16 14.2 16 12 14.2 8 12 8ZM12 14C10.9 14 10 13.1 10 12S10.9 10 12 10 14 10.9 14 12 13.1 14 12 14ZM8 18C8 15.8 9.8 14 12 14S16 15.8 16 18V20H8V18ZM10 18H14V18.5C14 19.3 13.3 20 12.5 20H11.5C10.7 20 10 19.3 10 18.5V18Z"
        fill={color}
      />
    </Svg>
  );
};

export default DanceIcon;
