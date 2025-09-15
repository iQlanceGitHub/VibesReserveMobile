import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ChatIcon = (props: any) => (
  <Svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 13.5997 2.87562 15.1116 3.54346 16.4525C3.72094 16.8088 3.78001 17.2161 3.67712 17.6006L3.08151 19.8267C2.82295 20.793 3.70701 21.677 4.67335 21.4185L6.89939 20.8229C7.28393 20.72 7.69121 20.7791 8.04753 20.9565C9.38837 21.6244 10.9003 22 12.5 22Z"
      stroke="#CDD0D5"
      strokeWidth={1.5}
    />
  </Svg>
);
export default ChatIcon;
