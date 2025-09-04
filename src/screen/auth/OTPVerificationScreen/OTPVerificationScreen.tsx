import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { colors } from "../../../utilis/colors";
import { fonts } from "../../../utilis/fonts";
import { BackButton } from "../../../components/BackButton";
import { Buttons } from "../../../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "../../../utilis/appConstant";

interface OTPVerificationScreenProps {
  navigation?: any;
  route?: {
    params?: {
      email?: string;
    };
  };
}
import styles from "./styles";

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(159); // 2:39 in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRefs = useRef<TextInput[]>([]);
  const email = route?.params?.email || "mike.hussey@gmail.com";

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsTimerActive(false);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Check if OTP is complete
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    setIsSubmitDisabled(!isComplete);
  }, [otp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled || isLoading) return;

    const otpString = otp.join("");
    if (otpString.length !== 5) {
      Alert.alert("Error", "Please enter all 5 digits");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Here you would typically validate the OTP with your backend
      console.log("OTP submitted:", otpString);
      
      // Navigate to next screen on success
      // navigation?.navigate("NextScreen");
     // Alert.alert("Success", "OTP verified successfully!");
      navigation?.navigate("ResetPasswordScreen");
    } catch (error) {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResendDisabled) return;

    setIsLoading(true);
    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Reset timer
      setTimer(159);
      setIsTimerActive(true);
      setIsResendDisabled(true);
      
      // Clear OTP
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
      Alert.alert("Success", "OTP has been resent to your email");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <BackButton navigation={navigation} onBackPress={handleBack} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Verification Code</Text>
            
            <Text style={styles.combinedText}>
  We have sent the code verification to your email{'   '}
  <Text style={styles.emailHighlight}>{email}</Text>
</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit !== "" && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <Text style={styles.timer}>
              {formatTime(timer)}
            </Text>

            <Buttons
              title={isLoading ? "Verifying..." : "Submit"}
              onPress={handleSubmit}
              isCap={false} 
              disabled={isSubmitDisabled || isLoading}
              style={[
                styles.submitButton,
                !isSubmitDisabled && styles.submitButtonEnabled,
              ]}
            />

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResend}
              disabled={isResendDisabled || isLoading}
            >
              <Text style={styles.resendText}>
                Didn't receive the code?{" "}
                <Text
                  style={[
                    styles.resendLink,
                    isResendDisabled && styles.resendLinkDisabled,
                  ]}
                >
                  Resend
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OTPVerificationScreen;
