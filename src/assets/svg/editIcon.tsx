import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={26} height={26} rx={13} fill="#8D34FF" />
    <Path
      d="M12.3333 6.33301H11C7.66667 6.33301 6.33334 7.66634 6.33334 10.9997V14.9997C6.33334 18.333 7.66667 19.6663 11 19.6663H15C18.3333 19.6663 19.6667 18.333 19.6667 14.9997V13.6663"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6933 7.0135L10.44 12.2668C10.24 12.4668 10.04 12.8602 10 13.1468L9.71334 15.1535C9.60667 15.8802 10.12 16.3868 10.8467 16.2868L12.8533 16.0002C13.1333 15.9602 13.5267 15.7602 13.7333 15.5602L18.9867 10.3068C19.8933 9.40017 20.32 8.34684 18.9867 7.0135C17.6533 5.68017 16.6 6.10684 15.6933 7.0135Z"
      stroke="white"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.94 7.7666C15.3867 9.35993 16.6333 10.6066 18.2333 11.0599"
      stroke="white"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
