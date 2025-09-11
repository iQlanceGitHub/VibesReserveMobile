import * as React from "react";
import Svg, { Path } from "react-native-svg";
const locationFavourite = (props: any) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6.99999 7.83434C8.00515 7.83434 8.81999 7.01949 8.81999 6.01434C8.81999 5.00918 8.00515 4.19434 6.99999 4.19434C5.99483 4.19434 5.17999 5.00918 5.17999 6.01434C5.17999 7.01949 5.99483 7.83434 6.99999 7.83434Z"
      stroke="#8D34FF"
    />
    <Path
      d="M2.11167 4.95283C3.26084 -0.0988398 10.745 -0.0930063 11.8883 4.95866C12.5592 7.92199 10.7158 10.4303 9.1 11.982C7.9275 13.1137 6.0725 13.1137 4.89417 11.982C3.28417 10.4303 1.44084 7.91616 2.11167 4.95283Z"
      stroke="#8D34FF"
    />
  </Svg>
);
export default locationFavourite;
