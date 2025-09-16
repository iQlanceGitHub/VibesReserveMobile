import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Dimensions } from 'react-native';
import styles from './styles';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

interface RangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  value, 
  onValueChange, 
  min, 
  max, 
  step = 1,
  labels = [],
  unit = ''
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderWidth = Dimensions.get('window').width - horizontalScale(60);
  const thumbSize = horizontalScale(20);

  const getPositionFromValue = (val: number) => {
    return ((val - min) / (max - min)) * (sliderWidth - thumbSize);
  };

  const getValueFromPosition = (pos: number) => {
    const percentage = pos / (sliderWidth - thumbSize);
    const rawValue = min + percentage * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging('min');
    },
    onPanResponderMove: (evt) => {
      if (isDragging === 'min') {
        const newPosition = Math.max(0, Math.min(getPositionFromValue(maxValue) - thumbSize, evt.nativeEvent.locationX));
        const newValue = Math.max(min, Math.min(maxValue - step, getValueFromPosition(newPosition)));
        setMinValue(newValue);
        onValueChange([newValue, maxValue]);
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(null);
    },
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging('max');
    },
    onPanResponderMove: (evt) => {
      if (isDragging === 'max') {
        const newPosition = Math.max(getPositionFromValue(minValue) + thumbSize, Math.min(sliderWidth - thumbSize, evt.nativeEvent.locationX));
        const newValue = Math.max(minValue + step, Math.min(max, getValueFromPosition(newPosition)));
        setMaxValue(newValue);
        onValueChange([minValue, newValue]);
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(null);
    },
  });

  const minPosition = getPositionFromValue(minValue);
  const maxPosition = getPositionFromValue(maxValue);

  return (
    <View style={styles.rangeSliderContainer}>
      <View style={styles.rangeSliderTrack}>
        <View style={styles.rangeSliderRail} />
        <View 
          style={[
            styles.rangeSliderActiveTrack, 
            { 
              left: minPosition + thumbSize / 2, 
              width: maxPosition - minPosition 
            }
          ]} 
        />
        <View
          style={[styles.rangeSliderThumb, { left: minPosition }]}
          {...minPanResponder.panHandlers}
        />
        <View
          style={[styles.rangeSliderThumb, { left: maxPosition }]}
          {...maxPanResponder.panHandlers}
        />
      </View>
      
      {labels.length > 0 && (
        <View style={styles.rangeSliderLabels}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.rangeSliderLabel}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default RangeSlider;
