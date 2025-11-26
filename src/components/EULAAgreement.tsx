import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors } from '../utilis/colors';
import { fonts } from '../utilis/fonts';
import LinearGradient from 'react-native-linear-gradient';
import BackArrow from '../assets/svg/ArrowLeft';
import { Buttons } from '../components/buttons';
import { useModeration } from '../contexts/ModerationContext';

interface EULAAgreementProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  title?: string;
}

const EULAAgreement: React.FC<EULAAgreementProps> = ({
  visible,
  onAccept,
  onDecline,
  title = "End User License Agreement (EULA)"
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const { acceptEULA } = useModeration();

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setHasScrolledToBottom(isScrolledToBottom);
  };

  const handleAccept = async () => {
    try {
      await acceptEULA();
      onAccept();
    } catch (error) {
      console.error('Failed to accept EULA:', error);
      onAccept(); // Still proceed even if there's an error
    }
  };

  const eulaContent = `
END USER LICENSE AGREEMENT (EULA)
Last Updated: 25th October 2025

ACCEPTANCE OF TERMS
By using the VibesReserve Mobile Application ("App"), you agree to be bound by this End User License Agreement ("EULA"). If you do not agree to these terms, please do not use the App.

USER-GENERATED CONTENT POLICY

2.1 Zero Tolerance Policy
We maintain a zero tolerance policy for objectionable content and abusive behavior. This includes but is not limited to:

• Harassment, bullying, or threatening behavior
• Hate speech, discrimination, or offensive language
• Spam, scams, or fraudulent content
• Inappropriate sexual content
• Violence or graphic content
• Copyright infringement
• Sharing personal information without consent

2.2 Content Moderation
• User-generated content (messages, reviews, profiles, etc.) is actively monitored
• We reserve the right to remove any content that violates our policies
• Users who violate these policies will be immediately suspended or permanently banned
• Our team responds to all content reports within 24 hours

2.3 User Responsibilities
• You are responsible for the content you post
• You must respect other users and maintain a positive community environment
• You must report any objectionable content or abusive users immediately
• Impersonation or fake accounts are strictly prohibited

REPORTING AND BLOCKING MECHANISMS

3.1 Reporting Content
• Use the "Report" or "Help & Support" option to report violations
• Include details about the issue to help with quick action
• Submitting false reports may result in account suspension

3.2 Blocking Users
• Use the "Block" button to restrict communication with abusive users
• Blocked users cannot contact you or view your content
• You may unblock users anytime through your settings

3.3 Moderation Response
• All reports are reviewed within 24 hours
• Violating content is removed immediately
• Repeat offenders are permanently banned
• Appeals are reviewed within 48 hours

PRIVACY AND DATA PROTECTION
• We collect and store only necessary data to provide our services
• User content is stored securely and not shared with third parties
• Deleted content may be retained temporarily for moderation purposes
• Users can request data deletion anytime

ACCOUNT SUSPENSION AND TERMINATION
• First offense: Immediate permanent Inactive & content removal. On Appeals we will review the case and if the user is found to be innocent, we will reactivate their account.

INTELLECTUAL PROPERTY
• You retain ownership of your content
• By posting, you grant us a limited license to display and moderate it
• App design, features, and branding are our intellectual property
• Unauthorized use of our assets is strictly prohibited

CHANGES TO TERMS
• We may update this EULA from time to time
• Continued use of the App constitutes acceptance of any changes
• Users may terminate their accounts if they disagree with updates

CONTACT INFORMATION
For questions or to report violations:
• Email: vibereserve.connect@gmail.com
• In-app Help & Support.
• Block button on any content for any host or user.

GOVERNING LAW
This EULA is governed by applicable laws and regulations. Disputes will be resolved through appropriate legal channels.

By clicking "I Accept," you acknowledge that you have read, understood, and agree to this EULA, including our zero tolerance policy for objectionable content and abusive behavior.
`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
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
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={styles.contentText}>{eulaContent}</Text>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onDecline}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              
              <Buttons
                title="I Accept"
                onPress={handleAccept}
                style={[
                  styles.button,
                  styles.acceptButton,
                  !hasScrolledToBottom && styles.disabledButton
                ]}
                disabled={!hasScrolledToBottom}
              />
            </View>
            
            {!hasScrolledToBottom && (
              <Text style={styles.scrollHint}>
                Please scroll to the bottom to accept the terms
              </Text>
            )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 22,
    marginBottom: 20,
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
    marginBottom: 10,
  },
  button: {
    flex: 0.48,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.gradient_light_purple,
  },
  declineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  declineButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  scrollHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EULAAgreement;
