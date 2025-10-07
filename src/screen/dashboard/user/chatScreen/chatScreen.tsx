import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../../utilis/colors";
import { BackButton } from "../../../../components/BackButton";
import {
  onSendMessage,
  sendMessageData,
  sendMessageError,
  onGetConversation,
  getConversationData,
  getConversationError,
  onStartLongPolling,
  onStopLongPolling,
} from "../../../../redux/auth/actions";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}

interface ChatScreenParams {
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePicture?: string;
  conversationId?: string;
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null);
  
  const { otherUserId, otherUserName, otherUserProfilePicture, conversationId } = 
    route.params as ChatScreenParams;

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redux state
  const conversation = useSelector((state: any) => state.auth.conversation) || [];
  const sendMessage = useSelector((state: any) => state.auth.sendMessage);
  const sendMessageErr = useSelector((state: any) => state.auth.sendMessageErr);
  const conversationErr = useSelector((state: any) => state.auth.conversationErr);

  // Load conversation on component mount
  useEffect(() => {
    if (otherUserId) {
      dispatch(onGetConversation({ otherUserId }));
    }
  }, [otherUserId, dispatch]);

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversation && conversation.length > 0) {
      setMessages(conversation);
      // Scroll to bottom after messages are loaded
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation]);

  // Handle send message response
  useEffect(() => {
    if (sendMessage && sendMessage.status) {
      // Message sent successfully, clear input
      setMessageText("");
      // Refresh conversation to get updated messages
      dispatch(onGetConversation({ otherUserId }));
    }
  }, [sendMessage, otherUserId, dispatch]);

  // Handle send message error
  useEffect(() => {
    if (sendMessageErr) {
      Alert.alert("Error", sendMessageErr);
    }
  }, [sendMessageErr]);

  // Handle conversation error
  useEffect(() => {
    if (conversationErr) {
      Alert.alert("Error", conversationErr);
    }
  }, [conversationErr]);

  // Start/stop long polling based on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(onStartLongPolling());
      
      return () => {
        dispatch(onStopLongPolling());
      };
    }, [dispatch])
  );

  // Send message
  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    
    setIsLoading(true);
    dispatch(onSendMessage({
      receiverId: otherUserId,
      message: messageText.trim(),
    }));
  };

  // Format time for message display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isCurrentUser = (senderId: string) => {
    // You might need to get current user ID from Redux state
    // For now, we'll assume it's different from otherUserId
    return senderId !== otherUserId;
  };

  // Render message item
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = isCurrentUser(item.senderId);
    
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.otherMessageText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUser ? styles.userMessageTime : styles.otherMessageTime,
            ]}
          >
            {formatMessageTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.violate} />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <View style={styles.headerUserInfo}>
          <Image
            source={{
              uri: otherUserProfilePicture || "https://via.placeholder.com/40",
            }}
            style={styles.headerProfileImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerUserName}>{otherUserName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write your message"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            messageText.trim() === "" && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={messageText.trim() === "" || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.violate,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.violate,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.white,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  headerStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  headerSpacer: {
    width: 40,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.violate,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  sendButtonText: {
    color: colors.violate,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ChatScreen;
