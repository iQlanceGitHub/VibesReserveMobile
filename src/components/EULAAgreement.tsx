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

Last Updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS
By using VibesReserve Mobile Application ("App"), you agree to be bound by this End User License Agreement ("EULA"). If you do not agree to these terms, please do not use the App.

2. USER-GENERATED CONTENT POLICY
2.1 Zero Tolerance Policy
We maintain a ZERO TOLERANCE policy for objectionable content and abusive behavior. This includes but is not limited to:
- Harassment, bullying, or threatening behavior
- Hate speech, discrimination, or offensive language
- Spam, scams, or fraudulent content
- Inappropriate sexual content
- Violence or graphic content
- Copyright infringement
- Personal information sharing without consent

2.2 Content Moderation
- All user-generated content (messages, reviews, comments, profiles) is subject to review
- We reserve the right to remove any content that violates our policies
- Users who violate these policies will be immediately suspended or banned
- We respond to content reports within 24 hours

2.3 User Responsibilities
- You are solely responsible for all content you post
- You must respect other users and maintain a positive community environment
- You must report any objectionable content or abusive users immediately
- You must not impersonate others or create fake accounts

3. REPORTING AND BLOCKING MECHANISMS
3.1 Reporting Content
- Use the "Report" button on any message, review, or profile
- Provide specific details about the violation
- False reports may result in account suspension

3.2 Blocking Users
- Use the "Block" button to prevent communication with abusive users
- Blocked users cannot contact you or see your content
- You can unblock users in your settings

3.3 Moderation Response
- All reports are reviewed within 24 hours
- Violating content is removed immediately
- Repeat offenders are permanently banned
- Appeals process available for disputed actions

4. PRIVACY AND DATA PROTECTION
4.1 Data Collection
- We collect necessary data to provide our services
- User-generated content is stored securely
- We do not sell personal data to third parties

4.2 Content Storage
- Messages and reviews are stored for service functionality
- Deleted content may be retained for moderation purposes
- You can request data deletion at any time

5. ACCOUNT SUSPENSION AND TERMINATION
5.1 Violation Consequences
- First offense: Warning and content removal
- Second offense: Temporary suspension (7-30 days)
- Third offense: Permanent ban
- Severe violations: Immediate permanent ban

5.2 Appeal Process
- Suspended users can appeal through support
- Appeals are reviewed within 48 hours
- False appeals may extend suspension period

6. INTELLECTUAL PROPERTY
6.1 Your Content
- You retain ownership of your original content
- You grant us license to display and moderate your content
- You are responsible for ensuring you have rights to post content

6.2 Our Content
- App design, features, and branding are our property
- Unauthorized copying or distribution is prohibited
- Trademark violations will result in immediate action

7. LIMITATION OF LIABILITY
- We are not liable for user-generated content
- We provide moderation tools but cannot guarantee 100% content safety
- Users interact at their own risk
- We are not responsible for third-party content

8. CHANGES TO TERMS
- We may update this EULA at any time
- Continued use constitutes acceptance of changes
- Major changes will be communicated via app notification
- Users can terminate account if they disagree with changes

9. CONTACT INFORMATION
For questions about this EULA or to report violations:
- Email: support@vibesreserve.com
- In-app support chat
- Report button on any content

10. GOVERNING LAW
This EULA is governed by applicable laws and regulations. Any disputes will be resolved through appropriate legal channels.

By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by this EULA, including our zero tolerance policy for objectionable content and abusive behavior.
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
