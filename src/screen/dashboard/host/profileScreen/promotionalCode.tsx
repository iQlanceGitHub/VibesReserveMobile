import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import PlusIcon from "../../../../assets/svg/plusIcon";
import PromotionalCodeCard from "../../../../components/PromotionalCodeCard";
import CustomAlert from "../../../../components/CustomAlert";
import {
  onGetPromoCodes,
  onDeletePromoCode,
} from "../../../../redux/auth/actions";
import styles from "./promotionalsCodeStyle";

interface PromotionalCode {
  _id: string;
  code: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface PromotionalCodeProps {
  navigation?: any;
}

const PromotionalCode: React.FC<PromotionalCodeProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    getPromoCodes,
    getPromoCodesErr,
    deletePromoCode,
    deletePromoCodeErr,
  } = useSelector((state: any) => state.auth);
  const [promotionalCodes, setPromotionalCodes] = useState<PromotionalCode[]>(
    []
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCode, setSelectedCode] = useState<PromotionalCode | null>(
    null
  );

  useEffect(() => {
    dispatch(onGetPromoCodes({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (getPromoCodes?.data && Array.isArray(getPromoCodes.data)) {
      setPromotionalCodes(getPromoCodes.data);
    } else if (getPromoCodes?.status === 1 && getPromoCodes?.data) {
      setPromotionalCodes(getPromoCodes.data);
    }
  }, [getPromoCodes, getPromoCodesErr]);

  // Handle delete promotional code response
  useEffect(() => {
    if (deletePromoCode?.status === 1 || deletePromoCode?.status === true) {
      setIsDeleting(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2:
          deletePromoCode?.message || "Promotional code deleted successfully!",
        position: "top",
      });
      // Refresh the list after successful deletion
      dispatch(onGetPromoCodes({ page: 1, limit: 10 }));
    } else if (deletePromoCodeErr) {
      setIsDeleting(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          deletePromoCodeErr?.message || "Failed to delete promotional code",
        position: "top",
      });
    }
  }, [deletePromoCode, deletePromoCodeErr, dispatch]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(onGetPromoCodes({ page: 1, limit: 10 }));
    }, [dispatch])
  );

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleAddPress = () => {
    navigation?.navigate("AddPromotionalCode");
  };

  const handleEditPress = (code: PromotionalCode) => {
    navigation?.navigate("EditPromotionalCode", { promoCode: code });
  };

  const handleDeletePress = (code: PromotionalCode) => {
    setSelectedCode(code);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCode) {
      setIsDeleting(true);
      dispatch(onDeletePromoCode({ id: selectedCode._id }));
    }
    setShowDeleteAlert(false);
    setSelectedCode(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteAlert(false);
    setSelectedCode(null);
  };

  const isPromoCodeActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const renderPromotionalCodeCard = (code: PromotionalCode, index: number) => {
    const isActive = isPromoCodeActive(code.startDate, code.endDate);

    return (
      <View
        key={code._id}
        style={index === 0 ? styles.firstCardContainer : null}
      >
        <PromotionalCodeCard
          promotionalCode={{
            id: code._id,
            code: code.code,
            description: code.description,
            discount: `${code.discount}%`,
            status: isActive ? "active" : "expired",
          }}
          onEdit={() => handleEditPress(code)}
          onDelete={() => handleDeletePress(code)}
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
          {isDeleting && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={{ color: colors.white, marginTop: 10 }}>
                Deleting promotional code...
              </Text>
            </View>
          )}
          {getPromoCodesErr ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 50,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                Error loading promo codes. Please try again.
              </Text>
            </View>
          ) : promotionalCodes.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 50,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                No promo codes available.
              </Text>
            </View>
          ) : (
            promotionalCodes.map((code, index) =>
              renderPromotionalCodeCard(code, index)
            )
          )}
        </ScrollView>
      </LinearGradient>
      <Toast />

      <CustomAlert
        visible={showDeleteAlert}
        title="Delete Promotional Code"
        message={`Are you sure you want to delete the promotional code "${selectedCode?.code}"?`}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleConfirmDelete}
        onSecondaryPress={handleCancelDelete}
        onClose={handleCancelDelete}
        primaryButtonStyle={{
          backgroundColor: colors.red || "#FF4444",
        }}
        showSecondaryButton={true}
      />
    </SafeAreaWrapper>
  );
};

export default PromotionalCode;
