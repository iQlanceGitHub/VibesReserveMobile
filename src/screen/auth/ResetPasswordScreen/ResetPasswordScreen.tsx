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
  KeyboardAvoidingView,
} from "react-native";
import { colors } from "../../../utilis/colors";

import LinearGradient from "react-native-linear-gradient";
import { Buttons } from "../../../components/buttons";
import {
    CustomePasswordTextInput,
} from "../../../components/textinput";
import { BackButton } from "../../../components/BackButton";
import LockIcon from "../../../assets/svg/lockIcon";

interface ResetPasswordScreenProps {
  navigation?: any;
}
import styles from "./styles";

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps > = ({ navigation }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    
  });
  const [errorMessages, setErrorMessages] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = () => {
    // Handle sign in logic
    console.log("handle Save Password data:", formData);
    navigation?.navigate("PasswordChangedSucessScreen");
  };


  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.header}>
              <View style={styles.statusBar}>
                <BackButton
                  navigation={navigation}
                  onBackPress={() => navigation?.goBack()}
                />
               
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.subtitle}>
              The password must be different than before
              </Text>
            </View>

            

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                
              </View>
              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="Current Password *"
                  value={formData.currentPassword}
                  placeholder="Enter your password"
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.currentPassword}
                  message={errorMessages.confirmPassword}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="New Password *"
                  value={formData.currentPassword}
                  placeholder="Enter your password"
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.currentPassword}
                  message={errorMessages.confirmPassword}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <CustomePasswordTextInput
                  label="Confirm Password *"
                  value={formData.currentPassword}
                  placeholder="Enter your password"
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.currentPassword}
                  message={errorMessages.confirmPassword}
                  leftImage={<LockIcon />}
                  style={styles.customInput}
                />
              </View>

              <View style={styles.optionsSection}>
                <View style={styles.rememberMeContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={handleRememberMe}
                  >
                  
                   
                    <Text style={styles.rememberMeText}>Password must contain</Text>
                  </TouchableOpacity>
                </View>
              
              </View>
            </View>

            <View style={styles.buttonSection}>
              <Buttons
                title="Save Password"
                onPress={handleSavePassword}
                style={styles.handleSavePasswordButton}
                isCap={false}
              />
            </View>
          </ScrollView>

          
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default ResetPasswordScreen;
