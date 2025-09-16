import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MessageIconProps {
  size?: number;
  color?: string;
}

const MessageIcon: React.FC<MessageIconProps> = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
        fill={color}
      />
    </Svg>
  );
};

export default MessageIcon;
