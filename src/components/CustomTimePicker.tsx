import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { horizontalScale, verticalScale, fontScale } from '../utilis/appConstant';

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  onClose,
  onTimeSelect,
  selectedTime,
}) => {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  const renderTimeWheel = (items: number[], selectedValue: number, onSelect: (value: number) => void) => (
    <ScrollView
      style={styles.timeWheel}
      showsVerticalScrollIndicator={false}
      snapToInterval={verticalScale(50)}
      decelerationRate="fast"
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.timeItem,
            selectedValue === item && styles.selectedTimeItem,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              styles.timeText,
              selectedValue === item && styles.selectedTimeText,
            ]}
          >
            {item.toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Select Time</Text>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Hour</Text>
              {renderTimeWheel(hours, selectedHour, setSelectedHour)}
            </View>
            <Text style={styles.separator}>:</Text>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Minute</Text>
              {renderTimeWheel(minutes, selectedMinute, setSelectedMinute)}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.gradient_dark_purple,
    borderTopLeftRadius: horizontalScale(20),
    borderTopRightRadius: horizontalScale(20),
    paddingBottom: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.BtnBackground,
  },
  cancelButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
  },
  cancelText: {
    color: colors.gray,
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
  },
  title: {
    color: colors.white,
    fontSize: fontScale(18),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
  },
  confirmText: {
    color: colors.BtnBackground,
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    color: colors.gray,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    marginBottom: verticalScale(10),
  },
  timeWheel: {
    height: verticalScale(200),
    width: '100%',
  },
  timeItem: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(2),
  },
  selectedTimeItem: {
    backgroundColor: colors.BtnBackground,
    borderRadius: horizontalScale(8),
    marginHorizontal: horizontalScale(10),
  },
  timeText: {
    color: colors.white,
    fontSize: fontScale(18),
    fontFamily: fonts.regular,
  },
  selectedTimeText: {
    color: colors.white,
    fontSize: fontScale(20),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },
  separator: {
    color: colors.white,
    fontSize: fontScale(24),
    fontFamily: fonts.bold,
    marginHorizontal: horizontalScale(20),
  },
});

export default CustomTimePicker;

