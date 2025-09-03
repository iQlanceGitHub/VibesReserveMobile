import * as React from "react";
import Svg, { Path } from "react-native-svg";
const nameIcon = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10 10.0001C12.3012 10.0001 14.1667 8.1346 14.1667 5.83341C14.1667 3.53223 12.3012 1.66675 10 1.66675C7.69881 1.66675 5.83333 3.53223 5.83333 5.83341C5.83333 8.1346 7.69881 10.0001 10 10.0001Z"
      stroke="#868C98"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.1583 18.3333C17.1583 15.1083 13.95 12.5 10 12.5C6.05 12.5 2.84167 15.1083 2.84167 18.3333"
      stroke="#868C98"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default nameIcon;
