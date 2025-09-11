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
import { showToast } from "../../../utilis/toastUtils.tsx";

//API
import {
  onVerifyOtp,
  verifyOtpData,
  verifyOtpError,

  onResendVerifyOtp,
  resendVerifyOtpData,
  resendVerifyOtpError,

} from '../../../redux/auth/actions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomAlertSingleBtn } from '../../../components/CustomeAlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface OTPVerificationScreenProps {
  navigation?: any;
  route?: {
    params?: {
      email?: string;
      type?: string;
      id?: string;
    };
  };
}
import styles from "./styles";

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(159); // 2:39 in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uid, setUid] = useState(route?.params?.id);
  const inputRefs = useRef<TextInput[]>([]);
  const email = route?.params?.email || "mike.hussey@gmail.com";

  const dispatch = useDispatch();
  const verifyOtp = useSelector((state: any) => state.auth.verifyOtp);
  const verifyOtpErr = useSelector((state: any) => state.auth.verifyOtpErr);
  const resendVerifyOtp = useSelector((state: any) => state.auth.resendVerifyOtp);
  const resendVerifyOtpErr = useSelector((state: any) => state.auth.resendVerifyOtpErr);
  const [msg, setMsg] = useState('');
  // Print route params and email to console
  // console.log("Route params email:", route?.params?.email);

  useEffect(() => {

    if (
      verifyOtp?.status === true ||
      verifyOtp?.status === 'true' ||
      verifyOtp?.status === 1 ||
      verifyOtp?.status === "1"
    ) {
      console.log("verifyOtp:+>", verifyOtp);
      showToast(
        "success",
        verifyOtp?.message || "Something went wrong. Please try again."
      );
      if (route?.params?.type != 'signup') {
        navigation.navigate('ResetPasswordScreen', { id: uid })
      } else {
       // navigation.navigate('VerificationSucessScreen', { id: uid });
       navigation.navigate('LocationScreen', { id: uid });
      }
      dispatch(verifyOtpData(''));
    }

    if (verifyOtpErr) {
      console.log("verifyOtpErr:+>", verifyOtpErr);
      //setMsg(verifyOtpErr?.message?.toString())
      showToast(
        "error",
        verifyOtpErr?.message || "Something went wrong. Please try again."
      );
      dispatch(verifyOtpError(''));
    }
  }, [verifyOtp, verifyOtpErr]);

  useEffect(() => {

    if (
      resendVerifyOtp?.status === true ||
      resendVerifyOtp?.status === 'true' ||
      resendVerifyOtp?.status === 1 ||
      resendVerifyOtp?.status === "1"
    ) {
      console.log("resendVerifyOtp:+>", resendVerifyOtp);
     showToast(
      "success",
      resendVerifyOtp?.message || "Something went wrong. Please try again."
    );
      setUid(resendVerifyOtp?.data?._id);
      dispatch(resendVerifyOtpData(''));
    }
    if (resendVerifyOtpErr) {
      console.log("resendVerifyOtpErr:+>", resendVerifyOtpErr);
     showToast(
      "error",
      resendVerifyOtpErr?.message || "Something went wrong. Please try again."
    );
      dispatch(resendVerifyOtpError(''));
    }
  }, [resendVerifyOtp, resendVerifyOtpErr]);

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
    if (otpString.length !== 4) {
      Alert.alert("Error", "Please enter all 4 digits");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically validate the OTP with your backend
      console.log("OTP submitted:", otpString);
      const payload = {
       // "currentRole": "user", //user,host
        "userId": uid,
        "otp": otpString,
        "usingtype": route?.params?.type == 'signup' ? "signup" : "forgot_password",//forgot_password,signup
        "type": "email",//email,phone,
        "deviceToken": "test12221212121212122"
      }
      dispatch(onVerifyOtp(payload))
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
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      let obj = {
       // "currentRole": "user",
        "type": "email",//phone , email
        "typevalue": route?.params?.email,//phone ex:- +912345678901 , email
        "usingtype": route?.params?.type == 'signup' ? "signup" : "forgot_password"//forgot_password,signup
      }
      dispatch(onResendVerifyOtp(obj))
      // Alert.alert("Success", "OTP has been resent to your email");
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
              onPress={() => handleSubmit()}
              isCap={false}
              disabled={isSubmitDisabled || isLoading}
              style={[
                styles.submitButton,
                !isSubmitDisabled && styles.submitButtonEnabled,
              ]}
            />

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={() => handleResend()}
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
          <CustomAlertSingleBtn
            btn1Style={{ backgroundColor: colors.violate }}
            isVisible={msg != ''}
            message={msg}
            button2Text={'Ok'}
            onButton2Press={() => {
              setMsg('');
              if (msg == 'OTP request limit reached for today. Try again tomorrow.') {

              } else {
                // navigation.navigate('VerificationSucessScreen')

              }
            }}
            title={'Vibes'}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OTPVerificationScreen;
