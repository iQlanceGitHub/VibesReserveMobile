
import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const congratulation = (props: any) => (
  <Svg
    width={165}
    height={164}
    viewBox="0 0 165 164"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle opacity={0.1} cx={82.5} cy={82} r={82} fill="#8D34FF" />
    <Path
      d="M82.9999 121.167C104.542 121.167 122.167 103.542 122.167 81.9999C122.167 60.4583 104.542 42.8333 82.9999 42.8333C61.4583 42.8333 43.8333 60.4583 43.8333 81.9999C43.8333 103.542 61.4583 121.167 82.9999 121.167Z"
      fill="#38C793"
    />
    <Path
      d="M66.3542 81.9999L77.4384 93.0841L99.6459 70.9158"
      stroke="white"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default congratulation;
