import React, { FC, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import BackIcon from "../../../../assets/svg/backIcon";
import ApplePayIcon from "../../../../assets/svg/applePayIcon";
import GoogleIcon from "../../../../assets/svg/googleIcon";
import HeartIcon from "../../../../assets/svg/heartIcon";
import LocationFavourite from "../../../../assets/svg/locationFavourite";
import ClockIcon from "../../../../assets/svg/clockIcon";
import ArrowRightIcon from "../../../../assets/svg/arrowRightIcon";
import DottedLine from "../../../../assets/svg/dottedLine";
import { styles } from "./reviewSummeryStyle";
import { onReviewSummary } from "../../../../redux/auth/actions";
import { 
  useStripe, 
  ApplePay, 
  isPlatformPaySupported, 
  usePlatformPay, 
  PlatformPayButton, 
  PlatformPay 
} from '@stripe/stripe-react-native';
import { stripeTestKey } from "../../../../utilis/appConstant";

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
  paymentAmount?: number;
  paymentIntent?: any;
  paymentMethod?: string;
  // New booking data fields
  memberCount?: number;
  entryFee?: number;
  ticketPrice?: number;
  totalPrice?: number;
  maxCapacity?: number;
  eventData?: any;
  bookingData?: any;
}

interface ReviewSummaryProps {
  navigation: any;
  onConfirmPayment?: () => void;
  onBackPress?: () => void;
  onEventPress?: () => void;
  onPaymentMethodChange?: () => void;
}

interface EventData {
  _id: string;
  type: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    countrycode: string;
  };
  name: string;
  entryFee: number;
  openingTime: string;
  startDate: string;
  address: string;
  booths: Array<{
    boothName: string;
    boothType: {
      _id: string;
      name: string;
    };
    boothPrice: number;
    capacity: number;
    discountedPrice: number;
    boothImage: string[];
    _id: string;
  }>;
  tickets: any[];
  photos: string[];
}

interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  boothName: string;
}

interface PriceBreakdown {
  memberCost: number;
  boothCost: number;
  discount: string;
  fees: string;
  total: number;
}

