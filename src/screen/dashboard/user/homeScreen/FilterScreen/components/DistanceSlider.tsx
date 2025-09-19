import React from 'react';
import RangeSlider from './RangeSlider';

interface DistanceSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

const DistanceSlider: React.FC<DistanceSliderProps> = ({ value, onValueChange }) => {
  const distanceLabels = ['0 km', '5 km', '10 km', '15 km', '20 km', '25 km'];

  return (
    <RangeSlider
      value={value}
      onValueChange={onValueChange}
      min={0}
      max={25}
      step={1}
      labels={distanceLabels}
    />
  );
};

export default DistanceSlider;
