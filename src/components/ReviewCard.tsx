import React from "react";
import { View, Text, Image } from "react-native";
import { colors } from "../utilis/colors";
import StarIcon from "../assets/svg/starIcon";
import styles from "./reviewCardStyles";

interface ReviewCardProps {
  userName: string;
  userImage: any;
  rating: number;
  reviewText: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  userImage,
  rating,
  reviewText,
}) => {
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
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingValue}>({rating}.0)</Text>
            </View>
          </View>
        </View>
        <Text style={styles.reviewText}>{reviewText}</Text>
      </View>
    </View>
  );
};

export default ReviewCard;
