import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { horizontalScale } from "../utilis/appConstant";
import StarIcon from "../assets/svg/starIcon";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 24,
  disabled = false,
}) => {
  const renderStar = (index: number) => {
    const isFilled = index < rating;

    return (
      <TouchableOpacity
        key={index}
        style={styles.starContainer}
        onPress={() => !disabled && onRatingChange(index + 1)}
        disabled={disabled}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <StarIcon
          size={size}
          color={isFilled ? colors.violate : "#525866"}
          filled={isFilled}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  starContainer: {
    marginHorizontal: horizontalScale(6),
    padding: horizontalScale(4),
  },
});

export default StarRating;
