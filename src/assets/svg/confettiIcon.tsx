import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

interface ConfettiIconProps {
  size?: number;
  color?: string;
}

const ConfettiIcon: React.FC<ConfettiIconProps> = ({
  size = 16,
  color = "#FFFFFF",
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16v16H4z"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="8" r="1" fill={color} />
      <Circle cx="16" cy="8" r="1" fill={color} />
      <Circle cx="8" cy="16" r="1" fill={color} />
      <Circle cx="16" cy="16" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
    </Svg>
  );
};

export default ConfettiIcon;
