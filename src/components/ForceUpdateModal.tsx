import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import LinearGradient from 'react-native-linear-gradient';

interface ForceUpdateModalProps {
  visible: boolean;
  storeUrl: string;
}

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  storeUrl,
}) => {
  const handleUpdate = () => {
    Linking.openURL(storeUrl).catch((err) => {
      console.error('Failed to open store URL:', err);
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}} // Prevent closing by back button
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📱</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Update Required</Text>

            {/* Description */}
            <Text style={styles.description}>
              A new version of VibesReserve is available. Please update your app to continue using all features.
            </Text>

            {/* Update Button */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              This update includes important improvements and bug fixes.
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  updateButton: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  updateButtonText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.gradient_dark_purple,
  },
  infoText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default ForceUpdateModal;

