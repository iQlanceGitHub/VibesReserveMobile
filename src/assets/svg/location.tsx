import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const location = (props: any) => (
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
      d="M50.1783 68.2524C57.8942 34.3341 108.145 34.3733 115.822 68.2916C120.326 88.1883 107.949 105.03 97.1 115.448C89.2275 123.047 76.7725 123.047 68.8608 115.448C58.0508 105.03 45.6742 88.1491 50.1783 68.2524Z"
      fill="#8D34FF"
    />
    <Path
      d="M82.9995 87.6006C89.7485 87.6006 95.2195 82.1296 95.2195 75.3806C95.2195 68.6317 89.7485 63.1606 82.9995 63.1606C76.2506 63.1606 70.7795 68.6317 70.7795 75.3806C70.7795 82.1296 76.2506 87.6006 82.9995 87.6006Z"
      fill="white"
    />
  </Svg>
);
export default location;
