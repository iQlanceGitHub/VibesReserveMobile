import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13.9278 17.4812L8.28384 11.8372C7.6173 11.1707 7.6173 10.08 8.28384 9.41346L13.9278 3.76953"
      stroke="#868C98"
      strokeWidth={1.29845}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
