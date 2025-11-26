import * as React from "react";
import Svg, { Path } from "react-native-svg";
const congratulation = (props: any) => (
  <Svg
    width={94}
    height={94}
    viewBox="0 0 94 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M47.0002 86.1668C68.5418 86.1668 86.1668 68.5418 86.1668 47.0002C86.1668 25.4585 68.5418 7.8335 47.0002 7.8335C25.4585 7.8335 7.8335 25.4585 7.8335 47.0002C7.8335 68.5418 25.4585 86.1668 47.0002 86.1668Z"
      fill="#38C793"
    />
    <Path
      d="M30.354 47.0002L41.4382 58.0844L63.6457 35.916"
      stroke="white"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default congratulation;
