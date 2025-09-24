import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import EditIcon from "../assets/svg/editIcon";
import TrashIcon from "../assets/svg/trashIcon";
import { styles } from "./PromotionalCodeCardStyle";

interface PromotionalCode {
  id: string;
  code: string;
  description: string;
  discount: string;
  status?: "active" | "inactive" | "expired";
  usageCount?: number;
  maxUsage?: number;
}

interface PromotionalCodeCardProps {
  promotionalCode: PromotionalCode;
  onEdit: (code: PromotionalCode) => void;
  onDelete: (code: PromotionalCode) => void;
}

const PromotionalCodeCard: React.FC<PromotionalCodeCardProps> = ({
  promotionalCode,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={["#1F0045", "#120128"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.codeText}>{promotionalCode.code}</Text>
            <Text style={styles.descriptionText}>
              {promotionalCode.description}
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(promotionalCode)}
            >
              <EditIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(promotionalCode)}
            >
              <TrashIcon />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default PromotionalCodeCard;
