import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const TrashIcon = (props: any) => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={26} height={26} rx={13} fill="rgba(223, 28, 65, 1)" />
    <Path
      d="M9.33334 6.33301H16.6667C17.4 6.33301 18 6.93301 18 7.66634V8.66634H8.00001C8.00001 7.93301 8.60001 6.33301 9.33334 6.33301Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.00001 8.66634H18V18.6663C18 19.4 17.4 20 16.6667 20H9.33334C8.60001 20 8.00001 19.4 8.00001 18.6663V8.66634Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.3333 12.333V16.333"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.6667 12.333V16.333"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrashIcon;
