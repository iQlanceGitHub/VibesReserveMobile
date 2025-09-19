import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DinnerIconProps {
  size?: number;
  color?: string;
}

const DinnerIcon: React.FC<DinnerIconProps> = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.1 13.34L2 9.69L3.62 8.72L8.1 11.67L8.1 13.34ZM8.1 21.34L2 17.69L3.62 16.72L8.1 19.67L8.1 21.34ZM8.1 17.34L2 13.69L3.62 12.72L8.1 15.67L8.1 17.34ZM21 5H3V7H21V5ZM21 9H3V11H21V9ZM21 13H3V15H21V13ZM21 17H3V19H21V17Z"
        fill={color}
      />
    </Svg>
  );
};

export default DinnerIcon;
