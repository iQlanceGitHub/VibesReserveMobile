import React, { FC, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import BackIcon from "../../../../assets/svg/backIcon";
import ApplePayIcon from "../../../../assets/svg/applePayIcon";
import HeartIcon from "../../../../assets/svg/heartIcon";
import LocationFavourite from "../../../../assets/svg/locationFavourite";
import ClockIcon from "../../../../assets/svg/clockIcon";
import ArrowRightIcon from "../../../../assets/svg/arrowRightIcon";
import DottedLine from "../../../../assets/svg/dottedLine";
import { styles } from "./reviewSummeryStyle";

interface ReviewSummaryProps {
  navigation: any;
  onConfirmPayment?: () => void;
  onBackPress?: () => void;
  onEventPress?: () => void;
  onPaymentMethodChange?: () => void;
}

interface EventData {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  time: string;
  price: string;
  image: any;
  isFavorite: boolean;
}

interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  boothName: string;
}

interface PriceBreakdown {
  members: { count: number; price: number };
  vipBooth: number;
  discount: number;
  fees: number;
  total: number;
}

export const ReviewSummary: FC<ReviewSummaryProps> = ({
  navigation,
  onConfirmPayment,
  onBackPress,
  onEventPress,
  onPaymentMethodChange,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const eventData: EventData = {
    id: "1",
    name: "Gala Night of Hilarious Comedy at The Club",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Sep 4",
    time: "10:00 PM",
    price: "$500",
    image: {
      uri: "https://via.placeholder.com/100x80/8D34FF/FFFFFF?text=Event",
    },
    isFavorite: false,
  };

  const userData: UserData = {
    fullName: "Mike Hussey",
    phoneNumber: "+62703-701-9964",
    email: "mike.hussey@gmail.com",
    boothName: "Crystal Lounge",
  };

  const priceBreakdown: PriceBreakdown = {
    members: { count: 4, price: 500.0 },
    vipBooth: 650.0,
    discount: 15.0,
    fees: 25.0,
    total: 2665.0,
  };

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
    }
  };

  const handleConfirmPayment = () => {
    if (onConfirmPayment) {
      onConfirmPayment();
    } else {
      navigation.navigate("PaymentSuccessScreen");
    }
  };

  const handleApplyPromoCode = () => {
    // Handle promo code application logic here
    console.log("Applying promo code:", promoCode);
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

          <TouchableOpacity style={styles.eventCard} onPress={handleEventPress}>
            <View style={styles.eventImageContainer}>
              <Image source={eventData.image} style={styles.eventImage} />
              <TouchableOpacity style={styles.favoriteButton}>
                <HeartIcon color={colors.white} filled={eventData.isFavorite} />
              </TouchableOpacity>
            </View>

            <View style={styles.eventContent}>
              <View style={styles.eventHeader}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{eventData.category}</Text>
                </View>
                <Text style={styles.eventPrice}>{eventData.price}</Text>
              </View>

              <Text style={styles.eventTitle}>{eventData.name}</Text>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <LocationFavourite color={colors.violate} />
                  <Text style={styles.detailText}>{eventData.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <ClockIcon color={colors.violate} />
                  <Text style={styles.detailText}>
                    {eventData.date} - {eventData.time}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.eventActionButton}>
                <ArrowRightIcon color={colors.white} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Booth Name</Text>
              <Text style={styles.infoValue}>{userData.boothName}</Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.sectionContainerNoBorderReduced}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {priceBreakdown.members.count} Member
              </Text>
              <Text style={styles.priceValue}>
                ${priceBreakdown.members.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>VIP Booth</Text>
              <Text style={styles.priceValue}>
                ${priceBreakdown.vipBooth.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={styles.priceValue}>
                -${priceBreakdown.discount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Fees</Text>
              <Text style={styles.priceValue}>
                ${priceBreakdown.fees.toFixed(2)}
              </Text>
            </View>
            <View style={styles.dottedLineContainer}>
              <DottedLine />
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${priceBreakdown.total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.paymentMethodLeft}>
                <ApplePayIcon />
                <Text style={styles.paymentMethodText}>Apple Pay</Text>
              </View>
              <TouchableOpacity onPress={handlePaymentMethodChange}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promoCodeContainer}>
            <View style={styles.promoCodeInputContainer}>
              <TextInput
                style={styles.promoCodeInput}
                placeholder="Promo Code"
                placeholderTextColor={colors.gray20}
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyPromoCode}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Buttons
              title="Confirm Payment"
              onPress={handleConfirmPayment}
              style={styles.confirmButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default ReviewSummary;
