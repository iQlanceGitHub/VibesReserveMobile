import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackButton } from "../../../../components/BackButton";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import { stripeTestKey } from "../../../../utilis/appConstant";
import ApplePayIcon from "../../../../assets/svg/applePayIcon";
import GoogleIcon from "../../../../assets/svg/googleIcon";
import VisaIcon from "../../../../assets/svg/visaIcon";
import MasterCard from "../../../../assets/svg/masterCard";
import RefreshIcon from "../../../../assets/svg/refreshIcon";
import { 
  CardField, 
  useStripe, 
  ApplePay, 
  isPlatformPaySupported, 
  usePlatformPay, 
  PlatformPayButton, 
  PlatformPay 
} from '@stripe/stripe-react-native';
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
  selectedCard: PaymentCard | null;
  // Booking data fields
  bookingData?: any;
  eventData?: any;
  memberCount?: number;
  entryFee?: number;
  ticketPrice?: number;
  totalPrice?: number;
  maxCapacity?: number;
}

const PaymentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { confirmSetupIntent } = useStripe();
  const { confirmPlatformPayPayment } = usePlatformPay();
  const cardFieldRef = useRef<any>(null);
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Get payment data from route params (when navigating back from review summary)
  const paymentData = route.params as PaymentData;
  
  // Extract booking data from route params
  const { bookingData } = (route.params as any) || {};
  // Also check if data is passed as paymentData
  const actualBookingData = bookingData || paymentData;
  const eventData = actualBookingData?.eventData;
  const memberCount = actualBookingData?.memberCount || 1;
  const totalPrice = actualBookingData?.totalPrice || 0;

  // Print complete booking data for debugging
  useEffect(() => {
    console.log("=== PAYMENT SCREEN - COMPLETE BOOKING DATA ===");
    console.log("Full route.params:", route.params);
    console.log("Complete bookingData:", bookingData);
    console.log("PaymentData:", paymentData);
    console.log("ActualBookingData:", actualBookingData);
    
    if (actualBookingData) {
      console.log("📅 Selected Dates:");
      console.log("  - Start Date:", actualBookingData.selectedStartDate);
      console.log("  - End Date:", actualBookingData.selectedEndDate);
      console.log("  - Date Range:", actualBookingData.selectedDateRange);
      
      console.log("🎫 Ticket Information:");
      console.log("  - Selected Ticket:", actualBookingData.selectedTicket);
      console.log("  - Ticket ID:", actualBookingData.ticketId);
      console.log("  - Ticket Type:", actualBookingData.ticketType);
      
      console.log("👥 Booking Details:");
      console.log("  - Member Count:", actualBookingData.memberCount);
      console.log("  - Max Capacity:", actualBookingData.maxCapacity);
      console.log("  - Ticket Price per person:", actualBookingData.ticketPrice);
      console.log("  - Entry Fee:", actualBookingData.entryFee);
      console.log("  - Total Price:", actualBookingData.totalPrice);
      
      console.log("🏢 Event Information:");
      console.log("  - Event Data:", actualBookingData.eventData);
      console.log("  - Event Name:", actualBookingData.eventData?.name || actualBookingData.eventData?.title);
      console.log("  - Event Address:", actualBookingData.eventData?.address || actualBookingData.eventData?.location);
      
      console.log("📋 Additional Booking Details:");
      console.log("  - Booking Details Object:", actualBookingData.bookingDetails);
      
      // Debug undefined values
      if (!actualBookingData.ticketId) {
        console.log("⚠️ Ticket ID is undefined. Selected Ticket keys:", Object.keys(actualBookingData.selectedTicket || {}));
      }
      if (!actualBookingData.ticketType) {
        console.log("⚠️ Ticket Type is undefined. Selected Ticket:", actualBookingData.selectedTicket);
      }
      if (!actualBookingData.eventData?.name) {
        console.log("⚠️ Event Name is undefined. Event Data keys:", Object.keys(actualBookingData.eventData || {}));
      }
    } else {
      console.log("❌ No booking data received!");
      console.log("Debugging info:");
      console.log("  - route.params type:", typeof route.params);
      console.log("  - route.params keys:", Object.keys(route.params || {}));
      console.log("  - bookingData from route.params:", (route.params as any)?.bookingData);
      console.log("  - paymentData:", paymentData);
      console.log("  - paymentData type:", typeof paymentData);
      console.log("  - paymentData keys:", Object.keys(paymentData || {}));
    }
    console.log("=== END BOOKING DATA ===");
  }, [actualBookingData]);

  useEffect(() => {
    if (paymentData) {
      setSelectedCardId(paymentData.selectedCardId);
      setSelectedPaymentMethod(paymentData.selectedPaymentMethod);
    }
    // Load cards when component mounts
    loadSavedCards();
    
    // Check platform pay support
    checkPlatformPaySupport();
    
    // Set payment amount from booking data
    console.log("=== PAYMENT AMOUNT CALCULATION ===");
    console.log("TotalPrice from booking data:", totalPrice);
    console.log("PaymentData totalPrice:", paymentData?.totalPrice);
    console.log("BookingData totalPrice:", actualBookingData?.totalPrice);
    console.log("Final payment amount:", totalPrice || 250);
    console.log("=== END PAYMENT AMOUNT ===");
    setPaymentAmount(totalPrice || 250); // Use total price from booking data
  }, [paymentData]);

  // Check platform pay support
  const checkPlatformPaySupport = async () => {
    try {
      const supported = await isPlatformPaySupported({
        googlePay: {
          testEnv: false, // Set to false in production
        }
      });
      setIsGooglePaySupported(supported);
    } catch (error) {
      console.error('Error checking platform pay support:', error);
    }
  };

  // Load saved cards from API
  const loadSavedCards = async () => {
    setLoadingCards(true);
    setError(null);
    try {
      // Replace with your actual API endpoint cus_Qku0xGw4IT9bke
 
      const response = await fetch('https://api.stripe.com/v1/payment_methods?customer=cus_T7lZ5LfIt7RqBf&type=card', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${stripeTestKey.secreteKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data = await response.json();
      
      if (data.data) {
        const formattedCards: PaymentCard[] = data.data.map((card: any) => ({
          id: card.id,
          cardType: card.card.brand.toLowerCase() as "visa" | "mastercard",
          cardNumber: `**** **** **** ${card.card.last4}`,
          cardholderName: `${card.card.brand.toUpperCase()} CARD` || 'Card Holder',
          expiryDate: `${card.card.exp_month.toString().padStart(2, '0')}/${card.card.exp_year.toString().slice(-2)}`,
          isDefault: false, // You can implement default card logic
        }));
        setSavedCards(formattedCards);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      setError('Failed to load cards. Using demo data.');
      // Fallback to demo data
      setSavedCards([
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
          cardNumber: "**** **** **** 5555",
          cardholderName: "Willie Jennings",
          expiryDate: "08/26",
          isDefault: false,
        },
      ]);
    } finally {
      setLoadingCards(false);
    }
  };

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
      default:
        return (
          <View style={paymentsStyles.defaultCardIcon}>
            <Text style={paymentsStyles.defaultCardText}>
              {cardType.charAt(0).toUpperCase()}
            </Text>
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


  const handleNext = () => {
    const selectedCard = savedCards.find((card) => card.id === selectedCardId);
    const paymentData = {
      selectedCardId,
      selectedPaymentMethod,
      selectedCard: selectedCard || null,
      paymentAmount,
      // Include complete booking data
      bookingData: actualBookingData,
      eventData: actualBookingData?.eventData,
      memberCount: actualBookingData?.memberCount,
      entryFee: actualBookingData?.entryFee,
      ticketPrice: actualBookingData?.ticketPrice,
      totalPrice: actualBookingData?.totalPrice,
      maxCapacity: actualBookingData?.maxCapacity,
      // Add all booking details for ReviewSummary
      selectedStartDate: actualBookingData?.selectedStartDate,
      selectedEndDate: actualBookingData?.selectedEndDate,
      selectedDateRange: actualBookingData?.selectedDateRange,
      selectedTicket: actualBookingData?.selectedTicket,
      ticketId: actualBookingData?.ticketId,
      ticketType: actualBookingData?.ticketType,
      bookingDetails: actualBookingData?.bookingDetails,
    };
    (navigation as any).navigate("ReviewSummary", paymentData);
  };

  // Process card payment
  const processCardPayment = async (cardId: string, amount: number) => {
    setIsProcessingPayment(true);
    try {
      const amountInCents = Math.round(amount * 100);
      
      const paymentIntentResponse = await fetch(
        'https://api.stripe.com/v1/payment_intents',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${stripeTestKey.secreteKey}`,
          },
          body: new URLSearchParams({
            amount: amountInCents.toString(),
            currency: 'usd',
            customer: 'cus_T7lZ5LfIt7RqBf', // Use your customer ID
            payment_method: cardId,
            off_session: 'true',
            confirm: 'true',
          }).toString(),
        },
      );

      const paymentIntent = await paymentIntentResponse.json();

      if (paymentIntent.error) {
        Alert.alert('Payment Error', paymentIntent.error.message);
      } else {
        Alert.alert('Success', 'Payment processed successfully!');
        // Navigate to success screen or handle success
        (navigation as any).navigate("ReviewSummary", { 
          paymentIntent,
          paymentMethod: 'card',
          amount: amount,
          // Include complete booking data
          bookingData: actualBookingData,
          eventData: actualBookingData?.eventData,
          memberCount: actualBookingData?.memberCount,
          entryFee: actualBookingData?.entryFee,
          ticketPrice: actualBookingData?.ticketPrice,
          totalPrice: actualBookingData?.totalPrice,
          maxCapacity: actualBookingData?.maxCapacity,
          selectedStartDate: actualBookingData?.selectedStartDate,
          selectedEndDate: actualBookingData?.selectedEndDate,
          selectedDateRange: actualBookingData?.selectedDateRange,
          selectedTicket: actualBookingData?.selectedTicket,
          ticketId: actualBookingData?.ticketId,
          ticketType: actualBookingData?.ticketType,
          bookingDetails: actualBookingData?.bookingDetails,
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              `https://api.stripe.com/v1/payment_methods/${cardId}/detach`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${stripeTestKey.secreteKey}`,
                },
              },
            );

            if (response.ok) {
              Alert.alert('Success', 'Card deleted successfully');
              // Reload cards to get the updated list
              loadSavedCards();
            } else {
              Alert.alert('Error', 'Failed to delete card');
            }
          } catch (error) {
            console.error('Error deleting card:', error);
            Alert.alert('Error', 'Failed to delete card. Please try again.');
          }
        },
      },
    ]);
  };

  const handleAddCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Please enter complete card details');
      return;
    }

    setLoading(true);
    try {
      // Create a SetupIntent on the client side
      const setupIntentResponse = await fetch(
        'https://api.stripe.com/v1/setup_intents',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${stripeTestKey.secreteKey}`,
          },
          body: new URLSearchParams({
            customer: 'cus_T7lZ5LfIt7RqBf', // Replace with actual customer ID
            'payment_method_types[]': 'card',
          }).toString(),
        },
      );

      const setupIntent = await setupIntentResponse.json();

      if (setupIntent.error) {
        Alert.alert(`Error: ${setupIntent.error.message}`);
        return;
      }

      // Confirm the SetupIntent
      const {setupIntent: confirmedSetupIntent, error} =
        await confirmSetupIntent(setupIntent.client_secret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {email: 'mailto:email@example.com'},
          },
        });

      if (error) {
        Alert.alert(`Error: ${error.message}`);
      } else {
        Alert.alert('Success', 'Card added successfully!');
        setShowAddCard(false);
        handleClearCard();
        // Reload cards to get the updated list
        loadSavedCards();
      }
    } catch (error) {
      console.error('Error adding card:', error);
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCard = () => {
    if (cardFieldRef.current) {
      cardFieldRef.current.clear();
    }
  };

  const toggleAddCard = () => {
    setShowAddCard(!showAddCard);
    if (showAddCard) {
      handleClearCard();
    }
  };

  // Apple Pay payment
  const payWithApplePay = async () => {
    try {
      const amountInCents = Math.round(paymentAmount * 100);
      
      const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${stripeTestKey.secreteKey}`,
        },
        body: new URLSearchParams({
          amount: amountInCents.toString(),
          currency: 'usd',
          customer: 'cus_T7lZ5LfIt7RqBf',
        }).toString(),
      });

      const { client_secret } = await paymentIntentResponse.json();
      
      const { error, paymentIntent } = await confirmPlatformPayPayment(client_secret, {
        applePay: {
          cartItems: [
            {
              label: 'Your Order',
              amount: paymentAmount.toFixed(2),
              paymentType: 'Immediate',
            } as any,
          ],
          merchantCountryCode: 'US',
          currencyCode: 'USD',
        },
      });

      if (error) {
        Alert.alert('Apple Pay Error', error.localizedMessage || error.message);
      } else {
        Alert.alert('Success', 'Apple Pay payment successful!');
        (navigation as any).navigate("ReviewSummary", { 
          paymentIntent,
          paymentMethod: 'apple_pay',
          amount: paymentAmount,
          bookingData: actualBookingData,
          eventData: actualBookingData?.eventData,
          memberCount: actualBookingData?.memberCount,
          entryFee: actualBookingData?.entryFee,
          ticketPrice: actualBookingData?.ticketPrice,
          totalPrice: actualBookingData?.totalPrice,
          maxCapacity: actualBookingData?.maxCapacity,
          selectedStartDate: actualBookingData?.selectedStartDate,
          selectedEndDate: actualBookingData?.selectedEndDate,
          selectedDateRange: actualBookingData?.selectedDateRange,
          selectedTicket: actualBookingData?.selectedTicket,
          ticketId: actualBookingData?.ticketId,
          ticketType: actualBookingData?.ticketType,
          bookingDetails: actualBookingData?.bookingDetails,
        });
      }
    } catch (error: any) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay payment failed. Please try again.');
    }
  };

  // Google Pay payment
  const payWithGooglePay = async () => {
    try {
      const amountInCents = Math.round(paymentAmount * 100);
      
      const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${stripeTestKey.secreteKey}`,
        },
        body: new URLSearchParams({
          amount: amountInCents.toString(),
          currency: 'usd',
          customer: 'cus_T7lZ5LfIt7RqBf',
        }).toString(),
      });

      const { client_secret } = await paymentIntentResponse.json();
      
      const { error, paymentIntent } = await confirmPlatformPayPayment(client_secret, {
        googlePay: {
          merchantName: 'VibesReserve',
          merchantCountryCode: 'US',
          currencyCode: 'USD',
          testEnv: false,
        },
      });

      if (error) {
        Alert.alert('Google Pay Error', error.message);
      } else {
        Alert.alert('Success', 'Google Pay payment successful!');
        (navigation as any).navigate("ReviewSummary", { 
          paymentIntent,
          paymentMethod: 'google_pay',
          amount: paymentAmount,
          // Include complete booking data
          bookingData: actualBookingData,
          eventData: actualBookingData?.eventData,
          memberCount: actualBookingData?.memberCount,
          entryFee: actualBookingData?.entryFee,
          ticketPrice: actualBookingData?.ticketPrice,
          totalPrice: actualBookingData?.totalPrice,
          maxCapacity: actualBookingData?.maxCapacity,
          selectedStartDate: actualBookingData?.selectedStartDate,
          selectedEndDate: actualBookingData?.selectedEndDate,
          selectedDateRange: actualBookingData?.selectedDateRange,
          selectedTicket: actualBookingData?.selectedTicket,
          ticketId: actualBookingData?.ticketId,
          ticketType: actualBookingData?.ticketType,
          bookingDetails: actualBookingData?.bookingDetails,
        });
      }
    } catch (error: any) {
      console.error('Google Pay error:', error);
      Alert.alert('Error', 'Google Pay payment failed. Please try again.');
    }
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

          {/* Booking Data Display - Debug Section */}
          {/* {actualBookingData && (
            <View style={{
              backgroundColor: '#f0f0f0',
              margin: 10,
              padding: 15,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd'
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#333'
              }}>
                📋 Booking Data Received
              </Text>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>📅 Dates:</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {actualBookingData.selectedDateRange?.formatted || 'No dates selected'}
                </Text>
              </View>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>🎫 Ticket:</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {actualBookingData.ticketType} (ID: {actualBookingData.ticketId})
                </Text>
              </View>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>👥 Members:</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {actualBookingData.memberCount} of {actualBookingData.maxCapacity}
                </Text>
              </View>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>💰 Pricing:</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  ${actualBookingData.ticketPrice} per person × {actualBookingData.memberCount} = ${actualBookingData.totalPrice}
                </Text>
              </View>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>🏢 Event:</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {actualBookingData.eventData?.name || 'Unknown Event'}
                </Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {actualBookingData.eventData?.address || 'No address'}
                </Text>
              </View>
            </View>
          )} */}

          <View style={paymentsStyles.section}>
            <View style={paymentsStyles.sectionHeader}>
              <Text style={paymentsStyles.sectioncards}>Saved Cards</Text>
              <View style={paymentsStyles.headerButtons}>
                <TouchableOpacity
                  onPress={loadSavedCards}
                  style={paymentsStyles.refreshButton}
                  disabled={loadingCards}
                >
                  {loadingCards ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <RefreshIcon width={16} height={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleAddCard}
                  style={paymentsStyles.addCardButton}
                >
                  <Text style={paymentsStyles.addCardButtonText}>
                    {showAddCard ? 'Cancel' : '+ Add Card'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {loadingCards ? (
              <View style={paymentsStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.violate} />
                <Text style={paymentsStyles.loadingText}>Loading cards...</Text>
              </View>
            ) : error ? (
              <View style={paymentsStyles.errorContainer}>
                <Text style={paymentsStyles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={loadSavedCards}
                  style={paymentsStyles.retryButton}
                >
                  <Text style={paymentsStyles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : savedCards.length > 0 ? (
              <View style={paymentsStyles.cardsList}>
                {savedCards.map(renderCard)}
              </View>
            ) : (
              <View style={paymentsStyles.emptyState}>
                <Text style={paymentsStyles.emptyStateText}>No saved cards found</Text>
                <TouchableOpacity
                  onPress={toggleAddCard}
                  style={paymentsStyles.addFirstCardButton}
                >
                  <Text style={paymentsStyles.addFirstCardButtonText}>Add Your First Card</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Add Card Form */}
            {showAddCard && (
              <View style={paymentsStyles.addCardSection}>
                <Text style={paymentsStyles.addCardTitle}>Add New Card</Text>
                
                <View style={paymentsStyles.cardFieldContainer}>
                  <CardField
                    ref={cardFieldRef}
                    postalCodeEnabled={false}
                    placeholders={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      backgroundColor: '#1A0037',
                      textColor: '#FFFFFF',
                      borderColor: '#8D34FF',
                      borderWidth: 1,
                      borderRadius: 12,
                      placeholderColor: '#868C98',
                    }}
                    style={paymentsStyles.cardField}
                    onCardChange={cardDetails => {
                      setCardDetails(cardDetails);
                    }}
                    onFocus={focusedField => {
                      // Handle focus if needed
                    }}
                  />
                </View>

                <View style={paymentsStyles.addCardButtons}>
                  <TouchableOpacity
                    onPress={toggleAddCard}
                    style={paymentsStyles.cancelButton}
                  >
                    <Text style={paymentsStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleAddCard}
                    style={[paymentsStyles.addButton, loading && paymentsStyles.disabledButton]}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={paymentsStyles.addButtonText}>Add Card</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View style={paymentsStyles.paymentOptionsSection}>
            <Text style={paymentsStyles.sectionTitle}>
              More Payment Options
            </Text>
            { Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[
                paymentsStyles.paymentOptionButton,
                selectedPaymentMethod === "apple" &&
                  paymentsStyles.selectedPaymentOption,
              ]}
              onPress={() => 
                //handlePaymentMethodPress("apple")
                //Alert.alert("Apple Pay is not supported")
                Alert.alert("Apple Pay profile is pending")
              }
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
            )}
            { Platform.OS === 'android' && isGooglePaySupported && (
            <TouchableOpacity
              style={[
                paymentsStyles.paymentOptionButton,
                selectedPaymentMethod === "google" &&
                  paymentsStyles.selectedPaymentOption,
              ]}
              onPress={() => 
                // handlePaymentMethodPress("google")}
                Alert.alert("Google Business profile is pending")
              }
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
            )}

            <Buttons 
              title={isProcessingPayment ? "Processing..." : "Next"} 
              onPress={handleNext}
              disabled={isProcessingPayment}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentsScreen;
