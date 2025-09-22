import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import styles from "./messageDetailStyles";
import { BackButton } from "../../components/BackButton";
import SendIcon from "../../assets/svg/sendIcon";
import { colors } from "../../utilis/colors";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isFromUser: boolean;
}

interface MessageDetailScreenProps {
  navigation?: any;
  route?: {
    params: {
      chatId: string;
      userName: string;
      userAvatar: string;
      isOnline: boolean;
    };
  };
}

const MessageDetailScreen: React.FC<MessageDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { chatId, userName, userAvatar, isOnline } = route?.params || {
    chatId: "1",
    userName: "DJ Night Party",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
  };

  const [messageText, setMessageText] = useState("");

  const messages: Message[] = [
    {
      id: "1",
      text: "Hello! The dress code is formal casual.",
      timestamp: "16.50",
      isRead: true,
      isFromUser: false,
    },
    {
      id: "2",
      text: "Hi, what's the dress code?",
      timestamp: "16.50",
      isRead: true,
      isFromUser: true,
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isFromUser ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isFromUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isFromUser
              ? styles.userMessageText
              : styles.otherMessageText,
          ]}
        >
          {message.text}
        </Text>
        <View
          style={[
            styles.messageTimeContainer,
            message.isFromUser
              ? styles.userTimeContainer
              : styles.otherTimeContainer,
          ]}
        >
          <Text style={styles.messageTime}>{message.timestamp}</Text>
          {message.isFromUser && message.isRead && (
            <Text style={styles.readStatus}> · Read</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton navigation={navigation} />

          <View style={styles.userInfo}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.headerAvatar}
              resizeMode="cover"
            />
            <View style={styles.userDetails}>
              <Text style={styles.headerUserName}>{userName}</Text>
              <Text style={styles.onlineStatus}>
                {isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.messagesContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Write your message"
                placeholderTextColor={colors.primary_lighter}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <SendIcon
                  size={20}
                  color={messageText.trim() ? colors.violate : colors.textColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default MessageDetailScreen;
