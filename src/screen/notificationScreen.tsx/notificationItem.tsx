import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./notificationItemStyles";

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    time: string;
    isUnread: boolean;
    type: string;
  };
  onPress: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "🎫";
      case "event":
        return "💃";
      case "review":
        return "⭐";
      default:
        return "📢";
    }
  };

  return (
    <TouchableOpacity
      style={styles.notificationCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>
          {getNotificationIcon(notification.type)}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {notification.title}
          </Text>
          {notification.isUnread && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>

        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { NotificationItem };
export default NotificationItem;
