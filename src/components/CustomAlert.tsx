import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../utilis/appConstant';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  onClose?: () => void;
  primaryButtonStyle?: any;
  secondaryButtonStyle?: any;
  showSecondaryButton?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  primaryButtonText,
  secondaryButtonText = 'Cancel',
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  primaryButtonStyle,
  secondaryButtonStyle,
  showSecondaryButton = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {showSecondaryButton && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, secondaryButtonStyle]}
                  onPress={onSecondaryPress || onClose}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, primaryButtonStyle]}
                onPress={onPrimaryPress}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {primaryButtonText}
                </Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(16),
    width: '100%',
    maxWidth: horizontalScale(320),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: horizontalScale(24),
    alignItems: 'center',
  },
  title: {
    fontSize: fontScale(18),
    fontFamily: fonts.semiBold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  message: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fontScale(20),
    marginBottom: verticalScale(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: horizontalScale(12),
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: horizontalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.violate,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.violate,
  },
  buttonText: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.violate,
  },
});

export default CustomAlert;
