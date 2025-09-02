import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { getWidth } from '../utils/appConstant';

export function ProgressBar({
  percentage = 50,
  color1 = '#8C50FD',
  color2 = '#E0E0E0',
  barHeight = 20,
  showPercentage = true,
  textStyle = {},
  animationDuration = 500,
}) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clampedPercentage,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [clampedPercentage, animationDuration, animatedValue]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View 
      accessible={true}
      accessibilityLabel={`Progress: ${clampedPercentage}%`}
      style={styles.container}
    >
      <View style={[styles.progressBarBackground, { height: barHeight }]}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: widthInterpolated,
              backgroundColor: color1,
              height: barHeight,
            }
          ]}
        />
        <View 
          style={[
            styles.progressRemaining, 
            { 
              backgroundColor: color2,
              height: barHeight,
            }
          ]}
        />
      </View>
      {/* {showPercentage && (
        <Text style={[styles.percentageText, textStyle]}>
          {clampedPercentage}%
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    marginHorizontal: getWidth(5)
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 10,
  },
  progressRemaining: {
    flex: 1,
  },
  percentageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

ProgressBar.propTypes = {
  percentage: PropTypes.number,
  color1: PropTypes.string,
  color2: PropTypes.string,
  barHeight: PropTypes.number,
  showPercentage: PropTypes.bool,
  textStyle: PropTypes.object,
  animationDuration: PropTypes.number,
};