export const ReviewSummary: FC<ReviewSummaryProps> = ({
  navigation,
  onConfirmPayment,
  onBackPress,
  onEventPress,
  onPaymentMethodChange,
}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const nav = useNavigation();
  const { reviewSummary, reviewSummaryErr, loader } = useSelector(
    (state: any) => state.auth
  );
  
  // Stripe hooks
  const { confirmPayment } = useStripe();
  const { confirmPlatformPayPayment } = usePlatformPay();
  
  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  // Get payment data from route params
  const paymentData = route.params as PaymentData;
  const {
    selectedCard,
    selectedPaymentMethod,
    promoCode: routePromoCode,
  } = paymentData || {};

  // Debug: Log payment data to see what's being passed
  console.log("ReviewSummary paymentData:", paymentData);
  console.log("ReviewSummary bookingData:", paymentData?.bookingData);

  const [promoCode, setPromoCode] = useState(routePromoCode || "");
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null
  );

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const staticPayload = {
      eventid: "68d2413a82858961d66eb53b",
      members: 4,
      days: 4,
    };

    dispatch(onReviewSummary(staticPayload));
    
    // Check platform pay support
    checkPlatformPaySupport();
  }, [dispatch]);

  // Check platform pay support
  const checkPlatformPaySupport = async () => {
    try {
      const supported = await isPlatformPaySupported({
        googlePay: {
          testEnv: false,
        }
      });
      setIsGooglePaySupported(supported);
    } catch (error) {
      console.error('Error checking platform pay support:', error);
    }
  };

  useEffect(() => {
    if (reviewSummary && reviewSummary.status === 1) {
      setEventData(reviewSummary.data);
      setPriceBreakdown(reviewSummary.summary);

      if (reviewSummary.data && reviewSummary.data.userId) {
        setUserData({
          fullName: reviewSummary.data.userId.fullName || "N/A",
          phoneNumber: reviewSummary.data.userId.phone || "N/A",
          email: reviewSummary.data.userId.email || "N/A",
          boothName:
            reviewSummary.data.booths && reviewSummary.data.booths[0]
              ? reviewSummary.data.booths[0].boothName
              : "N/A",
        });
      }
    }
  }, [reviewSummary]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleEventPress = () => {
    if (onEventPress) {
      onEventPress();
    }
  };

  const handlePaymentMethodChange = () => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange();
    } else {
      // Navigate back to payments screen with current data
      (nav as any).navigate("PaymentScreen", paymentData);
    }
  };

  const renderCardLogo = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return (
          <View style={styles.textLogoContainer}>
            <Text style={[styles.textLogo, { color: "#1A1F71" }]}>VISA</Text>
          </View>
        );
      case "mastercard":
        return (
          <View style={styles.textLogoContainer}>
            <View style={styles.mastercardLogo}>
              <View
                style={[
                  styles.mastercardCircle,
                  { backgroundColor: "#EB001B" },
                ]}
              />
              <View
                style={[
                  styles.mastercardCircle,
                  { backgroundColor: "#F79E1B" },
                ]}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const handleConfirmPayment = async () => {
    if (paymentData?.paymentIntent) {
      // Payment already processed, navigate to success
      navigation.navigate("PaymentSuccessScreen");
      return;
    }

    if (paymentData?.selectedCard) {
      // Process card payment
      await processCardPayment();
    } else if (paymentData?.selectedPaymentMethod === 'apple_pay') {
      // Process Apple Pay
      await processApplePay();
    } else if (paymentData?.selectedPaymentMethod === 'google_pay') {
      // Process Google Pay
      await processGooglePay();
    } else {
      Alert.alert('Error', 'Please select a payment method');
    }
  };

  // Process card payment
  const processCardPayment = async () => {
    if (!paymentData?.selectedCard) {
      Alert.alert('Error', 'No card selected');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const amount = paymentData?.paymentAmount || priceBreakdown?.total || 0;
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
            customer: 'cus_T7lZ5LfIt7RqBf',
            payment_method: paymentData.selectedCard.id,
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
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Process Apple Pay
  const processApplePay = async () => {
    try {
      const amount = paymentData?.paymentAmount || priceBreakdown?.total || 0;
      const amountInCents = Math.round(amount * 100);
      
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
              label: 'Event Booking',
              amount: amount.toFixed(2),
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
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error: any) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay payment failed. Please try again.');
    }
  };

  // Process Google Pay
  const processGooglePay = async () => {
    try {
      const amount = paymentData?.paymentAmount || priceBreakdown?.total || 0;
      const amountInCents = Math.round(amount * 100);
      
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
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error: any) {
      console.error('Google Pay error:', error);
      Alert.alert('Error', 'Google Pay payment failed. Please try again.');
    }
  };

  const handleApplyPromoCode = () => {
    // Handle promo code application logic here
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.gradient_dark_purple}
      statusBarStyle="light-content"
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Summary</Text>
            <View style={styles.headerSpacer} />
          </View>

          {eventData ? (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={handleEventPress}
            >
              <View style={styles.eventImageContainer}>
                <Image
                  source={{
                    uri:
                      eventData.photos[0] ||
                      "https://via.placeholder.com/100x80/8D34FF/FFFFFF?text=Event",
                  }}
                  style={styles.eventImage}
                />
                <TouchableOpacity style={styles.favoriteButton}>
                  <HeartIcon color={colors.white} filled={false} />
                </TouchableOpacity>
              </View>

              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{eventData.type}</Text>
                  </View>
                  <Text style={styles.eventPrice}>${eventData.entryFee}</Text>
                </View>

                <Text style={styles.eventTitle}>{eventData.name}</Text>

                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <LocationFavourite color={colors.violate} />
                    <Text style={styles.detailText}>{eventData.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <ClockIcon color={colors.violate} />
                    <Text style={styles.detailText}>
                      {new Date(eventData.startDate).toLocaleDateString()} -{" "}
                      {eventData.openingTime}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.eventActionButton}>
                  <ArrowRightIcon color={colors.white} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.eventCard}>
              <View
                style={[
                  styles.eventContent,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                  },
                ]}
              >
                <Text style={[styles.eventTitle, { color: colors.white }]}>
                  {loader ? "Loading..." : "No event data available"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {userData ? userData.fullName : loader ? "Loading..." : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>
                {userData
                  ? userData.phoneNumber
                  : loader
                  ? "Loading..."
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {userData ? userData.email : loader ? "Loading..." : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Booth Name</Text>
              <Text style={styles.infoValue}>
                {userData ? userData.boothName : loader ? "Loading..." : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {priceBreakdown ? (
            <View style={styles.sectionContainerNoBorderReduced}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Entry Fee ({paymentData?.memberCount || paymentData?.bookingData?.memberCount || 1} members)</Text>
                <Text style={styles.priceValue}>
                  ${((paymentData?.entryFee || paymentData?.bookingData?.entryFee || 0) * (paymentData?.memberCount || paymentData?.bookingData?.memberCount || 1)).toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Ticket Price ({paymentData?.memberCount || paymentData?.bookingData?.memberCount || 1} members)</Text>
                <Text style={styles.priceValue}>
                  ${((paymentData?.ticketPrice || paymentData?.bookingData?.ticketPrice || 0) * (paymentData?.memberCount || paymentData?.bookingData?.memberCount || 1)).toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={styles.priceValue}>
                  -${priceBreakdown.discount}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Fees</Text>
                <Text style={styles.priceValue}>${priceBreakdown.fees}</Text>
              </View>
              <View style={styles.dottedLineContainer}>
                <DottedLine />
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${(paymentData?.totalPrice || paymentData?.bookingData?.totalPrice || priceBreakdown.total).toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          ) : (
            <View style={styles.sectionContainerNoBorderReduced}>
              <View
                style={[
                  styles.priceRow,
                  { justifyContent: "center", padding: 20 },
                ]}
              >
                <Text style={[styles.priceLabel, { color: colors.white }]}>
                  {loader ? "Loading pricing..." : "No pricing data available"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.paymentMethodLeft}>
                {selectedPaymentMethod === "apple" || selectedPaymentMethod === "apple_pay" ? (
                  <ApplePayIcon />
                ) : selectedPaymentMethod === "google" || selectedPaymentMethod === "google_pay" ? (
                  <GoogleIcon />
                ) : selectedCard ? (
                  renderCardLogo(selectedCard.cardType)
                ) : Platform.OS === 'ios' ? (
                  <ApplePayIcon />
                ) : (
                  <GoogleIcon />
                )}
                
                <Text style={styles.paymentMethodText}>
                  {selectedPaymentMethod === "apple" || selectedPaymentMethod === "apple_pay"
                    ? "Apple Pay"
                    : selectedPaymentMethod === "google" || selectedPaymentMethod === "google_pay"
                    ? "Google Pay"
                    : selectedCard
                    ? `${selectedCard.cardType.toUpperCase()} •••• ${selectedCard.cardNumber.slice(
                        -4
                      )}`
                    : Platform.OS === 'ios' ? "Apple Pay" : "Google Pay"}
                </Text>
              </View>
              <TouchableOpacity onPress={handlePaymentMethodChange}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform-specific payment buttons */}
          <View style={styles.platformPaymentSection}>
            {/* Apple Pay Button - Show on iOS or when Apple Pay is selected */}
            {(selectedPaymentMethod === 'apple' || selectedPaymentMethod === 'apple_pay' || (Platform.OS === 'ios' && !selectedPaymentMethod && !selectedCard)) && (
              <View style={styles.platformPayContainer}>
                <PlatformPayButton
                  onPress={processApplePay}
                  type={PlatformPay.ButtonType.Pay}
                  borderRadius={8}
                  style={styles.platformPayButton}
                />
              </View>
            )}

            {/* Google Pay Button - Show on Android or when Google Pay is selected */}
            {(selectedPaymentMethod === 'google' || selectedPaymentMethod === 'google_pay' || (Platform.OS === 'android' && !selectedPaymentMethod && !selectedCard && isGooglePaySupported)) && (
              <View style={styles.platformPayContainer}>
                <PlatformPayButton
                  onPress={processGooglePay}
                  type={PlatformPay.ButtonType.Default}
                  borderRadius={4}
                  style={styles.platformPayButton}
                />
              </View>
            )}

            {/* Card Payment Button - Show when card is selected */}
            {selectedCard && (
              <View style={styles.cardPaymentContainer}>
                <Buttons
                  title={isProcessingPayment ? "Processing Card Payment..." : "Confirm Payment"}
                  onPress={processCardPayment}
                  style={styles.cardPaymentButton}
                  disabled={isProcessingPayment}
                />
              </View>
            )}
          </View>
          {selectedPaymentMethod === "apple" || selectedPaymentMethod === "apple_pay" || selectedPaymentMethod === "google" || selectedPaymentMethod === "google_pay" ? 
          
        null :  null
          }
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default ReviewSummary;
