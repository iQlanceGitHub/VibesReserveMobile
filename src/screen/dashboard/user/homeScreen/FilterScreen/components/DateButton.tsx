import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

interface DateButtonProps {
  dayText: string;
  dateText: string;
  isSelected: boolean;
  onPress: () => void;
}

const DateButton: React.FC<DateButtonProps> = ({ dayText, dateText, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.dateButton,
        isSelected && styles.dateButtonSelected
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.dateButtonDayText,
          isSelected && styles.dateButtonTextSelected
        ]}
      >
        {dayText}
      </Text>
      <Text
        style={[
          styles.dateButtonDateText,
          isSelected && styles.dateButtonTextSelected
        ]}
      >
        {dateText}
      </Text>
    </TouchableOpacity>
  );
};

export default DateButton;
