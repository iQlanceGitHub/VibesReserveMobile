import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const DistancePinsIcon: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 24, height = 24, color = "#8D34FF" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      {/* Simple location pin */}
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={color}
      />
      {/* Distance indicator lines */}
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <Circle
        cx="12"
        cy="12"
        r="6"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />
    </Svg>
  );
};

export default DistancePinsIcon;
