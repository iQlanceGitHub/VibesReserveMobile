import * as React from "react";
import Svg, { Line } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={335}
    height={1}
    viewBox="0 0 335 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Line
      opacity={0.2}
      y1={0.5}
      x2={335}
      y2={0.5}
      stroke="white"
      strokeDasharray="3 3"
    />
  </Svg>
);
export default SVGComponent;
