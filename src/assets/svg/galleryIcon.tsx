import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const GalleryIcon = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 16L10 9L13 12L21 4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 4H21V11"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        stroke="white"
        strokeWidth="2"
      />
    </Svg>
  );
};

export default GalleryIcon;