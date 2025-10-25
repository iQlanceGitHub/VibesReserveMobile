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
import { horizontalScale, verticalScale } from '../utilis/appConstant';

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  onBlock: () => void;
  userName?: string;
  userId?: string;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  visible,
  onClose,
  onBlock,
  userName = 'this user',
  userId
}) => {
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userName}? This will:\n\n• Prevent them from sending you messages\n• Hide their content from your view\n• Remove them from your chat list\n\nYou can unblock them later in your settings.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            setIsBlocking(true);
            try {
              await onBlock();
              onClose(); // Just close the modal, let parent handle success message
            } catch (error) {
              Alert.alert('Error', 'Failed to block user. Please try again.');
            } finally {
              setIsBlocking(false);
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
            <Text style={styles.headerTitle}>Block User</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.warningContainer}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningTitle}>Block {userName}</Text>
              <Text style={styles.warningDescription}>
                Blocking this user will prevent them from contacting you and hide their content from your view.
              </Text>
            </View>

            <View style={styles.effectsContainer}>
              <Text style={styles.effectsTitle}>What happens when you block someone:</Text>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>🚫</Text>
                <Text style={styles.effectText}>They cannot send you messages</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>👁️</Text>
                <Text style={styles.effectText}>Their content will be hidden from you</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>💬</Text>
                <Text style={styles.effectText}>They will be removed from your chat list</Text>
              </View>
              
              <View style={styles.effectItem}>
                <Text style={styles.effectIcon}>⭐</Text>
                <Text style={styles.effectText}>You won't see their reviews or ratings</Text>
              </View>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>Note:</Text>
              <Text style={styles.noteText}>
                You can unblock this user anytime in your settings. Blocking is reversible and only affects your view of their content.
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
                title={isBlocking ? "Blocking..." : "Block User"}
                onPress={handleBlock}
                style={[
                  styles.blockButton,
                  isBlocking && styles.disabledButton
                ]}
                disabled={isBlocking}
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
  warningContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  warningIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  warningDescription: {
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
  blockButton: {
    flex: 0.48,
    backgroundColor: '#FF4444',
    height: 50,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default BlockUserModal;
