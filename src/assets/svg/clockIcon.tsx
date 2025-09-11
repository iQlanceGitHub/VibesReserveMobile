import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ClockIcon = (props: any) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12.8333 7.00033C12.8333 10.2203 10.22 12.8337 7 12.8337C3.78001 12.8337 1.16667 10.2203 1.16667 7.00033C1.16667 3.78033 3.78001 1.16699 7 1.16699C10.22 1.16699 12.8333 3.78033 12.8333 7.00033Z"
      stroke="#8D34FF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.16416 8.85503L7.35583 7.77586C7.04083 7.58919 6.78416 7.14003 6.78416 6.77253V4.38086"
      stroke="#8D34FF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ClockIcon;
