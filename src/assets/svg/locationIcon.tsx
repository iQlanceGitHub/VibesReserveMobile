import * as React from "react";
import Svg, { Path } from "react-native-svg";
const locationIcon = (props) => (
  <Svg
    width={34}
    height={34}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M20.1243 9.81446L7.61554 13.6965C4.64569 14.6157 4.60326 18.8018 7.5519 19.7847L10.9884 20.9302C11.943 21.2484 12.6926 21.9979 13.0108 22.9525L14.1563 26.389C15.1392 29.3377 19.3182 29.2882 20.2445 26.3254L24.1265 13.8167C24.8902 11.356 22.585 9.05079 20.1243 9.81446Z"
      fill="#8D34FF"
    />
  </Svg>
);
export default locationIcon;
