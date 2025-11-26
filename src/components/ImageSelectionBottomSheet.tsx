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
import * as appConstant from '../utilis/appConstant';
import CameraIcon from '../assets/svg/cameraIcon';
import GalleryIcon from '../assets/svg/galleryIcon';

interface ImageSelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

const ImageSelectionBottomSheet: React.FC<ImageSelectionBottomSheetProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Image Source</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onCameraPress();
                onClose();
              }}
            >
              <View style={styles.optionIcon}>
                <CameraIcon />
              </View>
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onGalleryPress();
                onClose();
              }}
            >
              <View style={styles.optionIcon}>
                <GalleryIcon />
              </View>
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#1a0a2e", // Dark purple background like the calendar
    borderRadius: appConstant.verticalScale(20),
    width: Dimensions.get("window").width * 0.85,
    maxWidth: 400,
    paddingVertical: appConstant.verticalScale(28),
    paddingHorizontal: appConstant.horizontalScale(24),
    shadowColor: "#8D34FF", // Purple shadow
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(141, 52, 255, 0.2)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: appConstant.verticalScale(28),
  },
  title: {
    fontSize: appConstant.fontScale(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: appConstant.verticalScale(32),
    height: appConstant.verticalScale(32),
    borderRadius: appConstant.verticalScale(16),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  closeText: {
    fontSize: appConstant.fontScale(16),
    color: colors.white,
    fontWeight: "bold",
  },
  optionsContainer: {
    gap: appConstant.verticalScale(12),
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: appConstant.verticalScale(18),
    paddingHorizontal: appConstant.horizontalScale(20),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: appConstant.verticalScale(16),
    borderWidth: 1,
    borderColor: "rgba(141, 52, 255, 0.3)",
    shadowColor: "#8D34FF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: appConstant.verticalScale(44),
    height: appConstant.verticalScale(44),
    borderRadius: appConstant.verticalScale(22),
    backgroundColor: colors.violate, // Purple background
    justifyContent: "center",
    alignItems: "center",
    marginRight: appConstant.horizontalScale(18),
    shadowColor: "#8D34FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    fontSize: appConstant.fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

export default ImageSelectionBottomSheet;
