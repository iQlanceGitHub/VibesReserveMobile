import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BackButton } from "../../../../components/BackButton";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import CongratulationIcon from "../../../../assets/svg/congratulation";
import { styles } from "./paymentSuccessStyle";

interface PaymentSuccessProps {
  navigation: any;
  onGoHome?: () => void;
  buttonTextColor?: string;
}

export const PaymentSuccess: FC<PaymentSuccessProps> = ({
  navigation,
  onGoHome,
  buttonTextColor = colors.violate,
}) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigation.navigate("HomeTabs");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          Platform.OS === "ios" ? "transparent" : colors.gradient_dark_purple
        }
        translucent={Platform.OS === "ios"}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <View style={styles.statusBar} />
            <BackButton navigation={navigation} />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.topContentContainer}>
              <View style={styles.iconContainer}>
                <CongratulationIcon />
              </View>

              <Text style={styles.congratulationsText}>Congratulations!</Text>

              <Text style={styles.successMessage}>
                You have successfully Booked Event Ticket.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Buttons
                title="Go to Home"
                onPress={handleGoHome}
                style={styles.secondaryButton}
                textColor={buttonTextColor}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default PaymentSuccess;
