import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import PlusIcon from "../../../../assets/svg/plusIcon";
import PromotionalCodeCard from "../../../../components/PromotionalCodeCard";
import styles from "./promotionalsCodeStyle";

interface PromotionalCode {
  id: string;
  code: string;
  description: string;
  discount: string;
  status?: "active" | "inactive" | "expired";
  usageCount?: number;
  maxUsage?: number;
}

interface PromotionalCodeProps {
  navigation?: any;
}

const PromotionalCode: React.FC<PromotionalCodeProps> = ({ navigation }) => {
  const [promotionalCodes] = useState<PromotionalCode[]>([
    {
      id: "1",
      code: "PARTY15",
      description: "15% OFF on all club event tickets ",
      discount: "15%",
      status: "active",
      usageCount: 25,
      maxUsage: 100,
    },
    {
      id: "2",
      code: "PARTY20",
      description: "20% OFF on all club event tickets",
      discount: "20%",
      status: "active",
      usageCount: 45,
      maxUsage: 50,
    },
    {
      id: "3",
      code: "PARTY30",
      description: "30% OFF on all club event tickets",
      discount: "30%",
      status: "active",
      usageCount: 12,
      maxUsage: 75,
    },
    {
      id: "4",
      code: "PARTY35",
      description: "35% OFF on all club event tickets",
      discount: "35%",
      status: "active",
      usageCount: 8,
      maxUsage: 30,
    },
  ]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleAddPress = () => {
    navigation?.navigate("AddPromotionalCode");
  };

  const handleEditPress = (code: PromotionalCode) => {
    navigation?.navigate("EditPromotionalCode");
  };

  const handleDeletePress = (code: PromotionalCode) => {
    console.log("Delete promotional code:", code.code);
  };

  const renderPromotionalCodeCard = (code: PromotionalCode, index: number) => {
    return (
      <View
        key={code.id}
        style={index === 0 ? styles.firstCardContainer : null}
      >
        <PromotionalCodeCard
          promotionalCode={code}
          onEdit={handleEditPress}
          onDelete={handleDeletePress}
        />
      </View>
    );
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.profileCardBackground}
      statusBarStyle="light-content"
      statusBarBackgroundColor={colors.profileCardBackground}
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <BackButton navigation={navigation} onBackPress={handleBackPress} />
          <Text style={styles.headerTitle}>Promotional Codes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
            activeOpacity={0.7}
          >
            <PlusIcon />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {promotionalCodes.map((code, index) =>
            renderPromotionalCodeCard(code, index)
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default PromotionalCode;
