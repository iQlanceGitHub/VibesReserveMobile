import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { colors } from "../utilis/colors";
import StarIcon from "../assets/svg/starIcon";
import FlagContentModal from "./FlagContentModal";
import UnblockUserModal from "./UnblockUserModal";
import ModerationService from "../services/moderationService";
import { useModeration } from "../contexts/ModerationContext";
import styles from "./reviewCardStyles";

interface ReviewCardProps {
  userName: string;
  userImage: any;
  rating: number;
  reviewText: string;
  reviewId?: string;
  reporterId?: string;
  userId?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  userImage,
  rating,
  reviewText,
  reviewId,
  reporterId,
  userId,
}) => {
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const { isUserBlocked, unblockUser, getBlockedUserInfo } = useModeration();
  
  const isBlocked = userId ? isUserBlocked(userId) : false;
  const blockedUserInfo = userId ? getBlockedUserInfo(userId) : null;

  const handleFlagReview = () => {
    if (!reviewId) {
      Alert.alert("Error", "Cannot flag this review. Review ID is missing.");
      return;
    }
    setShowFlagModal(true);
  };

  const handleSubmitFlag = async (reason: string, details: string) => {
    if (!reviewId || !reporterId) {
      Alert.alert("Error", "Missing required information for reporting.");
      return;
    }

    try {
      const moderationService = ModerationService.getInstance();
      await moderationService.reportContent(
        'review',
        reviewId,
        reason,
        details,
        reporterId
      );
      
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. We will review this content within 24 hours.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
    
    setShowFlagModal(false);
  };

  const handleUnblockUser = async () => {
    if (!userId || !reporterId) {
      Alert.alert("Error", "Missing required information for unblocking.");
      return;
    }

    try {
      await unblockUser(userId, reporterId);
      setShowUnblockModal(false);
    } catch (error) {
      console.error('Failed to unblock user:', error);
      Alert.alert('Error', 'Failed to unblock user. Please try again.');
    }
  };
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        size={12}
        color={index < rating ? colors.yellow : colors.gray}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.reviewContent}>
        <View style={styles.userInfo}>
          <Image source={userImage} style={styles.profileImage} />
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={[styles.userName, isBlocked && styles.blockedUserName]}>
                {userName}
              </Text>
              {isBlocked && (
                <View style={styles.blockedIndicator}>
                  <Text style={styles.blockedText}>BLOCKED</Text>
                </View>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingValue}>({rating}.0)</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            {isBlocked ? (
              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => setShowUnblockModal(true)}
              >
                <Text style={styles.unblockButtonText}>Unblock</Text>
              </TouchableOpacity>
            ) : (
              reviewId && (
                <TouchableOpacity
                  style={styles.flagButton}
                  onPress={handleFlagReview}
                >
                  <Text style={styles.flagButtonText}>Report</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
        <Text style={[styles.reviewText, isBlocked && styles.blockedReviewText]}>
          {isBlocked ? "This review is from a blocked user." : reviewText}
        </Text>
      </View>

      {/* Flag Modal */}
      <FlagContentModal
        visible={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        onSubmit={handleSubmitFlag}
        contentType="review"
        contentId={reviewId || ""}
      />

      {/* Unblock Modal */}
      <UnblockUserModal
        visible={showUnblockModal}
        onClose={() => setShowUnblockModal(false)}
        onUnblock={handleUnblockUser}
        userName={userName}
        userId={userId}
      />
    </View>
  );
};

export default ReviewCard;
