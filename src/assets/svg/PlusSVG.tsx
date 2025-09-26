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
      d="M10.0001 18.3332C14.5834 18.3332 18.3334 14.5832 18.3334 9.99984C18.3334 5.4165 14.5834 1.6665 10.0001 1.6665C5.41675 1.6665 1.66675 5.4165 1.66675 9.99984C1.66675 14.5832 5.41675 18.3332 10.0001 18.3332Z"
      stroke="#8D34FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.66675 10H13.3334"
      stroke="#8D34FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 13.3332V6.6665"
      stroke="#8D34FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
