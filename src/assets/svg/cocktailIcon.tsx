import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CocktailIconProps {
  size?: number;
  color?: string;
}

const CocktailIcon: React.FC<CocktailIconProps> = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 5L10.5 2L13.5 5H7.5ZM5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7H5ZM7 9H17V19H7V9ZM9 11V17H11V11H9ZM13 11V17H15V11H13Z"
        fill={color}
      />
    </Svg>
  );
};

export default CocktailIcon;
