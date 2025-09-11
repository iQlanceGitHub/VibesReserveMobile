import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const HeartIcon = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={20} height={20} rx={10} fill="#8D34FF" />
    <Path
      d="M10.3179 14.5176C10.1436 14.5791 9.85641 14.5791 9.68205 14.5176C8.19487 14.0099 4.87179 11.892 4.87179 8.30221C4.87179 6.7176 6.14871 5.43555 7.72307 5.43555C8.65641 5.43555 9.48205 5.88683 10 6.58426C10.5179 5.88683 11.3487 5.43555 12.2769 5.43555C13.8513 5.43555 15.1282 6.7176 15.1282 8.30221C15.1282 11.892 11.8051 14.0099 10.3179 14.5176Z"
      fill="#F3F0FB"
    />
  </Svg>
);
export default HeartIcon;
