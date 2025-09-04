import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { colors } from "../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../components/buttons";
import {
  CustomeTextInput,
  CustomePasswordTextInput,
  CustomPhoneNumberInput,
} from "../../components/textinput";
import GoogleIcon from "../../assets/svg/googleIcon";
import AppleIcon from "../../assets/svg/appleIcon";
import ProfileIcon from "../../assets/svg/profile";
import MicroPhoneIcon from "../../assets/svg/microPhone";
import { BackButton } from "../../components/BackButton";
import NameIcon from "../../assets/svg/nameIcon";
import EmailIcon from "../../assets/svg/emailIcon";
import CalendarIcon from "../../assets/svg/calendarIcon";
import LockIcon from "../../assets/svg/lockIcon";

interface SignupScreenProps {
  navigation?: any;
}
import styles from "./styles";

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    dateOfBirth: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    // Handle sign up logic
    console.log("Sign up data:", { ...formData, role: selectedRole });
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log("Google sign up");
  };

  const handleAppleSignUp = () => {
    // Handle Apple sign up
    console.log("Apple sign up");
  };

  const handleDocumentUpload = () => {
    // Handle document upload
    console.log("Document upload");
  };

  return (
    <View
      style={[styles.container, { paddingTop: Platform.OS === "ios" ? 0 : 0 }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { backgroundColor: colors.primary_blue }]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.statusBar}>
              <BackButton
                navigation={navigation}
                onBackPress={() => navigation?.goBack()}
              />
              <View style={styles.statusIcons}>
                <Text style={styles.skipText}>Skip</Text>
              </View>
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Join us and start exploring</Text>
          </View>

          <View style={styles.socialSection}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignUp}
            >
              <View style={styles.socialButtonContent}>
                <View style={styles.appleIcons}>
                  <GoogleIcon />
                </View>
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignUp}
            >
              <View style={styles.socialButtonContent}>
                <View style={styles.appleIcons}>
                  <AppleIcon />
                </View>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>Choose Role</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  selectedRole === "explore" && styles.selectedRole,
                ]}
                onPress={() => setSelectedRole("explore")}
              >
                <View style={styles.roleContent}>
                  <View style={styles.roleRow}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedRole === "explore" && styles.selectedRadio,
                      ]}
                    >
                      {selectedRole === "explore" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View
                      style={[
                        styles.roleIconContainer,
                        selectedRole === "explore" &&
                          styles.selectedIconContainer,
                      ]}
                    >
                      <View style={styles.roleIcon}>
                        <ProfileIcon />
                      </View>
                    </View>
                    <Text style={styles.roleText}>Explore{"\n"}Night Life</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  selectedRole === "host" && styles.selectedRole,
                ]}
                onPress={() => setSelectedRole("host")}
              >
                <View style={styles.roleContent}>
                  <View style={styles.roleRow}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedRole === "host" && styles.selectedRadio,
                      ]}
                    >
                      {selectedRole === "host" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View
                      style={[
                        styles.roleIconContainer,
                        selectedRole === "host" && styles.selectedIconContainer,
                      ]}
                    >
                      <View style={styles.roleIcon}>
                        <MicroPhoneIcon />
                      </View>
                    </View>
                    <Text style={styles.roleText}>Become{"\n"}a Host</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <CustomeTextInput
                label="Full Name *"
                value={formData.fullName}
                placeholder="Enter your name"
                onChangeText={(text) => handleInputChange("fullName", text)}
                error={errors.fullName}
                message={errorMessages.fullName}
                leftImage={<NameIcon />}
                style={styles.customInput}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomeTextInput
                label="Email *"
                value={formData.email}
                placeholder="Enter your email"
                onChangeText={(text) => handleInputChange("email", text)}
                error={errors.email}
                message={errorMessages.email}
                leftImage={<EmailIcon />}
                kType="email-address"
                style={styles.customInput}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomPhoneNumberInput
                label="Phone Number (Optional)"
                value={formData.phoneNumber}
                placeholder="Enter phone number"
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                onPressPhoneCode={() => console.log("Phone code pressed")}
                phoneCode="+62"
                error={errors.phoneNumber}
                message={errorMessages.phoneNumber}
                style={styles.customInput}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomeTextInput
                label="Date of Birth (Optional)"
                value={formData.dateOfBirth}
                placeholder="Select your dob"
                onChangeText={(text) => handleInputChange("dateOfBirth", text)}
                error={errors.dateOfBirth}
                message={errorMessages.dateOfBirth}
                leftImage={<CalendarIcon />}
                style={styles.customInput}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomePasswordTextInput
                label="Password *"
                value={formData.password}
                placeholder="Enter your password"
                onChangeText={(text) => handleInputChange("password", text)}
                error={errors.password}
                message={errorMessages.password}
                leftImage={<LockIcon />}
                style={styles.customInput}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <CustomePasswordTextInput
                label="Confirm Password *"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
                error={errors.confirmPassword}
                message={errorMessages.confirmPassword}
                leftImage={<LockIcon />}
                style={styles.customInput}
              />
            </View>
          </View>

          <View style={styles.documentSection}>
            <Text style={styles.sectionTitle}>Upload Document</Text>
            <TouchableOpacity
              style={styles.documentUpload}
              onPress={handleDocumentUpload}
            >
              <View style={styles.documentContent}>
                <Text style={styles.documentText}>
                  Choose a file or document
                </Text>
                <Text style={styles.documentSubtext}>
                  JPEG, PNG, and PDF up to 5.0 MB
                </Text>
                <TouchableOpacity style={styles.browseButton}>
                  <Text style={styles.browseButtonText}>Browse File</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonSection}>
            <Buttons
              title="Sign Up"
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text
                  style={styles.loginLinkText}
                  onPress={() => navigation?.navigate("SignInScreen")}
                >
                  Log In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default SignupScreen;
