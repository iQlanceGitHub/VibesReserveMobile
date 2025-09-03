import * as React from "react";
import Svg, { Path } from "react-native-svg";
const emailIcon = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.1667 17.0832H5.83333C3.33333 17.0832 1.66667 15.8332 1.66667 12.9165V7.08317C1.66667 4.1665 3.33333 2.9165 5.83333 2.9165H14.1667C16.6667 2.9165 18.3333 4.1665 18.3333 7.08317V12.9165C18.3333 15.8332 16.6667 17.0832 14.1667 17.0832Z"
      stroke="#868C98"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.1667 7.5L11.5583 9.58333C10.7 10.2667 9.29166 10.2667 8.43333 9.58333L5.83333 7.5"
      stroke="#868C98"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default emailIcon;
