import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import LinearGradient from 'react-native-linear-gradient';
import BackArrow from '../assets/svg/ArrowLeft';
import { Buttons } from '../components/buttons';

interface UnblockUserModalProps {
  visible: boolean;
  onClose: () => void;
  onUnblock: () => void;
  userName?: string;
  userId?: string;
}

const UnblockUserModal: React.FC<UnblockUserModalProps> = ({
  visible,
  onClose,
  onUnblock,
  userName = 'this user',
  userId
}) => {
  const [isUnblocking, setIsUnblocking] = useState(false);

  const handleUnblock = async () => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}? This will:\n\n• Allow them to send you messages again\n• Show their content in your feed\n• Add them back to your chat list\n• Make their reviews and ratings visible`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          style: 'default',
          onPress: async () => {
            setIsUnblocking(true);
            try {
              await onUnblock();
              onClose(); // Just close the modal, let parent handle success message
            } catch (error) {
              Alert.alert('Error', 'Failed to unblock user. Please try again.');
            } finally {
              setIsUnblocking(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.profileCardBackground} />
        
        <LinearGradient
          colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <BackArrow />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Unblock User</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.infoIcon}>✅</Text>
              <Text style={styles.infoTitle}>Unblock {userName}</Text>
              <Text style={styles.infoDescription}>
                Unblocking this user will restore their ability to interact with you and make their content visible again.
              </Text>
            </View>

            <View style={styles.effectsContainer}>
              <Text style={styles.effectsTitle}>What happens when you unblock someone:</Text>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>💬</Text>
                <Text style={styles.effectText}>They can send you messages again</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>👁️</Text>
                <Text style={styles.effectText}>Their content will be visible to you</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>📱</Text>
                <Text style={styles.effectText}>They will appear in your chat list</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>⭐</Text>
                <Text style={styles.effectText}>You will see their reviews and ratings</Text>
              </View>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>Note:</Text>
              <Text style={styles.noteText}>
                You can block this user again anytime if needed. Unblocking is reversible and restores full interaction.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <Buttons
                title={isUnblocking ? "Unblocking..." : "Unblock User"}
                onPress={handleUnblock}
                style={[
                  styles.unblockButton,
                  isUnblocking && styles.disabledButton
                ]}
                disabled={isUnblocking}
              />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.profileCardBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerSpacer: {
    width: 35,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  infoIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  effectsContainer: {
    marginBottom: 25,
  },
  effectsTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
  },
  effectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  effectIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  effectText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  noteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.white,
  },
  noteTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 5,
  },
  noteText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 0.48,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  unblockButton: {
    flex: 0.48,
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default UnblockUserModal;
