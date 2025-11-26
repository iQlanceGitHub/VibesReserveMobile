import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import LinearGradient from 'react-native-linear-gradient';
import BackArrow from '../assets/svg/ArrowLeft';
import { Buttons } from '../components/buttons';

interface FlagContentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  contentType?: 'message' | 'review' | 'profile' | 'user';
  contentId?: string;
}

const FlagContentModal: React.FC<FlagContentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  contentType = 'message',
  contentId
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flagReasons = [
    { id: 'harassment', label: 'Harassment or Bullying' },
    { id: 'hate_speech', label: 'Hate Speech or Discrimination' },
    { id: 'spam', label: 'Spam or Scam' },
    { id: 'inappropriate', label: 'Inappropriate Sexual Content' },
    { id: 'violence', label: 'Violence or Graphic Content' },
    { id: 'copyright', label: 'Copyright Infringement' },
    { id: 'personal_info', label: 'Sharing Personal Information' },
    { id: 'fake_account', label: 'Fake Account or Impersonation' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for flagging this content.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(selectedReason, additionalDetails);
      
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. We will review this content within 24 hours and take appropriate action.',
        [{ text: 'OK', onPress: onClose }]
      );
      
      // Reset form
      setSelectedReason('');
      setAdditionalDetails('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeText = () => {
    switch (contentType) {
      case 'message': return 'message';
      case 'review': return 'review';
      case 'profile': return 'profile';
      case 'user': return 'user';
      default: return 'content';
    }
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
            <Text style={styles.headerTitle}>Report {getContentTypeText()}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.description}>
              Help us maintain a safe community by reporting content that violates our policies.
            </Text>

            <Text style={styles.sectionTitle}>Why are you reporting this {getContentTypeText()}?</Text>
            
            <View style={styles.reasonsContainer}>
              {flagReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.id && styles.selectedReason
                  ]}
                  onPress={() => setSelectedReason(reason.id)}
                >
                  <View style={styles.reasonContent}>
                    <View style={[
                      styles.radioButton,
                      selectedReason === reason.id && styles.selectedRadioButton
                    ]}>
                      {selectedReason === reason.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.reasonText,
                      selectedReason === reason.id && styles.selectedReasonText
                    ]}>
                      {reason.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Additional Details (Optional)</Text>
            <TextInput
              style={styles.detailsInput}
              placeholder="Provide any additional information that might help us review this content..."
              placeholderTextColor={colors.textColor}
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {additionalDetails.length}/500 characters
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Buttons
              title={isSubmitting ? "Submitting..." : "Submit Report"}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                !selectedReason && styles.disabledButton
              ]}
              disabled={!selectedReason || isSubmitting}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
  },
  reasonsContainer: {
    marginBottom: 25,
  },
  reasonItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedReason: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: colors.gradient_light_purple,
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textColor,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.gradient_light_purple,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gradient_light_purple,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  selectedReasonText: {
    color: colors.gradient_light_purple,
  },
  detailsInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 100,
    marginBottom: 10,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textColor,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: colors.gradient_light_purple,
    height: 50,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default FlagContentModal;
