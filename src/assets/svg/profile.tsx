import * as React from "react";
import Svg, { Path } from "react-native-svg";
const profile = (props) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.1467 9.96408C11.055 9.95492 10.945 9.95492 10.8442 9.96408C8.6625 9.89075 6.93 8.10325 6.93 5.90325C6.93 3.65742 8.745 1.83325 11 1.83325C13.2458 1.83325 15.07 3.65742 15.07 5.90325C15.0608 8.10325 13.3283 9.89075 11.1467 9.96408Z"
      stroke="white"
      strokeWidth={0.860656}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.56333 13.3467C4.345 14.8317 4.345 17.2517 6.56333 18.7276C9.08417 20.4142 13.2183 20.4142 15.7392 18.7276C17.9575 17.2426 17.9575 14.8226 15.7392 13.3467C13.2275 11.6692 9.09333 11.6692 6.56333 13.3467Z"
      stroke="white"
      strokeWidth={0.860656}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default profile;
