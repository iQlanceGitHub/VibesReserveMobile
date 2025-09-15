import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { styles } from "./logoutConfirmationStyle";

interface LogoutConfirmationPopupProps {
  visible: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

const LogoutConfirmationPopup: React.FC<LogoutConfirmationPopupProps> = ({
  visible,
  onCancel,
  onLogout,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.topLine} />
          <View style={styles.handle} />

          <Text style={styles.title}>
            Are you sure you want to{"\n"}log out?
          </Text>
          <Text style={styles.message}>
            You will need to log in again to access your account and bookings.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmationPopup;
