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
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../../utilis/colors";
import { BackButton } from "../../../../components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaperAirplaneIcon from "../../../../assets/svg/paperAirplaneIcon";
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
import { longPollingService } from "../../../../services/longPollingService";

interface Message {
  _id: string;
  senderId: string | { _id: string; fullName?: string };
  receiverId: string | { _id: string; fullName?: string };
  message: string;
  timestamp?: string; // some APIs return timestamp
  createdAt?: string; // backend sample uses createdAt
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
  const insets = useSafeAreaInsets();
  
  const { otherUserId, otherUserName, otherUserProfilePicture, conversationId } = 
    route.params as ChatScreenParams;

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef<number>(0);
  const lastMessageIdRef = useRef<string>("");

  // Redux state
  const conversation = useSelector((state: any) => state.auth.conversation) || [];
  const sendMessage = useSelector((state: any) => state.auth.sendMessage);
  const sendMessageErr = useSelector((state: any) => state.auth.sendMessageErr);
  const conversationErr = useSelector((state: any) => state.auth.conversationErr);

  // Determine current user ID from storage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("user_data");
        if (userDataStr) {
          const parsed = JSON.parse(userDataStr);
          const id = parsed?.id || parsed?._id || "";
          if (id) {
            setCurrentUserId(id);
            return;
          }
        }
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          const id = parsed?.id || parsed?._id || "";
          if (id) setCurrentUserId(id);
        }
      } catch (e) {
        // noop
      }
    };
    loadUserId();
  }, []);

  // Load conversation on component mount
  useEffect(() => {
    if (otherUserId) {
      // Clear messages immediately when opening new chat
      setMessages([]);
      setIsLoadingConversation(true);
      
      // Start 6-second loader timer
      const loaderTimer = setTimeout(() => {
        setIsLoadingConversation(false);
      }, 1000);
      
      // Fetch conversation data
      dispatch(onGetConversation({ otherUserId }));
      
      return () => {
        clearTimeout(loaderTimer);
      };
    }
  }, [otherUserId, dispatch]);

  // Function to check if there are new messages
  const hasNewMessages = (newMessages: Message[]): boolean => {
    if (newMessages.length === 0) return false;
    
    // If this is the first time loading messages, consider it new
    if (lastMessageCountRef.current === 0) {
      return true;
    }
    
    // Check if message count increased
    if (newMessages.length > lastMessageCountRef.current) {
      return true;
    }
    
    // Check if the last message ID changed (new message added)
    const lastMessage = newMessages[newMessages.length - 1];
    const currentLastMessageId = lastMessage._id || lastMessage.timestamp || lastMessage.createdAt;
    
    if (currentLastMessageId !== lastMessageIdRef.current && lastMessageIdRef.current !== "") {
      return true;
    }
    
    return false;
  };

  // Update messages when conversation data changes
  useEffect(() => {
    const raw = Array.isArray(conversation)
      ? conversation
      : (conversation?.data as Message[]) || [];
    
    if (raw && raw.length > 0) {
      // Check if there are new messages before updating
      const hasNew = hasNewMessages(raw);
      
      setMessages(raw);
      
      // Only scroll if there are new messages
      if (hasNew) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
      }
      
      // Update refs for next comparison
      lastMessageCountRef.current = raw.length;
      if (raw.length > 0) {
        const lastMessage = raw[raw.length - 1];
        lastMessageIdRef.current = lastMessage._id || lastMessage.timestamp || lastMessage.createdAt;
      }
    }
  }, [conversation]);

  // Clear messages when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Clear messages when screen is focused
      setMessages([]);
      setIsLoadingConversation(true);
      
      // Start 6-second loader timer
      const loaderTimer = setTimeout(() => {
        setIsLoadingConversation(false);
      }, 6000);
      
      return () => {
        clearTimeout(loaderTimer);
      };
    }, [])
  );

  // Handle send message response
  useEffect(() => {
    if (sendMessage && sendMessage.status) {
      // Message sent successfully, clear input
      setMessageText("");
      setIsLoading(false);
      
      // Clear timeout
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
        sendTimeoutRef.current = null;
      }
      
      // Refresh conversation to get updated messages
      if (otherUserId) {
        dispatch(onGetConversation({ otherUserId }));
      }
    }
  }, [sendMessage, conversationId, otherUserId, dispatch]);

  // Handle send message error
  useEffect(() => {
    if (sendMessageErr) {
      setIsLoading(false);
      
      // Clear timeout
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
        sendTimeoutRef.current = null;
      }
      
      Alert.alert("Error", sendMessageErr);
    }
  }, [sendMessageErr]);

  // Handle conversation error
  useEffect(() => {
    if (conversationErr) {
      Alert.alert("Error", conversationErr);
    }
  }, [conversationErr]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }
    };
  }, []);

  // Start/stop long polling based on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(onStartLongPolling());
      
      // Set current conversation for long polling service
      if (conversationId) {
        longPollingService.setCurrentConversation(conversationId, otherUserId);
      } else if (otherUserId) {
        longPollingService.setCurrentConversation(null, otherUserId);
      }
      
      // Refresh conversation when screen comes into focus
      if (otherUserId) {
        dispatch(onGetConversation({ otherUserId }));
      }

      // Start local refresh interval as backup
      const startLocalRefresh = () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
        refreshIntervalRef.current = setInterval(() => {
          if (otherUserId) {
            dispatch(onGetConversation({ otherUserId }));
          }
        }, 6000);
      };

      startLocalRefresh();
      
      return () => {
        // Clear current conversation when leaving screen
        longPollingService.setCurrentConversation(null);
        dispatch(onStopLongPolling());
        
        // Clear local refresh interval
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }, [dispatch, conversationId, otherUserId])
  );

  // Send message
  const handleSendMessage = () => {
    if (messageText.trim() === "" || isLoading) return;
    
    const textToSend = messageText.trim();
    setIsLoading(true);
    
    // Optimistically append message locally for instant UI feedback
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      senderId: currentUserId,
      receiverId: otherUserId,
      message: textToSend,
      createdAt: new Date().toISOString(),
      isRead: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("")
    
    // Set timeout to prevent button from being stuck in loading state
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
    }
    sendTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 second timeout
    
    // Always scroll to bottom when user sends a message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    dispatch(onSendMessage({
      receiverId: otherUserId,
      message: textToSend,
      ...(conversationId ? { conversationId } : {}),
    }));
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (otherUserId) {
      dispatch(onGetConversation({ otherUserId }));
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, [dispatch, otherUserId]);

  // Format time for message display
  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isCurrentUser = (senderId: Message["senderId"]) => {
    const sender = typeof senderId === "string" ? senderId : senderId?._id;
    if (!sender || !currentUserId) return false;
    return sender === currentUserId;
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
            {formatMessageTime(item.timestamp || item.createdAt)}
            {item.isRead ? "" : ". Read"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
      {isLoadingConversation ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.white}
              colors={[colors.white]}
            />
          }
        />
      )}

      {/* Message Input */}
      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 15) }]}>
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
            isLoading && styles.sendButtonLoading,
          ]}
          onPress={handleSendMessage}
          disabled={messageText.trim() === "" || isLoading}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <PaperAirplaneIcon 
            width={20} 
            height={20} 
            color={messageText.trim() === "" ? colors.vilate20 : colors.violate} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.backgroundColor,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.7,
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
    backgroundColor: colors.violate,
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 5,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.violate,
    borderWidth: 1,
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
    backgroundColor: colors.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 60, // Ensure minimum height for input area
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.violate,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    transform: [{rotate: '-30deg'}]
  },
  sendButtonDisabled: {
    borderColor: colors.vilate20,
  },
  sendButtonLoading: {
    borderColor: colors.vilate20,
  },
});

export default ChatScreen;
