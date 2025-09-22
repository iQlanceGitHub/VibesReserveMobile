import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import styles from "./chatScreenstyles";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

interface ChatScreenProps {
  navigation?: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const chatData: ChatItem[] = [
    {
      id: "1",
      name: "Sophia Perez",
      lastMessage: "Hi, Yes the table is available, so can...",
      timestamp: "Today",
      unreadCount: 1,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Andi Lane",
      lastMessage: "How is it going?",
      timestamp: "4/4/25",
      unreadCount: 4,
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Noah Pierre",
      lastMessage: "Okay, thanks!",
      timestamp: "7/4/25",
      unreadCount: 0,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const handleChatPress = (item: ChatItem) => {
    navigation?.navigate("MessageDetailScreen", {
      chatId: item.id,
      userName: item.name,
      userAvatar: item.avatar,
      isOnline: true,
    });
  };

  const renderChatItem = (item: ChatItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.chatCard}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            onError={() => console.log("Image failed to load:", item.avatar)}
            resizeMode="cover"
          />
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.nameAndTime}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <View style={styles.messageAndBadge}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.title}>Chat</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {chatData.map(renderChatItem)}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;
