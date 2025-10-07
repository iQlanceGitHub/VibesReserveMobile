import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../../utilis/colors";
import { BackButton } from "../../../../components/BackButton";
import {
  onGetChatList,
  getChatListData,
  getChatListError,
  onStartLongPolling,
  onStopLongPolling,
} from "../../../../redux/auth/actions";

interface ChatItem {
  _id: string;
  conversationId?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  messages?: any[];
}

const ChatListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Redux state
  const chatList = useSelector((state: any) => state.auth.chatList) || [];
  const chatListErr = useSelector((state: any) => state.auth.chatListErr);
  const isLongPollingActive = useSelector((state: any) => state.auth.isLongPollingActive);

  // Load chat list on component mount
  useEffect(() => {
    dispatch(onGetChatList());
  }, [dispatch]);

  // Start long polling when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(onStartLongPolling());
      
      return () => {
        dispatch(onStopLongPolling());
      };
    }, [dispatch])
  );

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(onGetChatList());
    setTimeout(() => setRefreshing(false), 1000);
  }, [dispatch]);

  // Format time for display
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render chat item
  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate("ChatScreen", {
          otherUserId: item.otherUserId,
          otherUserName: item.otherUserName,
          otherUserProfilePicture: item.otherUserProfilePicture,
          conversationId: item.conversationId,
        });
      }}
    >
      <View style={styles.chatItemContent}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: item.otherUserProfilePicture || "https://via.placeholder.com/50",
            }}
            style={styles.profileImage}
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.otherUserName}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(item.lastMessageTime)}
            </Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage || "No messages yet"}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadDot} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Chats Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation by messaging someone
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.violate} />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Chat List */}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item._id || item.conversationId || item.otherUserId}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.white}
            colors={[colors.white]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
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
    paddingBottom: 20,
    backgroundColor: colors.violate,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  chatItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
  },
  unreadBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: colors.violate,
    fontSize: 12,
    fontWeight: "bold",
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});

export default ChatListScreen;
