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
} from "../../../../redux/auth/actions";
import { horizontalScale } from "../../../../utilis/appConstant";

interface ChatItem {
  _id: string;
  conversationId?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePicture?: string;
  userId?: string;
  fullName?: string;
  businessName?: string;
  businessPicture?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageAt?: string;
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

  // Load chat list on component mount
  useEffect(() => {
    dispatch(onGetChatList());
  }, [dispatch]);

  // Refresh chat list when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Refresh chat list when screen comes into focus
      dispatch(onGetChatList());
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
        console.log("Chat item pressed:", item);
        (navigation as any).navigate("ChatScreen", {
          otherUserId: item.userId || item.otherUserId,
          otherUserName: item.businessName || item.fullName,
          otherUserProfilePicture: item.businessPicture || "https://via.placeholder.com/50",
          conversationId: item.conversationId,
        });
      }}
    >
      <View style={styles.chatItemContent}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: item.businessPicture || "https://via.placeholder.com/50",
            }}
            style={styles.profileImage}
          />
         
        </View>
        
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.businessName || item.fullName}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(item.lastMessageTime || item.lastMessageAt || "")}
            </Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage || "No messages yet"}
            </Text>
            {/* {(item.unreadCount || 0) > 0 && (
              <View style={styles.unreadDot} />
            )} */}
             {(item.unreadCount || 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
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
        {/* <BackButton navigation={navigation} /> */}
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
    backgroundColor: colors.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.backgroundColor,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
    //textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    marginLeft: horizontalScale(24),
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    backgroundColor: colors.purpleTransparent10,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.violate,
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
    top: 5,
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
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
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
