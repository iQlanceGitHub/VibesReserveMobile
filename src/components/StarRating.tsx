import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utilis/colors";
import { horizontalScale } from "../utilis/appConstant";
import StarNew from "../assets/svg/starNew";

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
        <StarNew
          width={size}
          height={size}
          stroke={isFilled ? "#FFD700" : "#525866"}
          fill={isFilled ? "#FFD700" : "none"}
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
