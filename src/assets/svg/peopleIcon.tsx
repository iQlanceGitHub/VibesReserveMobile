import * as React from "react";
import Svg, { Path } from "react-native-svg";

const PeopleIcon = (props: any) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5.25 6.41667C6.49412 6.41667 7.5 5.41079 7.5 4.16667C7.5 2.92254 6.49412 1.91667 5.25 1.91667C4.00588 1.91667 3 2.92254 3 4.16667C3 5.41079 4.00588 6.41667 5.25 6.41667Z"
      stroke="#8D34FF"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.75 6.41667C10.4941 6.41667 11.25 5.66079 11.25 4.91667C11.25 4.17254 10.4941 3.41667 9.75 3.41667C9.00588 3.41667 8.25 4.17254 8.25 4.91667C8.25 5.66079 9.00588 6.41667 9.75 6.41667Z"
      stroke="#8D34FF"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.75 12.0833V11.6667C1.75 10.5621 2.64543 9.66667 3.75 9.66667H6.75C7.85457 9.66667 8.75 10.5621 8.75 11.6667V12.0833"
      stroke="#8D34FF"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.25 12.0833V11.6667C6.25 10.5621 7.14543 9.66667 8.25 9.66667H11.25C12.3546 9.66667 13.25 10.5621 13.25 11.6667V12.0833"
      stroke="#8D34FF"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PeopleIcon;
