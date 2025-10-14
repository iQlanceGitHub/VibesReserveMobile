import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../utilis/colors';

interface PaperAirplaneIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const PaperAirplaneIcon: React.FC<PaperAirplaneIconProps> = ({
  width = 24,
  height = 24,
  color = colors.violate,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default PaperAirplaneIcon;
