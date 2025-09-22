import * as React from "react";
import Svg, { Path } from "react-native-svg";
const sendIcon = (props: any) => (
  <Svg
    width={37}
    height={36}
    viewBox="0 0 37 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.5 18C0.5 8.05888 8.55888 0 18.5 0C28.4411 0 36.5 8.05888 36.5 18C36.5 27.9411 28.4411 36 18.5 36C8.55888 36 0.5 27.9411 0.5 18Z"
      fill="#8D34FF"
    />
    <Path
      d="M14.6667 13.2668L21.7417 10.9085C24.9167 9.85013 26.6417 11.5835 25.5917 14.7585L23.2333 21.8335C21.65 26.5918 19.05 26.5918 17.4667 21.8335L16.7667 19.7335L14.6667 19.0335C9.90832 17.4501 9.90832 14.8585 14.6667 13.2668Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.925 19.3755L19.9083 16.3838"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default sendIcon;
