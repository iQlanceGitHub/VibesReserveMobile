import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaWrapper from "../../../../components/SafeAreaWrapper";
import { BackButton } from "../../../../components/BackButton";
import { CustomeTextInput } from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import DetailsInput from "../../../../components/DetailsInput";
import { colors } from "../../../../utilis/colors";
import * as appConstant from "../../../../utilis/appConstant";
import styles from "./helpSupportStyle";

interface HelpSupportProps {
  navigation?: any;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Submit pressed");
  };

  return (
    <SafeAreaWrapper
      backgroundColor={colors.gradient_dark_purple}
      statusBarStyle="light-content"
    >
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <BackButton
              navigation={navigation}
              onBackPress={() => navigation?.goBack()}
            />
            <Text style={styles.headerTitle}>Help and Support</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Full Name *"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  error={false}
                  message=""
                  kType={appConstant.keyboardType.default as any}
                  maxLength={50}
                  editable={true}
                  leftImage=""
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomeTextInput
                  label="Email *"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  error={false}
                  message=""
                  kType={appConstant.keyboardType.email_address as any}
                  maxLength={80}
                  editable={true}
                  leftImage=""
                />
              </View>

              <View style={styles.inputContainer}>
                <DetailsInput
                  label="Description"
                  placeholder="Enter here"
                  value={formData.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                  error={false}
                  message=""
                  required={false}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Buttons
              title="Submit"
              onPress={handleSubmit}
              disabled={false}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default HelpSupport;
