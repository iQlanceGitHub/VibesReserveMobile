import React, { FC, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
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
import {
  onReviewSummary,
  onCreateBooking,
  onFetchPromoCodes,
  onApplyPromoCode,
  onTogglefavorite,
  togglefavoriteData,
  togglefavoriteError,
  onGetProfileDetail,
  getProfileDetailData,
  getProfileDetailError,
} from "../../../../redux/auth/actions";
import {
  useStripe,
  ApplePay,
  isPlatformPaySupported,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
} from "@stripe/stripe-react-native";
import {
  stripeTestKey,
  horizontalScale,
  fontScale,
} from "../../../../utilis/appConstant";
import { handleRestrictedAction } from "../../../../utilis/userPermissionUtils";
import CustomAlert from "../../../../components/CustomAlert";

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
  tableNumber: string;
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
  const {
    reviewSummary,
    reviewSummaryErr,
    loader,
    createBooking,
    createBookingErr,
    togglefavorite,
    togglefavoriteErr,
    getProfileDetail,
    getProfileDetailErr,
  } = useSelector((state: any) => state.auth);

  // Stripe hooks
  const { confirmPayment } = useStripe();
  const { confirmPlatformPayPayment } = usePlatformPay();

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  // Profile details state
  const [profileDetail, setProfileDetail] = useState<any>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string>("");

  // Get payment data from route params
  const paymentData = route.params as PaymentData;
  const {
    selectedCard,
    selectedPaymentMethod,
    promoCode: routePromoCode,
  } = paymentData || {};

  // Extract booking data for dynamic calculations
  const bookingData = paymentData?.bookingData;
  const eventData = bookingData?.eventData || paymentData?.eventData;
  const memberCount = bookingData?.memberCount || paymentData?.memberCount || 1;
  const ticketPrice = bookingData?.ticketPrice || paymentData?.ticketPrice || 0;
  const entryFee = bookingData?.entryFee || paymentData?.entryFee || 0;
  const selectedStartDate = bookingData?.selectedStartDate;
  const selectedEndDate = bookingData?.selectedEndDate;
  const selectedTicket = bookingData?.selectedTicket;
  const ticketType =
    bookingData?.ticketType ||
    selectedTicket?.title ||
    selectedTicket?.name ||
    "General";
  const ticketId =
    bookingData?.ticketId || selectedTicket?.id || selectedTicket?._id || "";

  // Helper function to determine if we should include boothid
  const shouldIncludeBoothId = () => {
    // Only include boothid if selectedTicket exists and has boothType (indicating it's a booth)
    return selectedTicket && selectedTicket.boothType !== undefined;
  };

  // Get boothid only if it's a booth selection
  const boothId = shouldIncludeBoothId()
    ? selectedTicket?._id || selectedTicket?.id || ticketId
    : undefined;

  // Calculate number of days selected
  const calculateDays = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
      return daysDiff;
    }
    return 1; // Default to 1 day if dates not available
  };

  const numberOfDays = calculateDays();

  // Format Canadian phone number
  const formatCanadianPhoneNumber = (phone: string): string => {
    if (!phone) return phone;
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // If it starts with 1, remove it (country code)
    const phoneNumber = digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly;
    
    // Check if it's a valid 10-digit Canadian number
    if (phoneNumber.length === 10) {
      // Format as (XXX) XXX-XXXX
      return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
    
    // If not 10 digits, return as is with +1 prefix
    return `+1 ${phone}`;
  };

  // Debug: Log all data to see what's being passed
  console.log("=== REVIEW SUMMARY - COMPLETE DATA ===");
  console.log("PaymentData:", paymentData);
  console.log("BookingData:", bookingData);
  console.log("EventData:", eventData);
  console.log("MemberCount:", memberCount);
  console.log("TicketPrice:", ticketPrice);
  console.log("EntryFee:", entryFee);
  console.log("SelectedStartDate:", selectedStartDate);
  console.log("SelectedEndDate:", selectedEndDate);
  console.log("NumberOfDays:", numberOfDays);
  console.log("TicketType:", ticketType);
  console.log("TicketId:", ticketId);
  console.log("SelectedTicket:", selectedTicket);
  console.log("SelectedTicket ID:", selectedTicket?.id);
  console.log("SelectedTicket _ID:", selectedTicket?._id);
  console.log("BookingData ticketId:", bookingData?.ticketId);
  console.log("=== END REVIEW SUMMARY DATA ===");

  // Debug discount calculation inputs
  console.log("=== DISCOUNT INPUT DEBUG ===");
  console.log("entryFee:", entryFee, "type:", typeof entryFee);
  console.log("ticketPrice:", ticketPrice, "type:", typeof ticketPrice);
  console.log("memberCount:", memberCount, "type:", typeof memberCount);
  console.log("numberOfDays:", numberOfDays, "type:", typeof numberOfDays);
  console.log("ticketType:", ticketType, "type:", typeof ticketType);
  console.log("=== END DISCOUNT INPUT DEBUG ===");

  const [promoCode, setPromoCode] = useState(routePromoCode || "");
  const [selectedPromoCode, setSelectedPromoCode] = useState<any>(null);
  const [showPromoCodeList, setShowPromoCodeList] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [apiPricing, setApiPricing] = useState<any>(null);

  // Redux selectors
  const {
    fetchPromoCodes,
    fetchPromoCodesErr,
    applyPromoCode,
    applyPromoCodeErr,
  } = useSelector((state: any) => state.auth);

  // Handle fetch promo codes response
  useEffect(() => {
    if (fetchPromoCodes && fetchPromoCodes.status === 1) {
      console.log("✅ Promo codes fetched successfully:", fetchPromoCodes.data);
    } else if (fetchPromoCodesErr) {
      console.log("❌ Fetch promo codes error:", fetchPromoCodesErr);
      Alert.alert("Error", fetchPromoCodesErr);
    }
  }, [fetchPromoCodes, fetchPromoCodesErr]);

  // Handle apply promo code response
  useEffect(() => {
    if (applyPromoCode && applyPromoCode.status === 1) {
      console.log(
        "✅ Promo code applied successfully:===>",
        applyPromoCode.data
      );
      console.log("✅ Promo code applied summary:===>", applyPromoCode.summary);

      // Update pricing with promo code discount from API response
      if (applyPromoCode.summary) {
        const summary = applyPromoCode.summary;
        console.log("📊 Summary from API:", summary);
        console.log("📊 ticketCost from API:", summary.ticketCost);
        console.log("📊 boothCost from API:", summary.boothCost);
        const updatedPricing = {
          entryFee: summary.memberCost || 0,
          ticketPrice: summary.ticketCost || summary.boothCost || 0, // Use ticketCost for tickets, boothCost for booths
          discount: parseFloat(summary.discount) || 0,
          fees: parseFloat(summary.fees) || 0,
          total: summary.total || 0,
        };
        console.log("📊 Updated pricing object:", updatedPricing);

        // Store API pricing for use in UI
        setApiPricing(updatedPricing);

        // Update price breakdown
        setPriceBreakdown({
          memberCost: updatedPricing.entryFee,
          boothCost: updatedPricing.ticketPrice, // This will be ticketCost for tickets, boothCost for booths
          discount: updatedPricing.discount.toFixed(2),
          fees: updatedPricing.fees.toFixed(2),
          total: updatedPricing.total,
        });

        console.log("📊 Updated pricing from API:", updatedPricing);
      }

      setSelectedDiscount(promoCode);
      // Alert.alert("Success", "Promo code applied successfully!");
    } else if (applyPromoCodeErr) {
      console.log("❌ Apply promo code error:", applyPromoCodeErr);
      Alert.alert("Error", applyPromoCodeErr);
    }
  }, [applyPromoCode, applyPromoCodeErr, promoCode]);

  // Debug: Track reviewSummary changes
  useEffect(() => {
    console.log("reviewSummary", reviewSummary);
  }, [reviewSummary]);

  // Generate booking payload for API
  const generateBookingPayload = (pricing: any, paymentIntentId?: string) => {
    const baseEntryFee =
      (entryFee || 0) * (memberCount || 1) * (numberOfDays || 1);
    const baseTicketPrice =
      (ticketPrice || 0) * (memberCount || 1) * (numberOfDays || 1);

    // Debug: Log the values we're working with
    console.log("=== BOOTH/TICKET ID DEBUG ===");
    console.log("selectedTicket:", selectedTicket);
    console.log("selectedTicket?.id:", selectedTicket?.id);
    console.log("selectedTicket?._id:", selectedTicket?._id);
    console.log("ticketId:", ticketId);
    console.log("selectedTicket?.boothType:", selectedTicket?.boothType);
    console.log("selectedTicket?.ticketType:", selectedTicket?.ticketType);
    console.log("=== END BOOTH/TICKET ID DEBUG ===");

    // Determine if this is a booth or ticket based on selectedTicket data
    const isBooth = selectedTicket?.boothType !== undefined;

    const basePayload = {
      eventId: eventData?._id || ticketId || "",
      hostId: eventData?.userId?._id || eventData?.userId,
      members: eventData?.type === 'Table' ? eventData?.eventCapacity : memberCount || 1,
      discount: Number(pricing.discount.toFixed(2)), // Keep 2 decimal places for currency
      fees: Number(pricing.fees.toFixed(2)), // Keep 2 decimal places for currency
      totalAmount: Number(pricing.total.toFixed(2)), // Keep 2 decimal places for currency (13.56 not 14)
      transactionInfo: paymentIntentId || `TXN${Date.now()}`, // Use payment intent ID or generate unique transaction ID
      bookingStartDate: selectedStartDate || new Date().toISOString(),
      bookingEndDate: selectedEndDate || new Date().toISOString(),
      isTable: eventData?.type === 'Table' ? 'yes' : 'no', // Pass yes/no (lowercase) based on event type
    };

    console.log("===> basePayload", basePayload);

    // Extract IDs with better fallbacks
    let extractedId =
      selectedTicket?.id || selectedTicket?._id || ticketId || "";

    // If no ID found, try to get it from event data
    if (!extractedId) {
      if (isBooth && eventData?.booths?.[0]) {
        extractedId = eventData.booths[0]._id || eventData.booths[0].id || "";
        console.log("Using booth ID from event data:", extractedId);
      } else if (!isBooth && eventData?.tickets?.[0]) {
        extractedId = eventData.tickets[0]._id || eventData.tickets[0].id || "";
        console.log("Using ticket ID from event data:", extractedId);
      }
    }

    const extractedBoothTypeId =
      selectedTicket?.boothType?._id || selectedTicket?.boothType || "";
    const extractedTicketTypeId =
      selectedTicket?.ticketType?._id || selectedTicket?.ticketType || "";

    console.log("=== EXTRACTED IDS ===");
    console.log("extractedId:", extractedId);
    console.log("extractedBoothTypeId:", extractedBoothTypeId);
    console.log("extractedTicketTypeId:", extractedTicketTypeId);
    console.log("=== END EXTRACTED IDS ===");

    // Only include booth/ticket data if we have valid data
    const hasValidBoothData =
      isBooth && extractedId && extractedBoothTypeId && baseTicketPrice > 0;
    const hasValidTicketData =
      !isBooth && extractedId && extractedTicketTypeId && baseTicketPrice > 0;

    // Add booth-specific or ticket-specific fields only if data is available
    if (hasValidBoothData) {
      return {
        ...basePayload,
        boothCost: baseTicketPrice,
        boothType: extractedBoothTypeId,
        boothId: extractedId,
      };
    } else if (hasValidTicketData) {
      return {
        ...basePayload,
        ticketCost: baseTicketPrice,
        ticketType: extractedTicketTypeId,
        ticketId: extractedId,
      };
    } else {
      // Return base payload without booth/ticket specific fields if no valid data
      console.log(
        "No valid booth or ticket data available, returning base payload only"
      );
      return basePayload;
    }
  };

  // Calculate discount only if explicitly provided from previous screens
  const calculateDynamicDiscount = () => {
    let discount = 0;

    // Check if discount was explicitly selected in previous screens or current screen
    const hasDiscountFromBooking =
      bookingData?.discount ||
      bookingData?.selectedDiscount ||
      bookingData?.promoCode;
    const hasDiscountFromPayment =
      (paymentData as any)?.discount ||
      (paymentData as any)?.selectedDiscount ||
      paymentData?.promoCode;
    const hasLocalDiscount = selectedDiscount || promoCode;

    // Only apply discount if it was selected in previous screens or current screen
    if (
      !hasDiscountFromBooking &&
      !hasDiscountFromPayment &&
      !hasLocalDiscount
    ) {
      console.log("=== NO DISCOUNT SELECTED ===");
      console.log(
        "No discount was selected in previous screens or current screen"
      );
      console.log("BookingData discount:", bookingData?.discount);
      console.log("PaymentData discount:", (paymentData as any)?.discount);
      console.log("Local selectedDiscount:", selectedDiscount);
      console.log("PromoCode:", promoCode);
      console.log("=== END NO DISCOUNT ===");
      return 0;
    }

    // Ensure all values are numbers
    const safeEntryFee = Number(entryFee) || 0;
    const safeTicketPrice = Number(ticketPrice) || 0;
    const safeMemberCount = Number(memberCount) || 1;
    const safeNumberOfDays = Number(numberOfDays) || 1;

    const baseEntryFee = safeEntryFee * safeMemberCount * safeNumberOfDays;
    const baseTicketPrice =
      safeTicketPrice * safeMemberCount * safeNumberOfDays;
    const baseAmount = baseEntryFee + baseTicketPrice;

    // Apply discount only if it was selected
    if (hasDiscountFromBooking || hasDiscountFromPayment || hasLocalDiscount) {
      // Discount based on member count (only if selected)
      if (safeMemberCount >= 4) {
        discount += baseAmount * 0.15; // 15% discount for 4+ members
      } else if (safeMemberCount >= 2) {
        discount += baseAmount * 0.1; // 10% discount for 2+ members
      }

      // Discount based on number of days (only if selected)
      if (safeNumberOfDays >= 3) {
        discount += baseAmount * 0.2; // 20% discount for 3+ days
      } else if (safeNumberOfDays >= 2) {
        discount += baseAmount * 0.15; // 15% discount for 2+ days
      }

      // Discount based on ticket type (only if selected)
      if (
        ticketType?.toLowerCase().includes("vip") ||
        ticketType?.toLowerCase().includes("premium")
      ) {
        discount += baseAmount * 0.15; // 15% discount for VIP/Premium tickets
      } else if (
        ticketType?.toLowerCase().includes("gala") ||
        ticketType?.toLowerCase().includes("special")
      ) {
        discount += baseAmount * 0.12; // 12% discount for Gala/Special events
      } else if (ticketType?.toLowerCase().includes("dj")) {
        discount += baseAmount * 0.1; // 10% discount for DJ events
      }
    }

    // Maximum discount cap (30% of total amount)
    const maxDiscount = baseAmount * 0.3;
    const finalDiscount = Math.min(discount, maxDiscount);

    console.log("=== DISCOUNT CALCULATION DEBUG ===");
    console.log("Has discount from booking:", hasDiscountFromBooking);
    console.log("Has discount from payment:", hasDiscountFromPayment);
    console.log("Entry Fee per person per day:", safeEntryFee);
    console.log("Ticket Price per person per day:", safeTicketPrice);
    console.log("Member Count:", safeMemberCount);
    console.log("Number of Days:", safeNumberOfDays);
    console.log("Base Entry Fee Total:", baseEntryFee);
    console.log("Base Ticket Price Total:", baseTicketPrice);
    console.log("Base Amount (Entry + Ticket):", baseAmount);
    console.log("Calculated Discount:", discount);
    console.log("Max Discount (30%):", maxDiscount);
    console.log("Final Discount Applied:", finalDiscount);
    console.log("=== END DISCOUNT DEBUG ===");

    return finalDiscount;
  };

  // Get discount breakdown for display (only if discount was selected)
  const getDiscountBreakdown = () => {
    const breakdown = [];

    // Check if discount was explicitly selected in previous screens
    const hasDiscountFromBooking =
      bookingData?.discount ||
      bookingData?.selectedDiscount ||
      bookingData?.promoCode;
    const hasDiscountFromPayment =
      (paymentData as any)?.discount ||
      (paymentData as any)?.selectedDiscount ||
      paymentData?.promoCode;

    // Only show breakdown if discount was selected
    if (!hasDiscountFromBooking && !hasDiscountFromPayment) {
      return "No discount selected";
    }

    // Ensure all values are numbers
    const safeEntryFee = Number(entryFee) || 0;
    const safeTicketPrice = Number(ticketPrice) || 0;
    const safeMemberCount = Number(memberCount) || 1;
    const safeNumberOfDays = Number(numberOfDays) || 1;

    const baseEntryFee = safeEntryFee * safeMemberCount * safeNumberOfDays;
    const baseTicketPrice =
      safeTicketPrice * safeMemberCount * safeNumberOfDays;
    const baseAmount = baseEntryFee + baseTicketPrice;

    // Member count discount
    if (safeMemberCount >= 4) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.15) / baseAmount) * 100)}% group`
      );
    } else if (safeMemberCount >= 2) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.1) / baseAmount) * 100)}% group`
      );
    }

    // Days discount
    if (safeNumberOfDays >= 3) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.2) / baseAmount) * 100)}% multi-day`
      );
    } else if (safeNumberOfDays >= 2) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.15) / baseAmount) * 100)}% multi-day`
      );
    }

    // Ticket type discount
    if (
      ticketType?.toLowerCase().includes("vip") ||
      ticketType?.toLowerCase().includes("premium")
    ) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.15) / baseAmount) * 100)}% VIP`
      );
    } else if (
      ticketType?.toLowerCase().includes("gala") ||
      ticketType?.toLowerCase().includes("special")
    ) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.12) / baseAmount) * 100)}% special`
      );
    } else if (ticketType?.toLowerCase().includes("dj")) {
      breakdown.push(
        `${Math.round(((baseAmount * 0.1) / baseAmount) * 100)}% DJ`
      );
    }

    return breakdown.join(", ");
  };

  // Calculate dynamic pricing based on member count and days using useMemo
  const dynamicPricing = useMemo(() => {
    // Use API pricing if available (from promo code response)
    if (apiPricing) {
      console.log("=== USING API PRICING ===");
      console.log("API Pricing:", apiPricing);
      return apiPricing;
    }

    // Otherwise calculate normally
    const baseEntryFee = entryFee * memberCount * numberOfDays;
    const baseTicketPrice = ticketPrice * memberCount * numberOfDays;
    const discount = calculateDynamicDiscount();
    const fees = Math.round((baseEntryFee + baseTicketPrice) * 0.05); // 5% service fee
    const total = baseEntryFee + baseTicketPrice - discount + fees;

    console.log("=== DYNAMIC DISCOUNT CALCULATION ===");
    console.log("Entry Fee per person per day:", entryFee);
    console.log("Ticket Price per person per day:", ticketPrice);
    console.log("Member Count:", memberCount);
    console.log("Number of Days:", numberOfDays);
    console.log("Ticket Type:", ticketType);
    console.log("Base Entry Fee Total:", baseEntryFee);
    console.log("Base Ticket Price Total:", baseTicketPrice);
    console.log(
      "Base Amount (Entry + Ticket):",
      baseEntryFee + baseTicketPrice
    );
    console.log("Calculated Discount:", discount);
    console.log("Fees (5% of base):", fees);
    console.log(
      "Calculation: (",
      baseEntryFee,
      "+",
      baseTicketPrice,
      ") -",
      discount,
      "+",
      fees,
      "=",
      total
    );
    console.log("=== END DISCOUNT CALCULATION ===");

    const pricing = {
      entryFee: baseEntryFee,
      ticketPrice: baseTicketPrice,
      discount: discount,
      fees: fees,
      total: total,
      memberCount: memberCount,
      numberOfDays: numberOfDays,
    };

    // Log booking payload
    const bookingPayload = generateBookingPayload(pricing);
    console.log("=== BOOKING API PAYLOAD ===");
    console.log(JSON.stringify(bookingPayload, null, 2));
    console.log("=== END BOOKING API PAYLOAD ===");

    return pricing;
  }, [
    entryFee,
    memberCount,
    numberOfDays,
    ticketPrice,
    ticketType,
    apiPricing,
  ]);

  // Debug: Track dynamicPricing changes
  useEffect(() => {
    console.log("🔄 dynamicPricing updated:", dynamicPricing);
    console.log("🔄 Discount in dynamicPricing:", dynamicPricing.discount);
  }, [dynamicPricing]);

  useEffect(() => {
    // Check platform pay support
    checkPlatformPaySupport();
    // Fetch profile details to get stripeCustomerId
    fetchProfileDetail();
  }, []);

  // Handle profile details response
  useEffect(() => {
    if (
      getProfileDetail?.status === true ||
      getProfileDetail?.status === "true" ||
      getProfileDetail?.status === 1 ||
      getProfileDetail?.status === "1"
    ) {
      console.log("Profile detail response:", getProfileDetail);
      console.log(
        "Stripe Customer ID:",
        getProfileDetail?.data?.stripeCustomerId
      );
      setProfileDetail(getProfileDetail?.data);
      setStripeCustomerId(getProfileDetail?.data?.stripeCustomerId || "");
      dispatch(getProfileDetailData(""));
    }

    if (getProfileDetailErr) {
      console.log("Profile detail error:", getProfileDetailErr);
      // Don't show error toast for profile details as it's not critical for payment
      dispatch(getProfileDetailError(""));
    }
  }, [getProfileDetail, getProfileDetailErr, dispatch]);

  const fetchProfileDetail = () => {
    dispatch(onGetProfileDetail({}));
  };

  useEffect(() => {
    const promoPayload: any = {
      eventid: eventData?._id || "",
      members: memberCount || 1,
      days: numberOfDays || 1,
    };

    // Check if it's a booth booking or ticket booking
    const isBoothBooking = selectedTicket?.boothType !== undefined;
    const isTicketBooking =
      selectedTicket?.ticketType !== undefined ||
      (!isBoothBooking && ticketId && ticketId.trim() !== "");

    if (isBoothBooking && boothId && boothId.trim() !== "") {
      // For booth bookings, include boothid
      promoPayload.boothid = boothId;
      console.log("🔍 Promo payload for booth booking:", promoPayload);
    } else if (isTicketBooking && ticketId && ticketId.trim() !== "") {
      // For ticket bookings, include ticketid
      promoPayload.ticketid = ticketId;
      console.log("🔍 Promo payload for ticket booking:", promoPayload);
    } else {
      // When nothing is selected, only pass eventid, members, and days
      console.log(
        "🔍 Promo payload for event-only booking (no ticket/booth selected):",
        promoPayload
      );
    }
    console.log("===> promoPayload", promoPayload);
    dispatch(onApplyPromoCode(promoPayload));
  }, [eventData, memberCount, numberOfDays, boothId, ticketId, selectedTicket]);

  // Check platform pay support
  const checkPlatformPaySupport = async () => {
    try {
      const supported = await isPlatformPaySupported({
        googlePay: {
          testEnv: false,
        },
      });
      setIsGooglePaySupported(supported);
    } catch (error) {
      console.error("Error checking platform pay support:", error);
    }
  };

  // Set price breakdown immediately using dynamic pricing
  useEffect(() => {
    setPriceBreakdown({
      memberCost: dynamicPricing.entryFee,
      boothCost: dynamicPricing.ticketPrice,
      discount: dynamicPricing.discount.toFixed(2),
      fees: dynamicPricing.fees.toFixed(2),
      total: dynamicPricing.total,
    });
  }, [dynamicPricing]);

  // Set user data from API response if available, otherwise use fallback
  useEffect(() => {
    if (
      reviewSummary &&
      reviewSummary.status === 1 &&
      reviewSummary.data &&
      reviewSummary.data.userId
    ) {
    console.log("reviewSummary.data", reviewSummary.data);
      // Get tableNumber from eventData first, then fallback to API response
      const tableNumberValue = eventData?.tableNumber !== undefined && eventData?.tableNumber !== null
        ? String(eventData.tableNumber)
        : reviewSummary.data.tableNumber !== undefined && reviewSummary.data.tableNumber !== null
        ? String(reviewSummary.data.tableNumber)
        : "N/A";
      
      setUserData({
        fullName: reviewSummary.data.userId.fullName || "N/A",
        phoneNumber: reviewSummary.data.userId.phone || "N/A",
        email: reviewSummary.data.userId.email || "N/A",
        boothName: ticketType || "N/A", 
        tableNumber: tableNumberValue,
      });
    } else {
      console.log("reviewSummary.data", reviewSummary.data);

      // Set fallback user data if API doesn't provide it
      // Get tableNumber from eventData if available
      const tableNumberValue = eventData?.tableNumber !== undefined && eventData?.tableNumber !== null
        ? String(eventData.tableNumber)
        : "N/A";
      
      setUserData({
        fullName: "N/A",
        phoneNumber: "N/A",
        email: "N/A",
        boothName: ticketType || "N/A",
        tableNumber: tableNumberValue,
      });
    }
  }, [reviewSummary, ticketType, eventData]);

  // Handle booking creation response
  useEffect(() => {
    if (createBooking && createBooking.status === 1) {
      console.log("🎉 BOOKING CREATION SUCCESSFUL!");
      console.log(
        "📋 Full Booking Response:",
        JSON.stringify(createBooking, null, 2)
      );
      console.log(
        "✅ Booking ID:",
        createBooking.data?._id || createBooking.data?.id
      );
      console.log("✅ Booking Status:", createBooking.status);
      console.log("✅ Total Amount:", createBooking.data?.totalAmount);
      // Handle successful booking creation
      // You can navigate to success screen or show success message
    } else if (createBookingErr) {
      console.log("❌ BOOKING CREATION FAILED!");
      console.log(
        "📋 Error Details:",
        JSON.stringify(createBookingErr, null, 2)
      );
      // Handle booking creation error
      // You can show error message to user
    }
  }, [createBooking, createBookingErr]);

  // Handle favorite toggle response
  useEffect(() => {
    if (
      togglefavorite?.status === true ||
      togglefavorite?.status === "true" ||
      togglefavorite?.status === 1 ||
      togglefavorite?.status === "1"
    ) {
      console.log("togglefavorite response in ReviewSummary:", togglefavorite);

      // Update like state based on server response
      if (togglefavorite?.data?.isFavorite !== undefined) {
        const newLikeState = togglefavorite.data.isFavorite;
        setIsFavorite(newLikeState);
        console.log("Like state updated from server:", newLikeState);
      }

      dispatch(togglefavoriteData(""));
    }

    if (togglefavoriteErr) {
      console.log("togglefavoriteErr in ReviewSummary:", togglefavoriteErr);
      dispatch(togglefavoriteError(""));
    }
  }, [togglefavorite, togglefavoriteErr, dispatch]);

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

  // Send booking data to API using Redux
  const sendBookingToAPI = (paymentIntentId?: string) => {
    const bookingPayload = generateBookingPayload(dynamicPricing, paymentIntentId);
    console.log("=== SENDING BOOKING TO API VIA REDUX ===");
    console.log("API Endpoint: POST /user/booking");
    console.log("Payload:====>", JSON.stringify(bookingPayload, null, 2));

    dispatch(onCreateBooking(bookingPayload));
    console.log("✅ BOOKING API CALL DISPATCHED SUCCESSFULLY");
  };

  const handlePaymentMethodChange = () => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange();
    } else {
      // Navigate back to payments screen with updated pricing data
      const updatedPaymentData = {
        ...paymentData,
        bookingData: {
          ...paymentData?.bookingData,
          totalPrice: dynamicPricing.total,
          discount: dynamicPricing.discount,
          selectedDiscount: selectedDiscount,
        },
        totalPrice: dynamicPricing.total,
        discount: dynamicPricing.discount,
        selectedDiscount: selectedDiscount,
      };
      (nav as any).navigate("PaymentScreen", updatedPaymentData);
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

    // Check if profile details are still loading
    if (loader) {
      Alert.alert("Please Wait", "Loading customer information...");
      return;
    }

    // Check if stripeCustomerId is available for payment methods that require it
    if (
      (paymentData?.selectedCard ||
        paymentData?.selectedPaymentMethod === "apple_pay" ||
        paymentData?.selectedPaymentMethod === "google_pay") &&
      !stripeCustomerId
    ) {
      Alert.alert(
        "Error",
        "Customer information not available. Please try again."
      );
      return;
    }

    if (paymentData?.selectedCard) {
      // Process card payment
      await processCardPayment();
    } else if (paymentData?.selectedPaymentMethod === "apple_pay") {
      // Process Apple Pay
      await processApplePay();
    } else if (paymentData?.selectedPaymentMethod === "google_pay") {
      // Process Google Pay
      await processGooglePay();
    } else {
      // If no payment method selected, still create booking (for testing or if payment handled elsewhere)
      console.log("📝 NO PAYMENT METHOD - Creating booking directly...");
      sendBookingToAPI();
      // Alert.alert('Booking Created', 'Booking created successfully!');
      navigation.navigate("PaymentSuccessScreen");
    }
  };

  // Process card payment
  const processCardPayment = async () => {
    const bookingPayload = generateBookingPayload(dynamicPricing);
    console.log("=== SENDING BOOKING TO API VIA REDUX ===");
    console.log("API Endpoint: POST /user/booking");
    console.log("Payload:====>", JSON.stringify(bookingPayload, null, 2));

    if (!paymentData?.selectedCard) {
      Alert.alert("Error", "No card selected");
      return;
    }

    if (!stripeCustomerId) {
      Alert.alert(
        "Error",
        "Customer information not available. Please try again."
      );
      return;
    }

    setIsProcessingPayment(true);
    try {
      const amount = dynamicPricing.total;
      const amountInCents = Math.round(amount * 100);

      const paymentIntentResponse = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${stripeTestKey.secreteKey}`,
          },
          body: new URLSearchParams({
            amount: amountInCents.toString(),
            currency: "cad",
            customer: stripeCustomerId, // Use dynamic customer ID
            payment_method: paymentData.selectedCard.id,
            off_session: "true",
            confirm: "true",
          }).toString(),
        }
      );

      const paymentIntent = await paymentIntentResponse.json();

      console.log("💳 CARD PAYMENT INTENT RESPONSE:", paymentIntent);

      if (paymentIntent.error) {
        Alert.alert("Payment Error", paymentIntent.error.message);
      } else {
        // Send booking data to API after successful payment
        console.log("💳 CARD PAYMENT SUCCESSFUL - Creating booking...");
        sendBookingToAPI(paymentIntent.id);
        // Alert.alert('Success', 'Payment processed successfully!');
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Process Apple Pay
  const processApplePay = async () => {
    if (!stripeCustomerId) {
      Alert.alert(
        "Error",
        "Customer information not available. Please try again."
      );
      return;
    }

    try {
      const amount = dynamicPricing.total;
      const amountInCents = Math.round(amount * 100);

      const paymentIntentResponse = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${stripeTestKey.secreteKey}`,
          },
          body: new URLSearchParams({
            amount: amountInCents.toString(),
            currency: "cad",
            customer: stripeCustomerId, // Use dynamic customer ID
          }).toString(),
        }
      );

      const { client_secret } = await paymentIntentResponse.json();

      const { error, paymentIntent } = await confirmPlatformPayPayment(
        client_secret,
        {
          applePay: {
            cartItems: [
              {
                label: "Event Booking",
                amount: amount.toFixed(2),
                paymentType: "Immediate",
              } as any,
            ],
            merchantCountryCode: "CA",
            currencyCode: "CAD",
          },
        }
      );

      if (error) {
        Alert.alert("Apple Pay Error", error.localizedMessage || error.message);
      } else {
        // Send booking data to API after successful payment
        console.log("🍎 APPLE PAY SUCCESSFUL - Creating booking...");
        sendBookingToAPI(paymentIntent?.id);
        // Alert.alert('Success', 'Apple Pay payment successful!');
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error: any) {
      console.error("Apple Pay error:", error);
      Alert.alert("Error", "Apple Pay payment failed. Please try again.");
    }
  };

  // Process Google Pay
  const processGooglePay = async () => {
    if (!stripeCustomerId) {
      Alert.alert(
        "Error",
        "Customer information not available. Please try again."
      );
      return;
    }

    try {
      const amount = paymentData?.paymentAmount || priceBreakdown?.total || 0;
      const amountInCents = Math.round(amount * 100);

      const paymentIntentResponse = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${stripeTestKey.secreteKey}`,
          },
          body: new URLSearchParams({
            amount: amountInCents.toString(),
            currency: "cad",
            customer: stripeCustomerId, // Use dynamic customer ID
          }).toString(),
        }
      );

      const { client_secret } = await paymentIntentResponse.json();

      const { error, paymentIntent } = await confirmPlatformPayPayment(
        client_secret,
        {
          googlePay: {
            merchantName: "VibesReserve",
            merchantCountryCode: "CA",
            currencyCode: "CAD",
            testEnv: false,
          },
        }
      );

      if (error) {
        Alert.alert("Google Pay Error", error.message);
      } else {
        // Send booking data to API after successful payment
        console.log("📱 GOOGLE PAY SUCCESSFUL - Creating booking...");
        sendBookingToAPI(paymentIntent?.id);
        Alert.alert("Success", "Google Pay payment successful!");
        navigation.navigate("PaymentSuccessScreen");
      }
    } catch (error: any) {
      console.error("Google Pay error:", error);
      Alert.alert("Error", "Google Pay payment failed. Please try again.");
    }
  };

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      const promoPayload: any = {
        eventid: eventData?._id || "",
        members: memberCount || 1,
        days: numberOfDays || 1,
        promocode: promoCode.trim(),
      };

      // Check if it's a booth booking or ticket booking
      const isBoothBooking = selectedTicket?.boothType !== undefined;
      const isTicketBooking =
        selectedTicket?.ticketType !== undefined ||
        (!isBoothBooking && ticketId && ticketId.trim() !== "");

      if (isBoothBooking && boothId && boothId.trim() !== "") {
        // For booth bookings, include boothid
        promoPayload.boothid = boothId;
        console.log("🔍 Manual promo payload for booth booking:", promoPayload);
      } else if (isTicketBooking && ticketId && ticketId.trim() !== "") {
        // For ticket bookings, include ticketid
        promoPayload.ticketid = ticketId;
        console.log(
          "🔍 Manual promo payload for ticket booking:",
          promoPayload
        );
      } else {
        // When nothing is selected, only pass eventid, members, and days
        console.log(
          "🔍 Manual promo payload for event-only booking (no ticket/booth selected):",
          promoPayload
        );
      }

      // Dispatch apply promo code action
      dispatch(onApplyPromoCode(promoPayload));
    } else {
      Alert.alert("Invalid Code", "Please enter a valid promo code");
    }
  };

  const handlePromoCodeSelect = (promoCodeData: any) => {
    setSelectedPromoCode(promoCodeData);
    setPromoCode(promoCodeData.code);
    setShowPromoCodeList(false);

    const promoPayload: any = {
      eventid: eventData?._id || "",
      members: memberCount || 1,
      days: numberOfDays || 1,
      promocode: promoCodeData.code,
    };

    // Check if it's a booth booking or ticket booking
    const isBoothBooking = selectedTicket?.boothType !== undefined;
    const isTicketBooking =
      selectedTicket?.ticketType !== undefined ||
      (!isBoothBooking && ticketId && ticketId.trim() !== "");

    if (isBoothBooking && boothId && boothId.trim() !== "") {
      // For booth bookings, include boothid
      promoPayload.boothid = boothId;
      console.log("🔍 Promo select payload for booth booking:", promoPayload);
    } else if (isTicketBooking && ticketId && ticketId.trim() !== "") {
      // For ticket bookings, include ticketid
      promoPayload.ticketid = ticketId;
      console.log("🔍 Promo select payload for ticket booking:", promoPayload);
    } else {
      // When nothing is selected, only pass eventid, members, and days
      console.log(
        "🔍 Promo select payload for event-only booking (no ticket/booth selected):",
        promoPayload
      );
    }

    // Dispatch apply promo code action
    dispatch(onApplyPromoCode(promoPayload));
  };

  // Handle favorite toggle
  const handleFavoritePress = async () => {
    if (!eventData) {
      Alert.alert("Error", "Event data not available");
      return;
    }

    const eventId = eventData._id;
    if (!eventId) {
      Alert.alert("Error", "Event ID not available");
      return;
    }

    // Check if user has permission to like/favorite
    const hasPermission = await handleRestrictedAction(
      "canLike",
      navigation,
      "like this event"
    );

    if (!hasPermission) {
      // Show custom alert for login required
      setAlertConfig({
        title: "Login Required",
        message:
          "Please sign in to like this event. You can explore the app without an account, but some features require login.",
        primaryButtonText: "Sign In",
        secondaryButtonText: "Continue Exploring",
        onPrimaryPress: () => {
          setShowCustomAlert(false);
          (navigation as any).navigate("SignInScreen");
        },
        onSecondaryPress: () => {
          setShowCustomAlert(false);
        },
      });
      setShowCustomAlert(true);
      return;
    }

    try {
      console.log("Toggling favorite for event ID:", eventId);

      // Update local state immediately for better UX
      setIsFavorite(!isFavorite);

      // Then sync with server
      dispatch(onTogglefavorite({ eventId }));
    } catch (error) {
      console.log("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like status");
    }
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
                {/* <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
                  <HeartIcon color={colors.white} filled={isFavorite} />
                </TouchableOpacity> */}
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
                  {/* Hide date for Table type */}
                  {eventData.type !== 'Table' && (
                  <View style={styles.detailRow}>
                    <ClockIcon color={colors.violate} />
                    <Text style={styles.detailText}>
                      {new Date(eventData.startDate).toLocaleDateString()} -{" "}
                      {eventData.openingTime}
                    </Text>
                  </View>
                  )}
                </View>

                {/* <TouchableOpacity style={styles.eventActionButton}>
                  <ArrowRightIcon color={colors.white} />
                </TouchableOpacity> */}
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
          <Text style={[styles.infoLabel,{color: colors.white, fontWeight: 'bold'}]}>Host Details</Text>
          </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {eventData
                  ? eventData?.userId?.fullName
                  : loader
                  ? "Loading..."
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>
                {eventData
                  ? formatCanadianPhoneNumber(eventData?.userId?.phone || '')
                  : loader
                  ? "Loading..."
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {eventData
                  ? eventData?.userId?.email
                  : loader
                  ? "Loading..."
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {eventData?.type === 'Table' ? 'Table Number' : 'Booth Name'}
              </Text>
              <Text style={styles.infoValue}>
                {userData ? userData.tableNumber : loader ? "Loading..." : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* Discount Selection */}
          {/* <View style={styles.sectionContainerNoBorderReduced}>
            <Text style={[styles.priceLabel, { marginBottom: 10 }]}>Apply Discount</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <TouchableOpacity
                style={[
                  styles.discountButton,
                  selectedDiscount === 'group' && styles.discountButtonSelected
                ]}
                onPress={() => setSelectedDiscount(selectedDiscount === 'group' ? null : 'group')}
              >
                <Text style={[
                  styles.discountButtonText,
                  selectedDiscount === 'group' && styles.discountButtonTextSelected
                ]}>
                  Group Discount (10%)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.discountButton,
                  selectedDiscount === 'multi-day' && styles.discountButtonSelected
                ]}
                onPress={() => setSelectedDiscount(selectedDiscount === 'multi-day' ? null : 'multi-day')}
              >
                <Text style={[
                  styles.discountButtonText,
                  selectedDiscount === 'multi-day' && styles.discountButtonTextSelected
                ]}>
                  Multi-day (15%)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.discountButton,
                  selectedDiscount === 'special' && styles.discountButtonSelected
                ]}
                onPress={() => setSelectedDiscount(selectedDiscount === 'special' ? null : 'special')}
              >
                <Text style={[
                  styles.discountButtonText,
                  selectedDiscount === 'special' && styles.discountButtonTextSelected
                ]}>
                  Special Event (10%)
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Discount Banner - Only show if discount was selected in previous screens */}
          {/* {dynamicPricing.discount > 0 && (bookingData?.discount || bookingData?.selectedDiscount || bookingData?.promoCode || (paymentData as any)?.discount || (paymentData as any)?.selectedDiscount || paymentData?.promoCode || selectedDiscount) && (
            <View style={[styles.sectionContainerNoBorderReduced, { backgroundColor: '#4CAF50', marginBottom: 10 }]}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: 'white', fontWeight: 'bold' }]}>
                  🎉 You saved ${dynamicPricing.discount.toFixed(2)}!
                </Text>
                <Text style={[styles.priceValue, { color: 'white' }]}>
                  {getDiscountBreakdown()}
                </Text>
              </View>
            </View>
          )} */}

          {/* Promo Code Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <TouchableOpacity
              style={styles.browseButtonNew}
              onPress={() => {
                dispatch(
                  onFetchPromoCodes({
                    hostId: eventData?.userId?._id || "",
                  })
                );
                setShowPromoCodeList(true);
              }}
            >
              <Text style={styles.applyButtonTextNew}>Browse Promo Codes</Text>
            </TouchableOpacity>

            <View style={styles.promoCodeSectionNew}>
              <View style={styles.promoCodeContainerNew}>
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to promotional code screen when text field is clicked
                    navigation.navigate("PromotionalCode" as never);
                  }}
                  style={styles.promoCodeInputNew}
                >
                  <Text
                    style={[
                      styles.promoCodeInputNew,
                      {
                        color: promoCode ? colors.black : colors.textcolor,
                        borderWidth: 0,
                        backgroundColor: "transparent",
                        paddingRight: horizontalScale(80),
                        textAlign: "left",
                        includeFontPadding: false,
                        lineHeight: fontScale(18),
                      },
                    ]}
                  >
                    {promoCode || "Enter promo code"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButtonNew}
                  onPress={handleApplyPromoCode}
                >
                  <Text style={styles.applyButtonTextNew}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {selectedPromoCode && (
              <View style={styles.selectedPromoCodeContainer}>
                <Text style={styles.selectedPromoCodeText}>
                  Applied: {selectedPromoCode.code}
                </Text>
                <TouchableOpacity
                  style={styles.removePromoCodeButton}
                  onPress={() => {
                    setSelectedPromoCode(null);
                    setPromoCode("");
                    setSelectedDiscount(null);

                    const promoPayload: any = {
                      eventid: eventData?._id || "",
                      members: memberCount || 1,
                      days: numberOfDays || 1,
                    };

                    // Check if it's a booth booking or ticket booking
                    const isBoothBooking =
                      selectedTicket?.boothType !== undefined;
                    const isTicketBooking =
                      selectedTicket?.ticketType !== undefined ||
                      (!isBoothBooking && ticketId && ticketId.trim() !== "");

                    if (isBoothBooking && boothId && boothId.trim() !== "") {
                      // For booth bookings, include boothid
                      promoPayload.boothid = boothId;
                      console.log(
                        "🔍 Promo remove payload for booth booking:",
                        promoPayload
                      );
                    } else if (
                      isTicketBooking &&
                      ticketId &&
                      ticketId.trim() !== ""
                    ) {
                      // For ticket bookings, include ticketid
                      promoPayload.ticketid = ticketId;
                      console.log(
                        "🔍 Promo remove payload for ticket booking:",
                        promoPayload
                      );
                    } else {
                      // When nothing is selected, only pass eventid, members, and days
                      console.log(
                        "🔍 Promo remove payload for event-only booking (no ticket/booth selected):",
                        promoPayload
                      );
                    }

                    dispatch(onApplyPromoCode(promoPayload));

                    // Recalculate pricing without promo code
                    const baseEntryFee = entryFee * memberCount * numberOfDays;
                    const baseTicketPrice =
                      ticketPrice * memberCount * numberOfDays;
                    const discount = 0; // No discount when promo code is removed
                    const fees = Math.round(
                      (baseEntryFee + baseTicketPrice) * 0.05
                    ); // 5% service fee
                    const total =
                      baseEntryFee + baseTicketPrice - discount + fees;

                    const recalculatedPricing = {
                      entryFee: baseEntryFee,
                      ticketPrice: baseTicketPrice,
                      discount: discount,
                      fees: fees,
                      total: total,
                    };

                    // Set the recalculated pricing as API pricing to override dynamicPricing
                    setApiPricing(recalculatedPricing);

                    // Update price breakdown with recalculated values
                    setPriceBreakdown({
                      memberCost: recalculatedPricing.entryFee,
                      boothCost: recalculatedPricing.ticketPrice,
                      discount: recalculatedPricing.discount.toFixed(2),
                      fees: recalculatedPricing.fees.toFixed(2),
                      total: recalculatedPricing.total,
                    });

                    console.log(
                      "🔄 Recalculated pricing after removing promo code:",
                      recalculatedPricing
                    );
                    console.log(
                      "🔄 Discount value after removal:",
                      recalculatedPricing.discount
                    );
                  }}
                >
                  <Text style={styles.removePromoCodeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.sectionContainerNoBorderReduced}>
            {dynamicPricing.entryFee != 0 ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  {eventData?.type === 'Table' 
                    ? 'Price' 
                    : `Entry Fee (${memberCount} members × ${numberOfDays} days)`}
                </Text>
                <Text style={styles.priceValue}>
                  ${dynamicPricing.entryFee.toFixed(2)}
                </Text>
              </View>
            ) : (
              <></>
            )}
            {/* Hide Ticket Price for Table type */}
            {eventData?.type !== 'Table' && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Ticket Price ({memberCount} members × {numberOfDays} days)
              </Text>
              <Text style={styles.priceValue}>
                ${dynamicPricing.ticketPrice.toFixed(2)}
              </Text>
            </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Discount{" "}
                {dynamicPricing.discount > 0
                  ? `(${getDiscountBreakdown()})`
                  : "(No discount applied)"}
              </Text>
              <Text
                style={[
                  styles.priceValue,
                  dynamicPricing.discount > 0 && { color: "#4CAF50" },
                ]}
              >
                {dynamicPricing.discount > 0
                  ? `-$${dynamicPricing.discount.toFixed(2)}`
                  : `$${dynamicPricing.discount.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>HST</Text>
              <Text style={styles.priceValue}>
                ${dynamicPricing.fees.toFixed(2)}
              </Text>
            </View>
            <View style={styles.dottedLineContainer}>
              <DottedLine />
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${dynamicPricing.total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.paymentMethodLeft}>
                {selectedPaymentMethod === "apple" ||
                selectedPaymentMethod === "apple_pay" ? (
                  <ApplePayIcon />
                ) : selectedPaymentMethod === "google" ||
                  selectedPaymentMethod === "google_pay" ? (
                  <GoogleIcon />
                ) : selectedCard ? (
                  renderCardLogo(selectedCard.cardType)
                ) : Platform.OS === "ios" ? (
                  <ApplePayIcon />
                ) : (
                  <GoogleIcon />
                )}

                <Text style={styles.paymentMethodText}>
                  {selectedPaymentMethod === "apple" ||
                  selectedPaymentMethod === "apple_pay"
                    ? "Apple Pay"
                    : selectedPaymentMethod === "google" ||
                      selectedPaymentMethod === "google_pay"
                    ? "Google Pay"
                    : selectedCard
                    ? `${selectedCard.cardType.toUpperCase()} •••• ${selectedCard.cardNumber.slice(
                        -4
                      )}`
                    : Platform.OS === "ios"
                    ? "Apple Pay"
                    : "Google Pay"}
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
            {(selectedPaymentMethod === "apple" ||
              selectedPaymentMethod === "apple_pay" ||
              (Platform.OS === "ios" &&
                !selectedPaymentMethod &&
                !selectedCard)) && (
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
            {(selectedPaymentMethod === "google" ||
              selectedPaymentMethod === "google_pay" ||
              (Platform.OS === "android" &&
                !selectedPaymentMethod &&
                !selectedCard &&
                isGooglePaySupported)) && (
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
                  title={
                    isProcessingPayment
                      ? "Processing Card Payment..."
                      : "Confirm Payment"
                  }
                  onPress={processCardPayment}
                  style={styles.cardPaymentButton}
                  disabled={isProcessingPayment}
                />
              </View>
            )}
          </View>
          {/* General Confirm Payment Button - Show when no specific payment method is selected */}
          {!selectedCard && !selectedPaymentMethod && (
            <View style={styles.cardPaymentContainer}>
              <Buttons
                title="Confirm Booking"
                onPress={handleConfirmPayment}
                style={styles.cardPaymentButton}
              />
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Promo Code List Modal */}
      <Modal
        visible={showPromoCodeList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPromoCodeList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Promo Code</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPromoCodeList(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {fetchPromoCodes?.status === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary_pink} />
              <Text style={styles.loadingText}>Loading promo codes...</Text>
            </View>
          ) : (
            <FlatList
              data={fetchPromoCodes?.data || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.promoCodeItem}
                  onPress={() => handlePromoCodeSelect(item)}
                >
                  <View style={styles.promoCodeHeader}>
                    <Text style={styles.promoCodeText}>{item.code}</Text>
                    {/* <Text style={styles.discountText}>
                      {item.discountType === 'percentage' ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`}
                    </Text> */}
                  </View>
                  <Text style={styles.promoCodeDescription}>
                    {item.description}
                  </Text>
                  {item.minAmount && (
                    <Text style={styles.minAmountText}>
                      Min. order: ₹{item.minAmount}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.promoCodeList}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No promo codes available
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>

      <CustomAlert
        visible={showCustomAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText={alertConfig.primaryButtonText}
        secondaryButtonText={alertConfig.secondaryButtonText}
        onPrimaryPress={alertConfig.onPrimaryPress}
        onSecondaryPress={alertConfig.onSecondaryPress}
        onClose={() => setShowCustomAlert(false)}
      />
    </SafeAreaWrapper>
  );
};

export default ReviewSummary;
