import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../utilis/appConstant';

interface CustomTimePickerProps {
  initialTime?: Date;
  onTimeChange: (time: Date) => void;
  mode: 'start' | 'end';
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  initialTime = new Date(),
  onTimeChange,
  mode,
}) => {
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  // Initialize with provided time
  useEffect(() => {
    if (initialTime) {
      let hour = initialTime.getHours();
      const minute = initialTime.getMinutes();
      
      // Convert to 12-hour format
      if (hour === 0) {
        hour = 12;
        setSelectedPeriod('AM');
      } else if (hour < 12) {
        setSelectedPeriod('AM');
      } else if (hour === 12) {
        setSelectedPeriod('PM');
      } else {
        hour = hour - 12;
        setSelectedPeriod('PM');
      }
      
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [initialTime]);

  // Generate arrays for picker options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

  // Notify parent component when time changes
  const notifyTimeChange = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const newTime = new Date();
    let hour24 = hour;
    
    if (period === 'AM' && hour === 12) {
      hour24 = 0;
    } else if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    }
    
    newTime.setHours(hour24, minute, 0, 0);
    onTimeChange(newTime);
  };

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    notifyTimeChange(hour, selectedMinute, selectedPeriod);
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    notifyTimeChange(selectedHour, minute, selectedPeriod);
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setSelectedPeriod(period);
    notifyTimeChange(selectedHour, selectedMinute, period);
  };

  const renderSelectionButton = (
    value: number | string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.selectionButton, isSelected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, isSelected && styles.selectedText]}>
        {typeof value === 'number' ? value.toString().padStart(2, '0') : value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Hours Selection */}
      <View style={styles.selectionColumn}>
        <Text style={styles.selectionLabel}>Hour</Text>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.selectionGrid}>
            {hours.map((hour) => 
              renderSelectionButton(
                hour, 
                hour === selectedHour, 
                () => handleHourChange(hour)
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* Minutes Selection */}
      <View style={styles.selectionColumn}>
        <Text style={styles.selectionLabel}>Min</Text>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.selectionGrid}>
            {minutes.map((minute) => 
              renderSelectionButton(
                minute, 
                minute === selectedMinute, 
                () => handleMinuteChange(minute)
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* AM/PM Selection */}
      <View style={styles.selectionColumn}>
        <Text style={styles.selectionLabel}>Period</Text>
        <View style={styles.periodContainer}>
          {periods.map((period) => 
            renderSelectionButton(
              period, 
              period === selectedPeriod, 
              () => handlePeriodChange(period)
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    height: verticalScale(250),
  },
  selectionColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: horizontalScale(5),
  },
  selectionLabel: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.white,
    marginBottom: verticalScale(10),
    opacity: 0.8,
  },
  scrollContainer: {
    maxHeight: verticalScale(200),
    width: '100%',
  },
  scrollContent: {
    paddingVertical: verticalScale(5),
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: horizontalScale(8),
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: horizontalScale(10),
  },
  selectionButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: verticalScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: verticalScale(2),
    marginHorizontal: horizontalScale(2),
  },
  selectedButton: {
    backgroundColor: colors.violate,
    transform: [{ scale: 1.1 }],
  },
  selectionText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.white,
    opacity: 0.7,
  },
  selectedText: {
    color: colors.white,
    opacity: 1,
    fontFamily: fonts.SemiBold,
    fontWeight: '600',
  },
});

export default CustomTimePicker;