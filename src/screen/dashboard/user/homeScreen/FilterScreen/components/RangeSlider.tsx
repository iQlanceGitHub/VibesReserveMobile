import React, { useState, useRef, useEffect } from 'react';
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
  priceValues?: number[];
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  value, 
  onValueChange, 
  min, 
  max, 
  step = 1,
  labels = [],
  unit = '',
  priceValues = []
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderWidth = Dimensions.get('window').width - horizontalScale(80);
  const thumbSize = horizontalScale(24);
  const trackRef = useRef<View>(null);
  const [trackLayout, setTrackLayout] = useState({ x: 0, width: 0 });

  // Update local state when prop value changes
  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  // Snap initial values to price values if provided
  useEffect(() => {
    if (priceValues.length > 0) {
      const snappedMin = snapToNearestValue(value[0]);
      const snappedMax = snapToNearestValue(value[1]);
      
      console.log('RangeSlider - Snapping values:', {
        original: value,
        snapped: [snappedMin, snappedMax],
        priceValues: priceValues
      });
      
      // Update local state with snapped values
      setMinValue(snappedMin);
      setMaxValue(snappedMax);
      
      // Only call onValueChange if the values actually changed
      if (snappedMin !== value[0] || snappedMax !== value[1]) {
        onValueChange([snappedMin, snappedMax]);
      }
    }
  }, [priceValues, value[0], value[1]]);

  const getPositionFromValue = (val: number) => {
    const percentage = (val - min) / (max - min);
    return percentage * (trackLayout.width - thumbSize);
  };

  const snapToNearestValue = (val: number) => {
    if (priceValues.length === 0) {
      return Math.max(min, Math.min(max, Math.round(val / step) * step));
    }
    
    // Find the closest value in priceValues
    let closest = priceValues[0];
    let minDiff = Math.abs(val - closest);
    
    for (let i = 1; i < priceValues.length; i++) {
      const diff = Math.abs(val - priceValues[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = priceValues[i];
      }
    }
    
    return closest;
  };

  const getValueFromPosition = (pos: number) => {
    const percentage = pos / (trackLayout.width - thumbSize);
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.max(min, Math.min(max, Math.round(rawValue / step) * step));
    
    // If priceValues are provided, snap to the nearest one
    if (priceValues.length > 0) {
      return snapToNearestValue(steppedValue);
    }
    
    return steppedValue;
  };

  const handleTrackLayout = (event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTrackLayout({ x, width });
  };

  const handleTouchStart = (evt: any, thumbType: 'min' | 'max') => {
    setIsDragging(thumbType);
  };

  const handleTouchMove = (evt: any, gestureState: any) => {
    if (!isDragging || trackLayout.width === 0) return;

    // Get the absolute X position of the touch
    const absoluteX = gestureState.moveX;
    // Calculate position relative to the track
    const trackX = trackLayout.x;
    const relativeX = absoluteX - trackX - (thumbSize / 2);
    
    // Ensure we stay within track bounds
    const boundedX = Math.max(0, Math.min(trackLayout.width - thumbSize, relativeX));
    const newValue = getValueFromPosition(boundedX);

    if (isDragging === 'min') {
      const clampedValue = Math.max(min, Math.min(maxValue - step, newValue));
      setMinValue(clampedValue);
      onValueChange([clampedValue, maxValue]);
    } else if (isDragging === 'max') {
      const clampedValue = Math.max(minValue + step, Math.min(max, newValue));
      setMaxValue(clampedValue);
      onValueChange([minValue, clampedValue]);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(null);
  };

  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => handleTouchStart(evt, 'min'),
    onPanResponderMove: (evt, gestureState) => handleTouchMove(evt, gestureState),
    onPanResponderRelease: handleTouchEnd,
    onPanResponderTerminate: handleTouchEnd,
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => handleTouchStart(evt, 'max'),
    onPanResponderMove: (evt, gestureState) => handleTouchMove(evt, gestureState),
    onPanResponderRelease: handleTouchEnd,
    onPanResponderTerminate: handleTouchEnd,
  });

  const minPosition = getPositionFromValue(minValue);
  const maxPosition = getPositionFromValue(maxValue);

  return (
    <View style={styles.rangeSliderContainer}>
      <View 
        ref={trackRef}
        style={styles.rangeSliderTrack}
        onLayout={handleTrackLayout}
      >
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
          style={[
            styles.rangeSliderThumb, 
            { 
              left: minPosition,
              zIndex: isDragging === 'min' ? 10 : 1,
              transform: [{ scale: isDragging === 'min' ? 1.2 : 1 }]
            }
          ]}
          {...minPanResponder.panHandlers}
        />
        <View
          style={[
            styles.rangeSliderThumb, 
            { 
              left: maxPosition,
              zIndex: isDragging === 'max' ? 10 : 1,
              transform: [{ scale: isDragging === 'max' ? 1.2 : 1 }]
            }
          ]}
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