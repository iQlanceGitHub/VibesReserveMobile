import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.93343 18.3332C14.5168 18.3332 18.2668 14.5832 18.2668 9.99984C18.2668 5.4165 14.5168 1.6665 9.93343 1.6665C5.3501 1.6665 1.6001 5.4165 1.6001 9.99984C1.6001 14.5832 5.3501 18.3332 9.93343 18.3332Z"
      stroke="#868C98"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.6001 10H13.2668"
      stroke="#868C98"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
