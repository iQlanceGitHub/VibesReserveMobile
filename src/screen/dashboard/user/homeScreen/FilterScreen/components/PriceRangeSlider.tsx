import React from 'react';
import RangeSlider from './RangeSlider';

interface PriceRangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ value, onValueChange }) => {
  const priceLabels = ['$1', '$500', '$1,000', '$1,500', '$3,000', '$5,000'];
  const priceValues = [1, 500, 1000, 1500, 3000, 5000];

  return (
    <RangeSlider
      value={value}
      onValueChange={onValueChange}
      min={1}
      max={5000}
      step={1}
      labels={priceLabels}
      priceValues={priceValues}
    />
  );
};

export default PriceRangeSlider;
