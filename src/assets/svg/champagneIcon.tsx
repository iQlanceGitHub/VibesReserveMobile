import React from "react";
import Svg, { Path } from "react-native-svg";

interface ChampagneIconProps {
  size?: number;
  color?: string;
}

const ChampagneIcon: React.FC<ChampagneIconProps> = ({
  size = 16,
  color = "#FFFFFF",
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2v20M8 2h8M6 6h12M4 10h16M6 14h12M4 18h16"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 6v4M16 6v4"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChampagneIcon;
