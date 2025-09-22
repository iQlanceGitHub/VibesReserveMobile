import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../utilis/appConstant';
import ArrowDownIcon from '../assets/svg/arrowDownIcon';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface CustomModalDropdownProps {
  selectedValue: string;
  onValueSelect: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const CustomModalDropdown: React.FC<CustomModalDropdownProps> = ({ 
  selectedValue, 
  onValueSelect,
  options,
  placeholder = "Select an option",
  label,
  error = false,
  errorMessage = "",
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleValueSelect = (value: string) => {
    onValueSelect(value);
    setIsVisible(false);
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === selectedValue);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const renderOptionItem = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item.value && styles.optionItemSelected
      ]}
      onPress={() => handleValueSelect(item.value)}
    >
      <Text
        style={[
          styles.optionItemText,
          selectedValue === item.value && styles.optionItemTextSelected
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          error && styles.dropdownButtonError,
          disabled && styles.dropdownButtonDisabled
        ]} 
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownText,
          !selectedValue && styles.placeholderText
        ]}>
          {getSelectedLabel()}
        </Text>
        <ArrowDownIcon size={16} color={colors.white} />
      </TouchableOpacity>

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={options}
              renderItem={renderOptionItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    color: colors.white,
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    marginBottom: verticalScale(8),
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    height: verticalScale(50),
    borderRadius: verticalScale(90),
    borderWidth: 1,
    borderColor: colors.violate,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  dropdownButtonError: {
    borderColor: colors.red,
  },
  dropdownButtonDisabled: {
    opacity: 0.5,
  },
  dropdownText: {
    color: colors.white,  
    fontSize: fontScale(14),
    fontWeight: '500',
    marginRight: horizontalScale(6),
    flex: 1,
  },
  placeholderText: {
    color: colors.whiteTransparentMedium,
  },
  errorText: {
    color: colors.red,
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    marginTop: verticalScale(4),
    marginLeft: horizontalScale(4),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(12),
    maxHeight: verticalScale(300),
    width: horizontalScale(280),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  dropdownList: {
    maxHeight: verticalScale(300),
  },
  optionItem: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.purpleBorder,
  },
  optionItemSelected: {
    backgroundColor: colors.violate,
  },
  optionItemText: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  optionItemTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
};

export default CustomModalDropdown;
