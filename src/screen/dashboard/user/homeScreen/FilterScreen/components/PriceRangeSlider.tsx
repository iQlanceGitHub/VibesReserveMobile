import React from 'react';
import RangeSlider from './RangeSlider';

interface PriceRangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ value, onValueChange }) => {
  const priceLabels = ['$100', '$500', '$1000', '$1500', '$3000', '$5000'];

  return (
    <RangeSlider
      value={value}
      onValueChange={onValueChange}
      min={0}
      max={5000}
      step={100}
      labels={priceLabels}
    />
  );
};

export default PriceRangeSlider;
