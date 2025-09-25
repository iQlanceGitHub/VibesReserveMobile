import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackButton } from "../../../../components/BackButton";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import ApplePayIcon from "../../../../assets/svg/applePayIcon";
import GoogleIcon from "../../../../assets/svg/googleIcon";
import VisaIcon from "../../../../assets/svg/visaIcon";
import MasterCard from "../../../../assets/svg/masterCard";
import paymentsStyles from "./paymentsStyle";

interface PaymentCard {
  id: string;
  cardType: "visa" | "mastercard";
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PaymentData {
  selectedCardId: string | null;
  selectedPaymentMethod: string | null;
  promoCode: string;
  selectedCard: PaymentCard | null;
}

const PaymentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [promoCode, setPromoCode] = useState<string>("");

  // Get payment data from route params (when navigating back from review summary)
  const paymentData = route.params as PaymentData;

  useEffect(() => {
    if (paymentData) {
      setSelectedCardId(paymentData.selectedCardId);
      setSelectedPaymentMethod(paymentData.selectedPaymentMethod);
      setPromoCode(paymentData.promoCode);
    }
  }, [paymentData]);
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([
    {
      id: "1",
      cardType: "visa",
      cardNumber: "**** **** **** 8563",
      cardholderName: "John Doe",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      cardType: "mastercard",
      cardNumber: "**** **** **** 8563",
      cardholderName: "Willie Jennings",
      expiryDate: "08/26",
      isDefault: false,
    },
  ]);

  const renderCardLogo = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return (
          <View>
            <VisaIcon width={45} height={45} />
          </View>
        );
      case "mastercard":
        return (
          <View>
            <MasterCard width={45} height={45} />
          </View>
        );
    }
  };

  const handleCardPress = (card: PaymentCard) => {
    setSelectedCardId(card.id);
    setSelectedPaymentMethod(null);
  };

  const handlePaymentMethodPress = (method: string) => {
    setSelectedPaymentMethod(method);
    setSelectedCardId(null);
  };

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      Alert.alert("Promo Code Applied", `Applied promo code: ${promoCode}`);
    } else {
      Alert.alert("Invalid Code", "Please enter a valid promo code");
    }
  };

  const handleNext = () => {
    const selectedCard = savedCards.find((card) => card.id === selectedCardId);
    const paymentData = {
      selectedCardId,
      selectedPaymentMethod,
      promoCode,
      selectedCard: selectedCard || null,
    };
    (navigation as any).navigate("ReviewSummary", paymentData);
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setSavedCards((prev) => prev.filter((card) => card.id !== cardId));
        },
      },
    ]);
  };

  const renderCard = (card: PaymentCard) => (
    <TouchableOpacity
      key={card.id}
      style={[
        paymentsStyles.cardContainer,
        selectedCardId === card.id && paymentsStyles.selectedCard,
      ]}
      onPress={() => handleCardPress(card)}
      activeOpacity={0.8}
    >
      <View style={paymentsStyles.cardContent}>
        <View style={paymentsStyles.cardLeft}>
          {renderCardLogo(card.cardType)}
        </View>

        <View style={paymentsStyles.cardRight}>
          <Text style={paymentsStyles.cardholderName}>
            {card.cardholderName}
          </Text>
          <Text style={paymentsStyles.cardNumber}>{card.cardNumber}</Text>
        </View>

        <TouchableOpacity
          style={paymentsStyles.deleteButton}
          onPress={() => handleDeleteCard(card.id)}
        >
          <Text style={paymentsStyles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={paymentsStyles.container}>
      <KeyboardAvoidingView
        style={paymentsStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={paymentsStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={paymentsStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={paymentsStyles.header}>
            <BackButton navigation={navigation} />
            <Text style={paymentsStyles.headerTitle}>Payment Method</Text>
            <View style={paymentsStyles.headerRight} />
          </View>

          <View style={paymentsStyles.section}>
            <View style={paymentsStyles.sectionHeader}>
              <Text style={paymentsStyles.sectioncards}>Saved Cards</Text>
            </View>

            <View style={paymentsStyles.cardsList}>
              {savedCards.map(renderCard)}
            </View>
          </View>
          <View style={paymentsStyles.paymentOptionsSection}>
            <Text style={paymentsStyles.sectionTitle}>
              More Payment Options
            </Text>

            <TouchableOpacity
              style={[
                paymentsStyles.paymentOptionButton,
                selectedPaymentMethod === "apple" &&
                  paymentsStyles.selectedPaymentOption,
              ]}
              onPress={() => handlePaymentMethodPress("apple")}
            >
              <View style={paymentsStyles.paymentOptionLeft}>
                <View style={paymentsStyles.appleLogo}>
                  <ApplePayIcon />
                </View>
                <Text style={paymentsStyles.paymentOptionText}>Apple Pay</Text>
              </View>
              <View
                style={[
                  paymentsStyles.radioButton,
                  selectedPaymentMethod === "apple" &&
                    paymentsStyles.selectedRadioButton,
                ]}
              >
                {selectedPaymentMethod === "apple" && (
                  <View style={paymentsStyles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                paymentsStyles.paymentOptionButton,
                selectedPaymentMethod === "google" &&
                  paymentsStyles.selectedPaymentOption,
              ]}
              onPress={() => handlePaymentMethodPress("google")}
            >
              <View style={paymentsStyles.paymentOptionLeft}>
                <View style={paymentsStyles.googleLogo}>
                  <GoogleIcon />
                </View>
                <Text style={paymentsStyles.paymentOptionText}>Google Pay</Text>
              </View>
              <View
                style={[
                  paymentsStyles.radioButton,
                  selectedPaymentMethod === "google" &&
                    paymentsStyles.selectedRadioButton,
                ]}
              >
                {selectedPaymentMethod === "google" && (
                  <View style={paymentsStyles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>

            <View style={paymentsStyles.promoCodeSection}>
              <View style={paymentsStyles.promoCodeContainer}>
                <TextInput
                  style={paymentsStyles.promoCodeInput}
                  placeholder="Promo Code"
                  placeholderTextColor={colors.textcolor}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <TouchableOpacity
                  style={paymentsStyles.applyButton}
                  onPress={handleApplyPromoCode}
                >
                  <Text style={paymentsStyles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Buttons title="Next" onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentsScreen;
